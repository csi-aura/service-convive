"use strict";

import { ServiceSchema, Errors } from "moleculer";
import { Modules, ModelModules } from "../modules/modules";


const DbService = require("moleculer-db");
const MongoAdapter = require("moleculer-db-adapter-mongo");



const ConviveService: ServiceSchema = {
	/**
	 * Name of service
	 */
	name: "convives",
	mixins: [DbService],

	/**
	 * Mongo settings
	 */
	adapter: new MongoAdapter(process.env.MONGO_URI, { useNewUrlParser: true }),
	collection: "convives",

	/**
	 * Actions
	 */
	actions: {
		create: {
			params: {
				nom: {
					type: "string",
					min: 2
				},
				prenom: {
					type: "string",
					min: 2
				}
			}
		},

		// Heartbeat for kubernetes
		health() {
			return true;
		},

		// Heartbeat for kubernetes
		test(ctx) {
			// ctx.call('')
		}
	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {
		/** Récuperation des autres classes dans le CallClass */
		this.cc = Modules.get()

		try {
			/**Connexion */
			await this.cc.kafka.connexion()
			this.logger.info("kafka adapter has connected successfully.");

			/**Reception */
			this.cc.kafka
				.receive()
				.run({

					/**Lecture de tous les messages du/des topics abonnées */
					eachMessage: async ({ topic, partition, message }: any) => {
						let mess = JSON.parse(message.value.toString())

						/**Filtre les message consernant les convives et ne venant pas de ce groupe de service */
						if (
							mess.headers.kind === "convive" &&
							mess.headers.groupId != this.cc.kafka.groupId
						) {
							this.logger.info(
								`Demande de modification de ${mess.headers.kind} venant d'un autre service :
									Topic : ${topic}
									Type de donnée : ${mess.headers.kind}
									Action effectuée : ${mess.headers.crud_action}
									Provient du client : ${mess.headers.clientId}
									Le client provient du groupe : ${mess.headers.groupId}
									Data : ${mess.data}`);

							/**CRUD Routes */
							switch (mess.headers.crud_action) {
								case "CREATE":
									break;
								case "UPDATE":
									break;
								case "DELETE":
									break;
								default:
									break;
							}
						}
					}
				});
		} catch (e) {
			throw new Errors.MoleculerServerError(
				"Unable to connect to kafka.",
				e.message
			);
		}
	},

	/**
	 * Service stoped lifecycle event handler
	 */
	async stopped() {
		try {
			await this.cc.kafka.deconnexion();
			this.logger.warn("kafka adapter has disconnected.");
		} catch (e) {
			this.logger.warn("Unable to stop kafka connection gracefully.", e);
		}
	},

	entityCreated(json: {}, ctx: any) {
		this.logger.info("New entity created!", json);
		this.cc.kafka.send("CREATE", json);
	},

	entityUpdated(json: {}, ctx: any) {
		this.logger.info(`Entity updated by '${ctx.meta.user.name}' user!`);
		this.cc.kafka.send("UPDATE", json);
	},

	entityRemoved(json: {}, ctx: any) {
		this.logger.info("Entity removed", json);
		this.cc.kafka.send("DELETE", json);
	}
};

export = ConviveService;
