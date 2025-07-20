import Elysia, { t } from "elysia";
import { ProjectMemberController } from "../controllers/ProjectMemberController";
import { authGuard } from "../middlewares/auth";

const projectMemberController = new ProjectMemberController();

export const projectMemberRoutes = new Elysia({ prefix: "/project" }).guard(
  {
    beforeHandle: authGuard,
    headers: t.Object({
      authorization: t.String(),
    }),
  },
  (app) =>
    app
      .get(
        "/:id/members",
        (context) => projectMemberController.index(context),
        {
          params: t.Object({
            id: t.String(),
          }),
          detail: {
            summary: "Get all project members",
            description: "Get list of all members in a project",
            tags: ["Project Member"],
          },
        }
      )

      .get(
        "/:id/members/:member_id",
        (context) => projectMemberController.show(context),
        {
          params: t.Object({
            id: t.String(),
            member_id: t.String(),
          }),
          detail: {
            summary: "Get one project member",
            description: "Get details of a specific project member",
            tags: ["Project Member"],
          },
        }
      )

      .post(
        "/:id/members",
        (context) => projectMemberController.store(context),
        {
          params: t.Object({
            id: t.String(),
          }),
          body: t.Object({
            user_id: t.String(),
          }),
          detail: {
            summary: "Add member to project",
            description: "Add a new member to the project (only project owner)",
            tags: ["Project Member"],
          },
        }
      )

      .delete(
        "/:id/members/:user_id",
        (context) => projectMemberController.destroy(context),
        {
          params: t.Object({
            id: t.String(),
            user_id: t.String(),
          }),
          detail: {
            summary: "Remove member from project",
            description:
              "Remove a member from the project (owner can remove anyone, members can remove themselves)",
            tags: ["Project Member"],
          },
        }
      )

      .post(
        "/:id/members/bulk",
        (context) => projectMemberController.bulkStore(context),
        {
          params: t.Object({
            id: t.String(),
          }),
          body: t.Object({
            user_ids: t.Array(t.String()),
          }),
          detail: {
            summary: "Bulk add members to project",
            description:
              "Add multiple members to the project at once (only project owner)",
            tags: ["Project Member"],
          },
        }
      )

      .get(
        "/:id/membership",
        (context) => projectMemberController.checkMembership(context),
        {
          params: t.Object({
            id: t.String(),
          }),
          query: t.Object({
            user_id: t.Optional(t.String()),
          }),
          detail: {
            summary: "Check membership status",
            description: "Check if a user is a member of the project",
            tags: ["Project Member"],
          },
        }
      )
);

export const userProjectRoutes = new Elysia({ prefix: "/user" }).guard(
  {
    beforeHandle: authGuard,
    headers: t.Object({
      authorization: t.String(),
    }),
  },
  (app) =>
    app.get(
      "/projects",
      (context) => projectMemberController.getUserProjects(context),
      {
        detail: {
          summary: "Get user's projects",
          description:
            "Get all projects where the authenticated user is a member",
          tags: ["Project Member"],
        },
      }
    )
);
