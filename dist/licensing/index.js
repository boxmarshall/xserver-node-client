"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Railgun = void 0;
var tslib_1 = require("tslib");
var events_1 = (0, tslib_1.__importDefault)(require("events"));
var license_manager_1 = require("./license-manager");
var errors_1 = require("../errors");
var Railgun = /** @class */ (function (_super) {
    (0, tslib_1.__extends)(Railgun, _super);
    function Railgun(productId, host) {
        if (host === void 0) { host = null; }
        var _this = _super.call(this) || this;
        _this.host = null;
        _this.mid = null;
        _this.manager = null;
        _this.waitforconnection = function (manager) {
            // forward all essential events
            manager.on('connected', function () { return _this.emit('connection-established'); });
            manager.on('linked', function () { return _this.emit('license-valid'); });
            manager.on('error', function () { return _this.emit('connection-failed'); });
            manager.on('deauth', function () { return _this.emit('secure-logout'); });
            _this.manager = manager;
        };
        _this.fetchUser = function (manager) {
            return new Promise(function (resolve, reject) {
                var connectionTimeout = null;
                manager.once('currentUser', function (user) {
                    if (connectionTimeout) {
                        clearTimeout(connectionTimeout);
                    }
                    resolve(user);
                });
                manager.emit('getUser');
                setTimeout(function () {
                    reject(new errors_1.ValidationError('Timeout fetching user'));
                }, 10000);
            });
        };
        _this.logout = function () {
            var _a;
            (_a = _this.manager) === null || _a === void 0 ? void 0 : _a.disconnect();
            _this.manager = null;
        };
        _this.chain = function (chaintoken) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
            var mid, _a, token, muid, options, licenseManager, user;
            return (0, tslib_1.__generator)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        mid = Buffer.from(chaintoken, 'hex').toString('utf8');
                        _a = mid.split('##'), token = _a[0], muid = _a[1];
                        options = {
                            muid: muid,
                            productId: this.productId,
                            host: this.host
                        };
                        licenseManager = new license_manager_1.LicenseManager(options);
                        this.waitforconnection(licenseManager);
                        return [4 /*yield*/, licenseManager.chainLicense(token)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.fetchUser(licenseManager)];
                    case 2:
                        user = _b.sent();
                        return [2 /*return*/, user];
                }
            });
        }); };
        _this.validate = function (license, muid) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
            var options, licenseManager, _1, user;
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            muid: muid,
                            productId: this.productId,
                            host: this.host
                        };
                        licenseManager = new license_manager_1.LicenseManager(options);
                        licenseManager.once('connected', function (token) {
                            _this.mid = "".concat(token, "##").concat(muid);
                        });
                        this.waitforconnection(licenseManager);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 5]);
                        return [4 /*yield*/, licenseManager.activateLicense(license)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        _1 = _a.sent();
                        return [4 /*yield*/, licenseManager.checkLicense(license)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [4 /*yield*/, this.fetchUser(licenseManager)];
                    case 6:
                        user = _a.sent();
                        return [2 /*return*/, user];
                }
            });
        }); };
        _this.setMaxListeners(0);
        _this.host = host;
        _this.productId = productId;
        return _this;
    }
    Object.defineProperty(Railgun.prototype, "chaintoken", {
        get: function () {
            if (this.mid === null) {
                return '';
            }
            return Buffer.from(this.mid).toString('hex');
        },
        enumerable: false,
        configurable: true
    });
    return Railgun;
}(events_1.default));
exports.Railgun = Railgun;
