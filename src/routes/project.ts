import Elysia, { t } from "elysia";
import { ProjectController } from "../controllers/ProjectController";
import { authGuard } from "../middlewares/auth";

const projectController = new ProjectController();

export const projectRoutes = new Elysia({ prefix: "/project" }).guard(
  {
    beforeHandle: authGuard,
    headers: t.Object({
      authorization: t.String(),
    }),
  },
  (app) =>
    app
      .get("/", (context) => projectController.index(context), {
        detail: {
          summary: "Get all projects",
          description: "Get list of a projects",
          tags: ["Project"],
        },
      })
      .get("/:id", (context) => projectController.show(context), {
        params: t.Object({
          id: t.String(),
        }),
        detail: {
          summary: "Get one project",
          description: "Get one project",
          tags: ["Project"],
        },
      })
      .post("/", (context) => projectController.store(context), {
        body: t.Object({
          name: t.String(),
          description: t.String(),
          status: t.Optional(t.String()),
          priority: t.Optional(t.String()),
          start_date: t.Date(),
          end_date: t.Date(),
        }),
        detail: {
          summary: "Store new project",
          description: "Create a new project",
          tags: ["Project"],
        },
      })
      .put("/:id", (context) => projectController.update(context), {
        params: t.Object({
          id: t.String(),
        }),
        body: t.Object({
          name: t.Optional(t.String()),
          description: t.Optional(t.String()),
          status: t.Optional(t.String()),
          priority: t.Optional(t.String()),
          start_date: t.Optional(t.Date()),
          end_date: t.Optional(t.Date()),
        }),
        detail: {
          summary: "Update project",
          description: "Update a project where the owner is the user",
          tags: ["Project"],
        },
      })
      .delete("/:id", (context) => projectController.destroy(context), {
        params: t.Object({
          id: t.String(),
        }),
        detail: {
          summary: "Destroy project",
          description: "Delete a project where the owner is the user",
          tags: ["Project"],
        },
      })
);
