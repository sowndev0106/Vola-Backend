"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(err, req, res, next) {
    const error = {
        success: false,
        error: err.message,
    };
    switch (err.name) {
        case "UnauthorizedError":
            res.status(401);
            break;
        case "NotFoundError":
            res.status(404);
            break;
        case "HeaderTokenInvalidError":
            res.status(403);
            break;
        case "ValidationError":
            res.status(422);
            error.error = err.messageBag;
            break;
        default:
            res.status(400);
    }
    return res.json(error);
}
exports.default = default_1;
