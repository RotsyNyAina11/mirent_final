"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.DevisController = void 0;
var common_1 = require("@nestjs/common");
var DevisController = /** @class */ (function () {
    function DevisController(devisService) {
        this.devisService = devisService;
    }
    // Créer un nouveau devis
    DevisController.prototype.create = function (createDevisDto) {
        return this.devisService.create(createDevisDto);
    };
    // Récupérer tous les devis
    DevisController.prototype.findAll = function () {
        return this.devisService.findAll();
    };
    // Récupérer un seul devis par ID
    DevisController.prototype.findOne = function (id) {
        return this.devisService.findOne(+id);
    };
    // Mettre à jour un devis
    DevisController.prototype.update = function (id, updateDevisDto) {
        return this.devisService.update(+id, updateDevisDto);
    };
    // Supprimer un devis
    DevisController.prototype.remove = function (id) {
        return this.devisService.remove(+id);
    };
    __decorate([
        common_1.Post(),
        __param(0, common_1.Body())
    ], DevisController.prototype, "create");
    __decorate([
        common_1.Get()
    ], DevisController.prototype, "findAll");
    __decorate([
        common_1.Get(':id'),
        __param(0, common_1.Param('id'))
    ], DevisController.prototype, "findOne");
    __decorate([
        common_1.Patch(':id'),
        __param(0, common_1.Param('id')), __param(1, common_1.Body())
    ], DevisController.prototype, "update");
    __decorate([
        common_1.Delete(':id'),
        __param(0, common_1.Param('id'))
    ], DevisController.prototype, "remove");
    DevisController = __decorate([
        common_1.Controller('devis')
    ], DevisController);
    return DevisController;
}());
exports.DevisController = DevisController;
