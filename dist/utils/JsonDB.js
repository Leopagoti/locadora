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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonDB = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
class JsonDB {
    constructor(filePath) {
        this.filePath = filePath;
    }
    readData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield fs_1.promises.access(this.filePath);
                const data = yield fs_1.promises.readFile(this.filePath, 'utf-8');
                return JSON.parse(data);
            }
            catch (error) {
                if (error instanceof Error && error.code === 'ENOENT') {
                    // Tenta criar o diretório se ele não existir
                    yield this.ensureDirectoryExistence(this.filePath);
                    // Se o arquivo não existir, crie um novo arquivo com um array vazio
                    yield fs_1.promises.writeFile(this.filePath, JSON.stringify([]));
                    return [];
                }
                else {
                    // Se for outro tipo de erro, lance-o novamente
                    throw error;
                }
            }
        });
    }
    writeData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fs_1.promises.writeFile(this.filePath, JSON.stringify(data, null, 2));
        });
    }
    ensureDirectoryExistence(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const dir = (0, path_1.dirname)(filePath);
            try {
                yield fs_1.promises.access(dir);
            }
            catch (error) {
                if (error instanceof Error && error.code === 'ENOENT') {
                    yield fs_1.promises.mkdir(dir, { recursive: true });
                }
                else {
                    throw error;
                }
            }
        });
    }
}
exports.JsonDB = JsonDB;
