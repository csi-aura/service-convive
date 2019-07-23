"use strict";

import { Modules } from "../modules/modules";
Modules.init()


import { ServiceSchema } from "moleculer";
import ApiGateway = require("moleculer-web");


const ApiService: ServiceSchema = {
	name: "api",

	mixins: [ApiGateway],

	// More info about settings: https://moleculer.services/docs/0.13/moleculer-web.html
	settings: {
		port: process.env.PORT || 3000,

		routes: [{
			path: "/api",
			whitelist: [
				// Access to any actions in all services under "/api" URL
				"convives.list",
				"convives.get",
				"convives.create_perso",
				"convives.update",
				"convives.remove",
			],
			aliases: {
				// "REST convives": "convives",
				"GET convives": "convives.list",
                "GET convives/:id": "convives.get",
                "POST convives": "convives.create_perso",
                "PUT convives/:id": "convives.update",
                "DELETE convives/:id": "convives.remove"
			}
		}],

		// Serve assets from "public" folder
		assets: {
			folder: "public",
		},


		cors: {
			origin: "*",
			methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
			allowedHeaders: "*",
			//exposedHeaders: "*",
			credentials: true,
			maxAge: null
		},
		
	},
};

export = ApiService;
