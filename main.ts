import { Elysia } from "elysia";
import { node } from "@elysiajs/node";
import { authRoutes } from "./src/routes/auth";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import jwt from "@elysiajs/jwt";
import { projectRoutes } from "./src/routes/project";
import { projectMemberRoutes } from "./src/routes/projectMember";

const JWT_SECRET = process.env.JWT_SECRET || "";

new Elysia({ adapter: node() })
  .use(
    cors({
      origin: true,
      credentials: true,
    })
  )
  .use(
    swagger({
      documentation: {
        info: {
          title: "EssencePM API Documentation",
          version: "0.1.1",
        },
        tags: [
          { name: "Authentication", description: "Authentication endpoints" },
          { name: "Users", description: "User management endpoints" },
        ],
      },
    })
  )
  .use(
    jwt({
      name: "jwt",
      secret: JWT_SECRET,
    })
  )
  .get("/", () => ({
    message: "Welcome to EssencePM API",
    version: "1.0.0",
    docs: "/swagger",
  }))
  .group("/api/v1", (app) =>
    app.use(authRoutes).use(projectRoutes).use(projectMemberRoutes)
  )
  .onError(({ code, error, set }) => {
    console.error("Error:", error);

    if (code === "VALIDATION") {
      set.status = 422;
      return {
        success: false,
        message: "Validation failed",
        errors: error.message,
      };
    }

    set.status = 500;
    return {
      success: false,
      message: "Internal server error",
    };
  })
  .listen(3000);

console.log(`Listening on http://localhost:3000`);
