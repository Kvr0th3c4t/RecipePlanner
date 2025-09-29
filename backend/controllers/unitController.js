import { unitModel } from "../models/unitModel.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";
import { MESSAGES } from "../constants/messages.js";

export class unitController {
  static async getAllUnits(req, res) {
    try {
      const units = await unitModel.getAllUnits();

      if (units.length > 0) {
        return successResponse(res, 200, "Unidades obtenidas correctamente", {
          units: units,
        });
      } else {
        return successResponse(res, 200, "No hay unidades disponibles", {
          units: [],
        });
      }
    } catch (error) {
      return errorResponse(res, 500, MESSAGES.INTERNAL_ERROR);
    }
  }
}
