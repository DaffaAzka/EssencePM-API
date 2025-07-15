import { ProjectService } from "./../services/ProjectService";
import Elysia, { Context, t } from "elysia";
import { Project } from "./../generated/prisma/index.d";

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  async store(ctx: Context) {
    try {
      const userId = (ctx as any).userId;
      const body = ctx.body as {
        name: string;
        description: string;
        status?: string;
        priority?: string;
        start_date: Date;
        end_date: Date;
      };

      const data = {
        ...body,
        created_by: userId,
      };

      const project = await this.projectService.createProject(data);
      ctx.set.status = 201;
      return {
        success: true,
        message: "Project created successfully",
        data: project,
      };
    } catch (error) {
      ctx.set.status = 400;
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Project create failed",
        data: null,
      };
    }
  }
}
