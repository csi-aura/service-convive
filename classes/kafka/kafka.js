"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { Kafka, logLevel } = require("kafkajs");
const uuid = require("uuid/v4");
class KafkaDriver {
    constructor() {
        this.groupId = process.env.APP_NAME || `test-service-in-dev-${uuid()}`;
        this.clientId = `${this.groupId}-${uuid()}`;
        try {
            this.brokers = process.env.KAFKA_URI.split(",");
            this.topics = process.env.KAFKA_TOPICS.split(",");
        }
        catch (error) {
            this.brokers = ["localhost:9092"];
            this.topics = ["update_channel"];
        }
        /**Definition du client Kafka */
        this.cli = new Kafka({
            clientId: this.clientId,
            brokers: this.brokers,
            logLevel: logLevel.ERROR
        });
        /**Definition du producer Kafka */
        this.producer = this.cli.producer();
        /**Definition du consumer Kafka */
        this.consumer = this.cli.consumer({
            groupId: this.groupId
        });
    }
    connexion() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.consumer.connect();
            yield this.producer.connect();
            /**Abonnement aux topics */
            this.topics.map((y) => __awaiter(this, void 0, void 0, function* () { return yield this.consumer.subscribe({ topic: y }); }));
            this.receive();
        });
    }
    deconnexion() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.consumer.disconnect();
            yield this.producer.disconnect();
        });
    }
    send(action, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.producer.send({
                topic: "update_channel",
                messages: [
                    {
                        headers: {
                            kind: "convive",
                            crud_action: action,
                            groupId: this.groupId,
                            clientId: this.clientId
                        },
                        value: Buffer.from(JSON.stringify(data))
                    }
                ]
            });
        });
    }
    receive() {
        return this.consumer;
    }
}
exports.KafkaDriver = KafkaDriver;
//# sourceMappingURL=kafka.js.map