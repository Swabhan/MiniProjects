"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateConnections = void 0;
var fs_1 = require("fs");
var readline_1 = require("readline");
var path = require("path");
var promises_1 = require("fs/promises");
var CreateConnections = /** @class */ (function () {
    function CreateConnections() {
        this.inheritance = {};
        this.composition = {};
        this.association = {};
        this.classified = new Set([]);
    }
    /**
    * Entry Point for Process
    * Allows functionality to open file, awaits for read completion
    * @param {string} dirname - The string containing current directory path
    */
    CreateConnections.prototype.OpenFiles = function (dirname) {
        return __awaiter(this, void 0, void 0, function () {
            var files, _i, files_1, file;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, promises_1.readdir)(dirname, { withFileTypes: true })];
                    case 1:
                        files = _a.sent();
                        _i = 0, files_1 = files;
                        _a.label = 2;
                    case 2:
                        if (!(_i < files_1.length)) return [3 /*break*/, 8];
                        file = files_1[_i];
                        if (!file.isFile()) return [3 /*break*/, 5];
                        if (!(file.name[file.name.length - 1] == "h")) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.ReadFile(dirname, file.name)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 7];
                    case 5: 
                    //If nested directory, start process in new directory
                    return [4 /*yield*/, this.OpenFiles(path.join(dirname, file.name))];
                    case 6:
                        //If nested directory, start process in new directory
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 2];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
    * Determines C++ classes currently in directory
    * Used to fill classfied set for ease of retrieval
    * @param {string} dirname - The string containing current directory path
    */
    CreateConnections.prototype.ClassifyFiles = function (dirname) {
        return __awaiter(this, void 0, void 0, function () {
            var files, _i, files_2, file;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, promises_1.readdir)(dirname, { withFileTypes: true })];
                    case 1:
                        files = _a.sent();
                        _i = 0, files_2 = files;
                        _a.label = 2;
                    case 2:
                        if (!(_i < files_2.length)) return [3 /*break*/, 6];
                        file = files_2[_i];
                        if (!file.isFile()) return [3 /*break*/, 3];
                        if (file.name[file.name.length - 1] == "h") {
                            this.classified.add(file.name.slice(0, -2));
                        }
                        return [3 /*break*/, 5];
                    case 3: 
                    //If nested directory, start process in new directory
                    return [4 /*yield*/, this.ClassifyFiles(path.join(dirname, file.name))];
                    case 4:
                        //If nested directory, start process in new directory
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
    * Event Driven function reads file line by line, returns Promise
    * @param {string, string} dirname, filename - Used to create file path
    */
    CreateConnections.prototype.ReadFile = function (dirname, filename) {
        return __awaiter(this, void 0, void 0, function () {
            var fileStream, rl_1;
            var _this = this;
            return __generator(this, function (_a) {
                try {
                    fileStream = (0, fs_1.createReadStream)(path.join(dirname, filename), 'utf-8');
                    rl_1 = (0, readline_1.createInterface)({
                        input: fileStream,
                        crlfDelay: Infinity
                    });
                    rl_1.on('line', function (line) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            this.AddToGraph(path.join(dirname, filename), line, filename.slice(0, -2));
                            return [2 /*return*/];
                        });
                    }); });
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            rl_1.on('close', function () {
                                resolve();
                            });
                        })];
                }
                catch (error) {
                    console.error("Error reading file ".concat(filename, ":"), error);
                }
                return [2 /*return*/];
            });
        });
    };
    /**
    * Creates connection between filePath and dependency
    * @param {string, string} filePath, line
    */
    CreateConnections.prototype.AddToGraph = function (filePath, line, className) {
        //Normalize Line
        line = line.trim();
        line = line.replace(/[:<>;]/g, " ");
        var lineParts = line.split(" ");
        if (lineParts[0] === "class" && lineParts.length > 1) {
            var publicFound = false;
            for (var i = 1; i < lineParts.length; i++) {
                var item = lineParts[i];
                if (item == "public") {
                    publicFound = true;
                }
                if (this.classified.has(item) && publicFound) {
                    if (!this.inheritance[item]) {
                        this.inheritance[item] = [];
                    }
                    this.inheritance[item].push(className);
                }
            }
        }
        else {
            var vector = false;
            var foundClass;
            for (var _i = 0, lineParts_1 = lineParts; _i < lineParts_1.length; _i++) {
                var item = lineParts_1[_i];
                if (item == "vector") {
                    vector = true;
                }
                if (this.classified.has(item)) {
                    foundClass = item;
                }
            }
            if (vector == true && foundClass) {
                if (!this.composition[className]) {
                    this.composition[className] = [];
                }
                this.composition[className].push(foundClass);
            }
            else if (foundClass) {
                if (!this.association[className]) {
                    this.association[className] = [];
                }
                this.association[className].push(foundClass);
            }
        }
    };
    return CreateConnections;
}());
exports.CreateConnections = CreateConnections;
//Testing function, allows async code to be processed
function test() {
    return __awaiter(this, void 0, void 0, function () {
        var connections;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    connections = new CreateConnections();
                    return [4 /*yield*/, connections.ClassifyFiles("./test")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, connections.OpenFiles("./test")];
                case 2:
                    _a.sent();
                    console.log(connections.association);
                    console.log("");
                    console.log(connections.composition);
                    console.log("");
                    console.log(connections.inheritance);
                    console.log("");
                    return [2 /*return*/];
            }
        });
    });
}
test();
// export default { CreateConnections };
