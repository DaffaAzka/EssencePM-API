import { Elysia, t } from "elysia";
import { AuthController } from "../controllers/AuthController";

const authController = new AuthController();

export const authRoutes = new Elysia()
  .post("/register", (context) => authController.register(context), {
    body: t.Object({
      email: t.String({ format: "email" }),
      username: t.String({ minLength: 3, maxLength: 50 }),
      first_name: t.String({ minLength: 1, maxLength: 100 }),
      last_name: t.String({ minLength: 1, maxLength: 100 }),
      password: t.String({ minLength: 6 }),
      avatar_url: t.Optional(t.String()),
    }),
    detail: {
      summary: "Register new user",
      description: "Create a new user account",
      tags: ["Auth"],
    },
  })
  .post("/login", (context) => authController.login(context), {
    body: t.Object({
      email: t.String({ format: "email" }),
      password: t.String(),
    }),
    detail: {
      summary: "User login",
      description: "Authenticate user with email and password",
      tags: ["Auth"],
    },
  })
  .get("/users", (context) => authController.getUsers(context), {
    detail: {
      summary: "Get all users",
      description: "Get list of all users",
      tags: ["Users"],
    },
  })
  .get("/users/:id", (context) => authController.getUserById(context), {
    params: t.Object({
      id: t.String(),
    }),
    detail: {
      summary: "Get user by ID",
      description: "Get specific user by ID",
      tags: ["Users"],
    },
  });
