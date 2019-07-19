"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const moleculer_1 = require("moleculer");
const kafka_1 = require("../classes/kafka/kafka");
const DbService = require("moleculer-db");
const MongoAdapter = require("moleculer-db-adapter-mongo");
const kafkaDriver = new kafka_1.KafkaDriver();
const ConviveService = {
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
        }
    },
    /**
     * Service started lifecycle event handler
     */
    started() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                /**Connexion */
                yield kafkaDriver.connexion();
                this.logger.info("kafka adapter has connected successfully.");
                /**Reception */
                kafkaDriver
                    .receive()
                    .run({
                    /**Lecture de tous les messages du/des topics abonnées */
                    eachMessage: ({ topic, partition, message }) => __awaiter(this, void 0, void 0, function* () {
                        /**Filtre les message consernant les convives et ne venant pas de ce groupe de service */
                        if (message.headers.kind.toString() === "convive" &&
                            message.headers.groupId.toString() != kafkaDriver.groupId) {
                            this.logger.info(`Demande de modification de base venant d'un autre service :
									Topic : ${topic}
									Type de donnée : ${message.headers.kind}
									Action effectuée : ${message.headers.crud_action}
									Provient du client : ${message.headers.clientId}
									Le client provient du groupe : ${message.headers.groupId}
									Data : ${message.value}`);
                            /**CRUD Routes */
                            switch (message.headers.crud_action.toString()) {
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
                    })
                });
            }
            catch (e) {
                throw new moleculer_1.Errors.MoleculerServerError("Unable to connect to kafka.", e.message);
            }
        });
    },
    /**
     * Service stoped lifecycle event handler
     */
    stopped() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield kafkaDriver.deconnexion();
                this.logger.warn("kafka adapter has disconnected.");
            }
            catch (e) {
                this.logger.warn("Unable to stop kafka connection gracefully.", e);
            }
        });
    },
    entityCreated(json, ctx) {
        this.logger.info("New entity created!", json);
        kafkaDriver.send("CREATE", json);
    },
    entityUpdated(json, ctx) {
        this.logger.info(`Entity updated by '${ctx.meta.user.name}' user!`);
        kafkaDriver.send("UPDATE", json);
    },
    entityRemoved(json, ctx) {
        this.logger.info("Entity removed", json);
        kafkaDriver.send("DELETE", json);
    }
};
module.exports = ConviveService;
//# sourceMappingURL=convives.service.js.map