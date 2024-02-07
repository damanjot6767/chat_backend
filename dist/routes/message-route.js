"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const validation_1 = require("../controllers/messages/validation");
const message_controller_1 = require("../controllers/messages/message-controller");
const get_message_validation_1 = require("../controllers/messages/validation/get-message-validation");
const router = (0, express_1.Router)();
;
;
router.route('/create').post(auth_middleware_1.verifyJWT, validation_1.CreateMessageJoiValidation, message_controller_1.createMessage);
router.route('/update/:id').post(auth_middleware_1.verifyJWT, get_message_validation_1.GetMessageByIdParamJoiValidation, validation_1.UpdateMessageJoiValidation, message_controller_1.updateMessage);
router.route('/delete/:id').delete(auth_middleware_1.verifyJWT, get_message_validation_1.GetMessageByIdParamJoiValidation, message_controller_1.deleteMessage);
exports.default = router;