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
      .get("/", () => {}, {
        detail: {
          description: "Get all projects",
        },
      })
      .get("/:id", ({ params: { id } }) => {}, {
        params: t.Object({
          id: t.Number(),
        }),
        detail: {
          description: "Get one project",
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
      .put("/:id", ({ body, params: { id } }) => {}, {
        params: t.Object({
          id: t.Number(),
        }),
        body: t.Any(),
        detail: {
          description: "Edit one project",
        },
      })
      .delete("/:id", ({ params: { id } }) => {}, {
        params: t.Object({
          id: t.Number(),
        }),
        detail: {
          description: "Delete one project",
        },
      })
);
