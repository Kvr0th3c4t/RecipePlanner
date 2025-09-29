import z from "zod";

const ingredientSchema = z.object({
  ingrediente_id: z.number().int().positive({
    invalid_type_error:
      "Es necesario que el ID sea un número entero y positivo",
    required_error: "El ID es un campo requerido",
  }),
  cantidad: z
    .number({
      invalid_type_error: "Es necesario que la cantidad sea un número decimal",
      required_error: "Cantidad es un campo requerido",
    })
    .min(0)
    .max(9999),
  unidad_id: z.number().int().positive({
    invalid_type_error:
      "Es necesario que el ID se aun número entero y positivo",
    required_error: "El ID es un campo requerido",
  }),
});

export function validateIngredient(input) {
  return ingredientSchema.safeParse(input);
}

export function validateUpdateIngredient(input) {
  return ingredientSchema
    .pick({ cantidad: true, unidad_id: true })
    .safeParse(input);
}
