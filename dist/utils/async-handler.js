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
exports.asyncHandler = void 0;
const asyncHandler = (requestHandler) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield Promise.resolve(requestHandler(req, res, next));
        }
        catch (err) {
            res.status((err === null || err === void 0 ? void 0 : err.statusCode) || 400).json({
                statusCode: (err === null || err === void 0 ? void 0 : err.statusCode) || 400,
                data: null,
                message: err.message
            });
        }
    });
};
exports.asyncHandler = asyncHandler;
