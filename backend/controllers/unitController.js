import { unitModel } from "../models/unitModel.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";
import { MESSAGES } from "../constants/messages.js";

export class unitController {
  /**
   * GET /api/units
   *  Obtiene todas las unidades de medida del sistema
   */
  static async getAllUnits(req, res) {
    try {
      const units = await unitModel.getAllUnits();
      return successResponse(res, 200, "Unidades obtenidas correctamente", {
        units,
      });
    } catch (error) {
      return errorResponse(res, 500, MESSAGES.INTERNAL_ERROR);
    }
  }
}
