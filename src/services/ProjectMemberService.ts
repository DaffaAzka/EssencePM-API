import { prisma } from "../db";

export class ProjectMemberService {
  async createProjectMember(data: { project_id: string; user_id: string }) {
    try {
      const existingMember = await prisma.projectMember.findFirst({
        where: {
          project_id: data.project_id,
          user_id: data.user_id,
        },
      });

      if (existingMember) {
        throw new Error("User is already a member of this project");
      }

      const projectMember = await prisma.projectMember.create({
        data: {
          project_id: data.project_id,
          user_id: data.user_id,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              first_name: true,
              last_name: true,
              email: true,
              avatar_url: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
              description: true,
              status: true,
              priority: true,
            },
          },
        },
      });

      return projectMember;
    } catch (error) {
      throw new Error(`Failed to add member to project: ${error}`);
    }
  }

  async removeProjectMember(data: { project_id: string; user_id: string }) {
    try {
      const projectMember = await prisma.projectMember.findFirst({
        where: {
          project_id: data.project_id,
          user_id: data.user_id,
        },
      });

      if (!projectMember) {
        throw new Error("Project member not found");
      }

      return await prisma.projectMember.delete({
        where: {
          id: projectMember.id,
        },
      });
    } catch (error) {
      throw new Error(`Failed to remove member from project: ${error}`);
    }
  }

  async getProjectMembers(project_id: string) {
    try {
      return await prisma.projectMember.findMany({
        where: {
          project_id,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              first_name: true,
              last_name: true,
              email: true,
              avatar_url: true,
            },
          },
        },
        orderBy: {
          joined_at: "desc",
        },
      });
    } catch (error) {
      throw new Error(`Failed to get project members: ${error}`);
    }
  }

  async getUserProjects(user_id: string) {
    try {
      return await prisma.projectMember.findMany({
        where: {
          user_id,
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              description: true,
              status: true,
              priority: true,
              start_date: true,
              end_date: true,
              created_at: true,
              creator: {
                select: {
                  id: true,
                  username: true,
                  first_name: true,
                  last_name: true,
                },
              },
            },
          },
        },
        orderBy: {
          joined_at: "desc",
        },
      });
    } catch (error) {
      throw new Error(`Failed to get user projects: ${error}`);
    }
  }

  async getProjectMemberById(id: string) {
    try {
      return await prisma.projectMember.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              first_name: true,
              last_name: true,
              email: true,
              avatar_url: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
              description: true,
              status: true,
              priority: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to get project member: ${error}`);
    }
  }

  async checkMembership(data: { project_id: string; user_id: string }) {
    try {
      const member = await prisma.projectMember.findFirst({
        where: {
          project_id: data.project_id,
          user_id: data.user_id,
        },
      });

      return !!member; 
    } catch (error) {
      throw new Error(`Failed to check membership: ${error}`);
    }
  }

  async bulkAddMembers(data: { project_id: string; user_ids: string[] }) {
    try {
      // Check for existing members
      const existingMembers = await prisma.projectMember.findMany({
        where: {
          project_id: data.project_id,
          user_id: { in: data.user_ids },
        },
      });

      const existingUserIds = existingMembers.map((member) => member.user_id);
      const newUserIds = data.user_ids.filter(
        (id) => !existingUserIds.includes(id)
      );

      if (newUserIds.length === 0) {
        throw new Error("All users are already members of this project");
      }

      const membersData = newUserIds.map((user_id) => ({
        project_id: data.project_id,
        user_id,
      }));

      const createdMembers = await prisma.projectMember.createMany({
        data: membersData,
      });

      return {
        created: createdMembers.count,
        skipped: existingUserIds.length,
        total: data.user_ids.length,
      };
    } catch (error) {
      throw new Error(`Failed to bulk add members: ${error}`);
    }
  }

  async removeAllProjectMembers(project_id: string) {
    try {
      return await prisma.projectMember.deleteMany({
        where: {
          project_id,
        },
      });
    } catch (error) {
      throw new Error(`Failed to remove all project members: ${error}`);
    }
  }
}
