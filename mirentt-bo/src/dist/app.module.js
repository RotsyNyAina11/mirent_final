"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var auth_module_1 = require("./auth/auth.module");
var typeorm_1 = require("@nestjs/typeorm");
var database_config_1 = require("./config/database.config");
var serve_static_1 = require("@nestjs/serve-static");
var path_1 = require("path");
var vehicles_module_1 = require("./vehicles/vehicles.module");
var type_module_1 = require("./type/type.module");
var status_module_1 = require("./status/status.module");
var client_module_1 = require("./client/client.module");
var regions_module_1 = require("./regions/regions.module");
var prixs_module_1 = require("./prixs/prixs.module");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        common_1.Module({
            imports: [
                typeorm_1.TypeOrmModule.forRoot(database_config_1.typeOrmConfig),
                auth_module_1.AuthModule,
                vehicles_module_1.VehiclesModule,
                type_module_1.TypeModule,
                status_module_1.StatusModule,
                client_module_1.ClientModule,
                serve_static_1.ServeStaticModule.forRoot({
                    rootPath: path_1.join(__dirname, '..', 'uploads'),
                    serveRoot: '/uploads'
                }),
                regions_module_1.RegionsModule,
                prixs_module_1.PrixsModule,
            ]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
