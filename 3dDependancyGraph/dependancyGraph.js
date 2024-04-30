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
        this.graph = {};
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
                        if (!(_i < files_1.length)) return [3 /*break*/, 6];
                        file = files_1[_i];
                        if (!file.isFile()) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.ReadFile(dirname, file.name)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        //If nested directory, start process in new directory
                        this.OpenFiles(path.join(dirname, file.name));
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
                            this.AddToGraph(path.join(dirname, filename), line);
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
    CreateConnections.prototype.AddToGraph = function (filePath, line) {
        var lineParts = line.split(" ");
        if (lineParts[0] === "from") {
            if (!this.graph[filePath]) {
                this.graph[filePath] = {};
            }
            this.graph[filePath][lineParts[1]] = [lineParts[3]];
        }
        else if (lineParts[0] === "import") {
            if (!this.graph[filePath]) {
                this.graph[filePath] = {};
            }
            this.graph[filePath][lineParts[1]] = [];
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
                    return [4 /*yield*/, connections.OpenFiles("./test")];
                case 1:
                    _a.sent();
                    console.log(connections.graph);
                    return [2 /*return*/];
            }
        });
    });
}
test();
// export default { CreateConnections };
