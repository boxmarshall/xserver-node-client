"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenseServerUnavailable = exports.AgentConnectionFailure = exports.ManagerError = exports.ServiceError = exports.AuthorizationError = exports.ValidationError = void 0;
var tslib_1 = require("tslib");
var ValidationError = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ValidationError, _super);
    function ValidationError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = 'ValidationError';
        // Set the prototype explicitly.
        Object.setPrototypeOf(_this, ValidationError.prototype);
        return _this;
    }
    return ValidationError;
}(Error));
exports.ValidationError = ValidationError;
var AuthorizationError = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(AuthorizationError, _super);
    function AuthorizationError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = 'AuthorizationError';
        // Set the prototype explicitly.
        Object.setPrototypeOf(_this, AuthorizationError.prototype);
        return _this;
    }
    return AuthorizationError;
}(Error));
exports.AuthorizationError = AuthorizationError;
var ServiceError = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ServiceError, _super);
    function ServiceError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = 'ServiceError';
        // Set the prototype explicitly.
        Object.setPrototypeOf(_this, ServiceError.prototype);
        return _this;
    }
    return ServiceError;
}(Error));
exports.ServiceError = ServiceError;
var ManagerError = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(ManagerError, _super);
    function ManagerError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = 'ManagerError';
        // Set the prototype explicitly.
        Object.setPrototypeOf(_this, ManagerError.prototype);
        return _this;
    }
    return ManagerError;
}(Error));
exports.ManagerError = ManagerError;
var AgentConnectionFailure = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(AgentConnectionFailure, _super);
    function AgentConnectionFailure(message) {
        var _this = _super.call(this, message) || this;
        _this.name = 'AgentConnectionFailure';
        // Set the prototype explicitly.
        Object.setPrototypeOf(_this, AgentConnectionFailure.prototype);
        return _this;
    }
    return AgentConnectionFailure;
}(Error));
exports.AgentConnectionFailure = AgentConnectionFailure;
var LicenseServerUnavailable = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(LicenseServerUnavailable, _super);
    function LicenseServerUnavailable(message) {
        var _this = _super.call(this, message) || this;
        _this.name = 'LicenseServerUnavailable';
        // Set the prototype explicitly.
        Object.setPrototypeOf(_this, LicenseServerUnavailable.prototype);
        return _this;
    }
    return LicenseServerUnavailable;
}(Error));
exports.LicenseServerUnavailable = LicenseServerUnavailable;
