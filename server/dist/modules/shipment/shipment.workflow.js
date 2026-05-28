"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTransition = void 0;
const AppError_1 = require("../../utils/errors/AppError");
const shipment_constants_1 = require("./shipment.constants");
/**
 * Validates if a transition from currentStatus to targetStatus is allowed by the FSM.
 * Throws a ValidationError if the transition is prohibited.
 */
const validateTransition = (currentStatus, targetStatus) => {
    const allowedNextStates = shipment_constants_1.ALLOWED_TRANSITIONS[currentStatus] || [];
    if (!allowedNextStates.includes(targetStatus)) {
        throw new AppError_1.ValidationError(`Invalid operational transition: Cannot move shipment from '${currentStatus}' to '${targetStatus}'.`);
    }
};
exports.validateTransition = validateTransition;
//# sourceMappingURL=shipment.workflow.js.map