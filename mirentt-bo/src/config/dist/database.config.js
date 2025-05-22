"use strict";
exports.__esModule = true;
exports.typeOrmConfig = void 0;
var dotenv = require("dotenv");
var blacklisted_token_entity_1 = require("../entities/blacklisted-token.entity");
var region_entity_1 = require("../entities/region.entity");
var status_entity_1 = require("../entities/status.entity");
var type_entity_1 = require("../entities/type.entity");
var vehicle_entity_1 = require("../entities/vehicle.entity");
var prix_entity_1 = require("src/entities/prix.entity");
var client_entity_1 = require("../entities/client.entity");
var proformat_item_entity_1 = require("src/entities/proformat-item.entity");
var proforma_entity_1 = require("src/entities/proforma.entity");
var devis_entity_1 = require("src/entities/devis.entity");
var devis_item_entity_1 = require("src/entities/devis-item.entity");
var user_entity_1 = require("src/auth/entities/user.entity");
dotenv.config();
exports.typeOrmConfig = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [
        user_entity_1.User,
        blacklisted_token_entity_1.BlacklistedToken,
        vehicle_entity_1.Vehicule,
        type_entity_1.Type,
        status_entity_1.Status,
        region_entity_1.Region,
        client_entity_1.Client,
        prix_entity_1.Prix,
        proformat_item_entity_1.ProformaItem,
        proforma_entity_1.Proforma,
        devis_entity_1.Devis,
        devis_item_entity_1.DevisItem,
    ],
    synchronize: true
};
