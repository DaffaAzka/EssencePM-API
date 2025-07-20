import { ProjectMemberService } from "./../services/ProjectMemberService";
import { ProjectService } from "./../services/ProjectService";
import Elysia, { Context, t } from "elysia";

export class ProjectMemberController {
  private projectMemberService: ProjectMemberService;
  private projectService: ProjectService;

  constructor() {
    this.projectMemberService = new ProjectMemberService();
    this.projectService = new ProjectService();
  }

  async store(ctx: Context) {
    try {
      const userId = (ctx as any).userId;
      const { id: project_id } = ctx.params as { id: string };

      const body = ctx.body as {
        user_id: string;
      };

      const project = await this.projectService.getProjectById(project_id);
      if (!project || project.created_by !== userId) {
        ctx.set.status = 403;
        return {
          success: false,
          message: "You don't have permission to add members to this project",
          data: null,
        };
      }

      const data = {
        project_id,
        user_id: body.user_id,
      };

      const projectMember = await this.projectMemberService.createProjectMember(
        data
      );
      ctx.set.status = 201;
      return {
        success: true,
        message: "Member added to project successfully",
        data: projectMember,
      };
    } catch (error) {
      ctx.set.status = 400;
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to add member to project",
        data: null,
      };
    }
  }

  async index(ctx: Context) {
    try {
      const userId = (ctx as any).userId;
      const { id: project_id } = ctx.params as { id: string };

      const project = await this.projectService.getProjectById(project_id);
      const isMember = await this.projectMemberService.checkMembership({
        project_id,
        user_id: userId,
      });

      if (!project || (project.created_by !== userId && !isMember)) {
        ctx.set.status = 403;
        return {
          success: false,
          message: "You don't have permission to view members of this project",
          data: null,
        };
      }

      const members = await this.projectMemberService.getProjectMembers(
        project_id
      );
      ctx.set.status = 200;
      return {
        success: true,
        message: "Project members retrieved successfully",
        data: members,
      };
    } catch (error) {
      ctx.set.status = 404;
      return {
        success: false,
        message: `Failed to retrieve project members: ${error}`,
        data: null,
      };
    }
  }

  async show(ctx: Context) {
    try {
      const userId = (ctx as any).userId;
      const { id: project_id, member_id } = ctx.params as {
        id: string;
        member_id: string;
      };

      const project = await this.projectService.getProjectById(project_id);
      const isMember = await this.projectMemberService.checkMembership({
        project_id,
        user_id: userId,
      });

      if (!project || (project.created_by !== userId && !isMember)) {
        ctx.set.status = 403;
        return {
          success: false,
          message: "You don't have permission to view this project member",
          data: null,
        };
      }

      const projectMember =
        await this.projectMemberService.getProjectMemberById(member_id);

      if (!projectMember || projectMember.project_id !== project_id) {
        ctx.set.status = 404;
        return {
          success: false,
          message: "Project member not found",
          data: null,
        };
      }

      ctx.set.status = 200;
      return {
        success: true,
        message: "Project member retrieved successfully",
        data: projectMember,
      };
    } catch (error) {
      ctx.set.status = 404;
      return {
        success: false,
        message: "Failed to retrieve project member",
        data: null,
      };
    }
  }

  async destroy(ctx: Context) {
    try {
      const userId = (ctx as any).userId;
      const { id: project_id, user_id } = ctx.params as {
        id: string;
        user_id: string;
      };

      const project = await this.projectService.getProjectById(project_id);
      if (!project || (project.created_by !== userId && userId !== user_id)) {
        ctx.set.status = 403;
        return {
          success: false,
          message: "You don't have permission to remove this member",
          data: null,
        };
      }

      const data = {
        project_id,
        user_id,
      };

      const removedMember = await this.projectMemberService.removeProjectMember(
        data
      );
      ctx.set.status = 200;
      return {
        success: true,
        message: "Member removed from project successfully",
        data: removedMember,
      };
    } catch (error) {
      ctx.set.status = 404;
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to remove member from project",
        data: null,
      };
    }
  }

  async getUserProjects(ctx: Context) {
    try {
      const userId = (ctx as any).userId;

      const userProjects = await this.projectMemberService.getUserProjects(
        userId
      );
      ctx.set.status = 200;
      return {
        success: true,
        message: "User projects retrieved successfully",
        data: userProjects,
      };
    } catch (error) {
      ctx.set.status = 404;
      return {
        success: false,
        message: `Failed to retrieve user projects: ${error}`,
        data: null,
      };
    }
  }

  async bulkStore(ctx: Context) {
    try {
      const userId = (ctx as any).userId;
      const { id: project_id } = ctx.params as { id: string };

      const body = ctx.body as {
        user_ids: string[];
      };

      const project = await this.projectService.getProjectById(project_id);
      if (!project || project.created_by !== userId) {
        ctx.set.status = 403;
        return {
          success: false,
          message: "You don't have permission to add members to this project",
          data: null,
        };
      }

      const data = {
        project_id,
        user_ids: body.user_ids,
      };

      const result = await this.projectMemberService.bulkAddMembers(data);
      ctx.set.status = 201;
      return {
        success: true,
        message: `Successfully added ${result.created} members to project`,
        data: result,
      };
    } catch (error) {
      ctx.set.status = 400;
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to add members to project",
        data: null,
      };
    }
  }

  async checkMembership(ctx: Context) {
    try {
      const userId = (ctx as any).userId;
      const { id: project_id } = ctx.params as { id: string };
      const { user_id } = ctx.query as { user_id?: string };

      const targetUserId = user_id || userId;

      const project = await this.projectService.getProjectById(project_id);
      if (
        !project ||
        (project.created_by !== userId && targetUserId !== userId)
      ) {
        ctx.set.status = 403;
        return {
          success: false,
          message: "You don't have permission to check this membership",
          data: null,
        };
      }

      const isMember = await this.projectMemberService.checkMembership({
        project_id,
        user_id: targetUserId,
      });

      ctx.set.status = 200;
      return {
        success: true,
        message: "Membership status retrieved successfully",
        data: {
          is_member: isMember,
          user_id: targetUserId,
          project_id,
        },
      };
    } catch (error) {
      ctx.set.status = 400;
      return {
        success: false,
        message: "Failed to check membership status",
        data: null,
      };
    }
  }
}
