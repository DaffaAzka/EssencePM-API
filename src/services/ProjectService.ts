import { prisma } from "../db";

export class ProjectService {
  async createProject(data: {
    name: string;
    description: string;
    status?: string;
    priority?: string;
    start_date: Date;
    end_date: Date;
    created_by: string;
  }) {
    try {
      const project = await prisma.project.create({
        data: {
          name: data.name,
          description: data.description,
          status: data.status ?? "active",
          priority: data.priority ?? "medium",
          start_date: data.start_date,
          end_date: data.end_date,
          created_by: data.created_by,
        },
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              first_name: true,
              last_name: true,
              email: true,
            },
          },
        },
      });

      return project;
    } catch (error) {
      throw new Error(`Failed to create project`);
    }
  }

  async updateProject(
    id: string,
    data: {
      name?: string;
      description?: string;
      status?: string;
      priority?: string;
      start_date?: Date;
      end_date?: Date;
      created_by?: string;
    }
  ) {
    try {
      // const project = prisma.project.findUnique({
      //   where: { id },
      // });

      // if (!project) {
      //   throw new Error(`Project ${id} not found`);
      // }

      return await prisma.project.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.description && { description: data.description }),
          ...(data.status && { status: data.status }),
          ...(data.priority && { priority: data.priority }),
          ...(data.start_date && { start_date: data.start_date }),
          ...(data.end_date && { end_date: data.end_date }),
          updated_at: new Date(),
        },
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              first_name: true,
              last_name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(`Failed to update project`);
    }
  }

  async getProjectById(id: string) {
    return await prisma.project.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    });
  }

  async getAllProject(id: string) {
    return await prisma.project.findMany({
      where: {
        created_by: id
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }
}
