"use strict";
exports.__esModule = true;
exports.typeOrmConfig = void 0;
var dotenv = require("dotenv");
var blacklisted_token_entity_1 = require("../entities/blacklisted-token.entity");
var district_entity_1 = require("../entities/district.entity");
var region_entity_1 = require("../entities/region.entity");
var status_entity_1 = require("../entities/status.entity");
var type_entity_1 = require("../entities/type.entity");
var user_entity_1 = require("../entities/user.entity");
var vehicle_entity_1 = require("../entities/vehicle.entity");
var client_entity_1 = require("../entities/client.entity");
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
        district_entity_1.District,
        client_entity_1.Client,
    ],
    synchronize: true
};
