import z from "zod";

const userSchema = z.object({
  email: z.email({
    invalid_type_error: "Es necesario escribir un email válido",
    required_error: "El email es un campo requerido",
  }),

  username: z.string({
    invalid_type_error: "Es necesario escribir un nombre de usuario válido",
    required_error: "El nombre de usuario es un campo requerido",
  }),

  contraseña: z
    .string({
      invalid_type_error: "La contraseña debe ser un string",
      required_error: "La contraseña es un campo requerido",
    })
    .min(8)
    .max(255),
});

const loginSchema = z.object({
  email: z.email({
    invalid_type_error: "Es necesario escribir un email válido",
    required_error: "El email es un campo requerido",
  }),

  contraseña: z
    .string({
      invalid_type_error: "La contraseña debe ser un string",
      required_error: "La contraseña es un campo requerido",
    })
    .min(8)
    .max(255),
});

export function validateLogin(input) {
  return loginSchema.safeParse(input);
}

export function validateUser(input) {
  return userSchema.safeParse(input);
}

export function validatePartialUser(input) {
  return userSchema.pick({ contraseña: true }).partial().safeParse(input);
}
