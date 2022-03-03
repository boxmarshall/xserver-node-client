"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
require("mocha");
var chai = (0, tslib_1.__importStar)(require("chai"));
var dotenv_1 = (0, tslib_1.__importDefault)(require("dotenv"));
var machine_id2_1 = require("machine-id2");
dotenv_1.default.config();
var __1 = require("../");
var xsconfig = {
    apiKey: process.env.XSERVER_TOKEN || ''
};
var PRODUCT_ID = process.env.PRODUCT_ID ? parseInt(process.env.PRODUCT_ID) : 0;
var xserverClient = new __1.XServerClient(xsconfig);
describe('License Service Test', function () {
    var tiers = [];
    var keys = [];
    var user = {
        email: 'John.Doe@example.com',
        familyName: 'Doe',
        givenName: 'John'
    };
    var newUser = {
        email: 'Jane.Doe@example.com',
        familyName: 'Doe',
        givenName: 'Jane'
    };
    describe('Connection test', function () {
        it('should return success as a payload', function () { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
            var response;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, xserverClient.testConnection()];
                    case 1:
                        response = _a.sent();
                        chai.expect(response.status).to.be.equal('success');
                        return [2 /*return*/];
                }
            });
        }); }).timeout(5000);
    });
    describe('Creation / Validation test', function () {
        it('should be able to fetch tier list', function () { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
            var response;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, xserverClient.listTiers()];
                    case 1:
                        response = _a.sent();
                        chai.expect(response.status).to.be.equal('success');
                        tiers = response.tiers;
                        return [2 /*return*/];
                }
            });
        }); }).timeout(5000);
        it('should be able to create a key', function () { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
            var tierHash, context, response;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tierHash = tiers[Math.floor(Math.random() * tiers.length)];
                        context = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, user), { tierHash: tierHash, days: 1 });
                        return [4 /*yield*/, xserverClient.createKey(context)];
                    case 1:
                        response = _a.sent();
                        chai.expect(response.status).to.be.equal('success');
                        return [2 /*return*/];
                }
            });
        }); }).timeout(5000);
        it('should be able to list all the keys a product has', function () { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
            var response;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, xserverClient.dumpKeys()];
                    case 1:
                        response = _a.sent();
                        chai.expect(response.status).to.be.equal('success');
                        return [2 /*return*/];
                }
            });
        }); }).timeout(5000);
        it('should be able to list all the keys the user has', function () { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
            var email, response;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = user.email;
                        return [4 /*yield*/, xserverClient.listKeys(email)];
                    case 1:
                        response = _a.sent();
                        chai.expect(response.status).to.be.equal('success');
                        keys = response.keys;
                        return [2 /*return*/];
                }
            });
        }); }).timeout(5000);
        it('should be able to fetch information about the created key', function () { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
            var key, response;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chai.expect(keys.length).to.be.gt(0);
                        key = keys[Math.floor(Math.random() * keys.length)];
                        return [4 /*yield*/, xserverClient.queryKey(key)];
                    case 1:
                        response = _a.sent();
                        chai.expect(response.status).to.be.equal('success');
                        return [2 /*return*/];
                }
            });
        }); }).timeout(5000);
        it('should be able to extend a key by 1 day', function () { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
            var serialkey, response;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chai.expect(keys.length).to.be.gt(0);
                        serialkey = keys[Math.floor(Math.random() * keys.length)];
                        return [4 /*yield*/, xserverClient.extendKey({
                                serialkey: serialkey,
                                days: 1
                            })];
                    case 1:
                        response = _a.sent();
                        chai.expect(response.status).to.be.equal('success');
                        return [2 /*return*/];
                }
            });
        }); }).timeout(5000);
        it('should be able to securely change purchase email', function () { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
            var serialkey, res, email, token, givenName, familyName, response;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chai.expect(keys.length).to.be.gt(0);
                        serialkey = keys[Math.floor(Math.random() * keys.length)];
                        return [4 /*yield*/, xserverClient.queryKey(serialkey)];
                    case 1:
                        res = _a.sent();
                        email = res.result.email;
                        return [4 /*yield*/, xserverClient.beginTransfer({
                                email: email,
                                serialkey: serialkey
                            })];
                    case 2:
                        token = (_a.sent()).token;
                        givenName = newUser.givenName, familyName = newUser.familyName;
                        return [4 /*yield*/, xserverClient.confirmTransfer({
                                email: newUser.email,
                                transferCode: token,
                                serialkey: serialkey,
                                givenName: givenName,
                                familyName: familyName
                            })];
                    case 3:
                        response = _a.sent();
                        chai.expect(response.status).to.be.equal('success');
                        return [2 /*return*/];
                }
            });
        }); }).timeout(5000);
    });
    describe('Railgun license test', function () {
        var token = '';
        it('should be able to validate the license key', function () { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
            var licenseKey, railgunInstance, muid, licenseUser;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chai.expect(keys.length).to.be.gt(0);
                        licenseKey = keys[Math.floor(Math.random() * keys.length)];
                        railgunInstance = new __1.Railgun(PRODUCT_ID);
                        return [4 /*yield*/, (0, machine_id2_1.machineId)()];
                    case 1:
                        muid = _a.sent();
                        return [4 /*yield*/, railgunInstance.validate(licenseKey, muid)];
                    case 2:
                        licenseUser = _a.sent();
                        token = railgunInstance.chaintoken;
                        chai.expect(licenseUser.name.givenName).to.be.equal(user.givenName);
                        chai.expect(licenseUser.name.familyName).to.be.equal(user.familyName);
                        railgunInstance.logout();
                        return [2 /*return*/];
                }
            });
        }); }).timeout(10000);
        it('should be able to validate chained instances', function () { return (0, tslib_1.__awaiter)(void 0, void 0, void 0, function () {
            var chainRailgunInstance, chainUser;
            return (0, tslib_1.__generator)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chai.expect(keys.length).to.be.gt(0);
                        chainRailgunInstance = new __1.Railgun(PRODUCT_ID);
                        return [4 /*yield*/, chainRailgunInstance.chain(token)];
                    case 1:
                        chainUser = _a.sent();
                        chai.expect(chainUser.name.givenName).to.be.equal(user.givenName);
                        chai.expect(chainUser.name.familyName).to.be.equal(user.familyName);
                        chainRailgunInstance.logout();
                        return [2 /*return*/];
                }
            });
        }); }).timeout(10000);
    });
});
