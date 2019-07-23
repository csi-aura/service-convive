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
		create_perso( ctx: any) {
			this.cc.kafka.send("CREATE", ctx.params);
		}
	},




	/**
	 * Service started lifecycle event handler
	 */
	async started() {
		/** Récuperation des autres classes dans le CallClass */
		this.cc = Modules.get()
	},

	/**
	 * Service stoped lifecycle event handler
	 */
	async stopped() {},

	
	entityCreated(json: {}, ctx: any) {
		this.logger.info("New entity created!", json);
	},

	entityUpdated(json: {}, ctx: any) {
		this.logger.info(`Entity updated by '${ctx.meta.user.name}' user!`);
	},

	entityRemoved(json: {}, ctx: any) {
		this.logger.info("Entity removed", json);
	}
};

export = ConviveService;
