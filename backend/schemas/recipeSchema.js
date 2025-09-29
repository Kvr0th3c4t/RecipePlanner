import z from "zod";

const recipeSchema = z.object({
  receta_nombre: z
    .string({
      invalid_type_error: "Es necesario escribir un nombre de receta válido",
      required_error: "El nombre de receta es un campo requerido",
    })
    .min(1, "El nombre de la receta no puede estar vacío")
    .trim()
    .refine((val) => !/[<>]/.test(val), {
      message: "El nombre no puede contener caracteres HTML (< o >)",
    }),

  receta_foto: z
    .url({
      message: "Debe ser una URL de foto válida",
    })
    .optional(),
});

export function validateRecipe(input) {
  return recipeSchema.safeParse(input);
}
