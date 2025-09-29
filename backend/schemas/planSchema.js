import z from "zod";

const planSchema = z.object({
  receta_id: z
    .number()
    .int()
    .positive({
      invalid_type_error:
        "Es necesario que el ID sea un número entero y positivo",
      required_error: "El ID es un campo requerido",
    })
    .nullable(),
  day: z.enum(
    ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"],
    {
      invalid_type_error: "Debe escoger un valor de la lista proporcionada",
      required_error: "El dia es un campo requerido",
    }
  ),
  tipo_comida: z.enum(["DESAYUNO", "ALMUERZO", "COMIDA", "MERIENDA", "CENA"], {
    invalid_type_error: "Debe escoger un valor de la lista proporcionada",
    required_error: "El tipo de comida es un campo requerido",
  }),
});

export function validatePlan(input) {
  return planSchema.safeParse(input);
}
