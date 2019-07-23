/*
 #  Project: service-convive                                                   #
 #  File: \modules.ts                                                          #
 #                                                                             #
 #  Author: Sylvain (contact@cashsystemes.eu)                                  #
 #  Modified By: Sylvain (contact@cashsystemes.eu>)                            #
 #                                                                             #
 #  File Created: Tuesday, 23rd July 2019 9:36:55 am                           #
 #  Last Modified: Tuesday, 23rd July 2019 9:56:03 am                          #
 #                                                                             #
 #  Copyright 2018 - 2019, Cash Systemes Industries                            #
 */
"use strict";

import { KafkaDriver } from "../classes/kafka/kafka";


export class ModelModules {
    kafka: KafkaDriver;
}


let liste: ModelModules = {
    kafka: null,
}


export const Modules = {

    init() {
            console.log('Init des modules')

            liste = {
                    kafka: KafkaDriver.getInstance()
            }
    },

    get() { return liste }


}