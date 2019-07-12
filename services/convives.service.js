"use strict";

const DbService = require("moleculer-db");
const MongoAdapter = require("moleculer-db-adapter-mongo");

console.log("URI MONGODB => ", process.env.MONGO_URI)

module.exports = {
    name: "convives",

    mixins: [DbService],
    adapter: new MongoAdapter(process.env.MONGO_URI),
    collection: "convives",
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


        health() {
            return true;
        },

    }

};