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

  async update(ctx: Context) {
    try {
      const { id } = ctx.params as { id: string };
      const userId = (ctx as any).userId;

      const body = ctx.body as {
        name?: string;
        description?: string;
        status?: string;
        priority?: string;
        start_date?: Date;
        end_date?: Date;
      };

      const project = await this.projectService.getProjectById(id);

      if (project && project.created_by === userId) {
        const update = await this.projectService.updateProject(id, body);
        ctx.set.status = 201;
        return {
          success: true,
          message: `Project updated successfully`,
          data: update,
        };
      } else {
        ctx.set.status = 404;
        return {
          success: false,
          message: `Failed to retrieve project`,
          data: null,
        };
      }
    } catch (error) {
      ctx.set.status = 400;
      return {
        success: false,
        message: `Failed to update project`,
        data: null,
      };
    }
  }

  async index(ctx: Context) {
    try {
      const { id } = (ctx as any).userId;
      const projects = await this.projectService.getAllProject(id);

      ctx.set.status = 200;
      return {
        success: true,
        message: "Projects retrieved successfully",
        data: projects,
      };
    } catch (error) {
      ctx.set.status = 404;
      return {
        success: false,
        message: `Failed to retrieve projects ${error}`,
        data: null,
      };
    }
  }

  async show(ctx: Context) {
    try {
      const { id } = ctx.params as { id: string };
      const userId = (ctx as any).userId;

      const project = await this.projectService.getProjectById(id);

      if (project && project.created_by === userId) {
        ctx.set.status = 200;
        return {
          success: true,
          message: "Project retrieved successfully",
          data: project,
        };
      } else {
        ctx.set.status = 404;
        return {
          success: false,
          message: `Failed to retrieve project ${ctx} dan ${project?.created_by}`,
          data: null,
        };
      }
    } catch (error) {
      ctx.set.status = 404;
      return {
        success: false,
        message: `Failed to retrieve project`,
        data: null,
      };
    }
  }

  async destroy(ctx: Context) {
    try {
      const { id } = ctx.params as { id: string };
      const userId = (ctx as any).userId;
      const project = await this.projectService.getProjectById(id);

      if (project && project.created_by === userId) {
        this.projectService.removeProject(id);
        ctx.set.status = 201;
        return {
          success: true,
          message: "Project deleted successfully",
          data: project,
        };
      } else {
        ctx.set.status = 404;
        return {
          success: false,
          message: `Failed to retrieve project`,
          data: null,
        };
      }
    } catch (error) {
      ctx.set.status = 404;
      return {
        success: false,
        message: `Failed to retrieve project`,
        data: null,
      };
    }
  }
}
