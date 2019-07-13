"use strict";
import { ServiceSchema } from "moleculer";

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
	adapter: new MongoAdapter(process.env.MONGO_URI, {useNewUrlParser: true}),
	collection: "convives",
	
	/**
	 * Service settings
	 */
	settings: {

	},

	/**
	 * Service dependencies
	 */
	dependencies: [],
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
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {

	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	// started() {

	// },

	/**
	 * Service stopped lifecycle event handler
	 */
	// stopped() {

	// },
};

export = ConviveService;
