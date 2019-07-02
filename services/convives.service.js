"use strict";

const DbService = require("moleculer-db");
const MongoAdapter = require("moleculer-db-adapter-mongo");


// CONFIGURATION DE MONGODB
const mongoAdress = process.env.MONGO_URL_CONFIGMAP || 'localhost'
const mongoPort = process.env.MONGO_PORT_CONFIGMAP || '27017'
const mongoBase = process.env.MONGO_BASE || 'test'
const mongoUser = process.env.MONGO_USER_SECRET || ''
const mongoPass = process.env.MONGO_PASS_SECRET || ''
const mongoReplicat = process.env.MONGO_RS_CONFIGMAP || ''

const mongoAuth = mongoUser != '' ? `${mongoUser}:${mongoPass}@` : ''
const mongoRep = mongoReplicat != '' ? `?replicaSet=${mongoReplicat}` : ''

const mongoUrl = `mongodb://${mongoAuth}${mongoAdress}:${mongoPort}/${mongoBase}${mongoRep}`;




module.exports = {
    name: "convives",

    mixins: [DbService],
    adapter: new MongoAdapter(mongoUrl),
    collection: "convives",
    actions: {
        create: {
            // Validator schema for params
            params: {
                nom: { type: "string", min: 2 },
                prenom: { type: "string", min: 2 }
            }
        }
    }

};