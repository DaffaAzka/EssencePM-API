import { jwt } from "@elysiajs/jwt";
import { Context } from "elysia";
import { UserService } from "../services/UserService";
import bcrypt from "bcryptjs";

export class AuthController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async register(ctx: Context) {
    try {
      const body = ctx.body as {
        email: string;
        username: string;
        first_name: string;
        last_name: string;
        password: string;
        avatar_url?: string;
      };

      const user = await this.userService.createUser(body);

      ctx.set.status = 201;
      return {
        success: true,
        message: "User registered successfully",
        data: user,
      };
    } catch (error) {
      ctx.set.status = 400;
      return {
        success: false,
        message: error instanceof Error ? error.message : "Registration failed",
        data: null,
      };
    }
  }

  async login(ctx: Context) {
    try {
      const body = ctx.body as {
        email: string;
        password: string;
      };

      const user = await this.userService.getUserByEmail(body.email);

      if (!user) {
        ctx.set.status = 401;
        return {
          success: false,
          message: "Invalid credentials",
          data: null,
        };
      }

      const isValidPassword = await bcrypt.compare(
        body.password,
        user.password_hash
      );

      if (!isValidPassword) {
        ctx.set.status = 401;
        return {
          success: false,
          message: "Invalid credentials",
          data: null,
        };
      }

      const { password_hash, ...userWithoutPassword } = user;
      const token = await (ctx as any).jwt.sign({
        userId: user.id,
        email: user.email,
        username: user.username,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
      });

      ctx.set.status = 200;
      return {
        success: true,
        message: "Login successful",
        data: userWithoutPassword,
        token,
      };
    } catch (error) {
      ctx.set.status = 500;
      return {
        success: false,
        message: "Login failed",
        data: null,
      };
    }
  }

  async getUsers(ctx: Context) {
    try {
      const users = await this.userService.getAllUsers();

      return {
        success: true,
        message: "Users retrieved successfully",
        data: users,
      };
    } catch (error) {
      ctx.set.status = 500;
      return {
        success: false,
        message: "Failed to retrieve users",
        data: null,
      };
    }
  }

  async getUserById(ctx: Context) {
    try {
      const { id } = ctx.params as { id: string };
      const user = await this.userService.getUserById(id);

      if (!user) {
        ctx.set.status = 404;
        return {
          success: false,
          message: "User not found",
          data: null,
        };
      }

      return {
        success: true,
        message: "User retrieved successfully",
        data: user,
      };
    } catch (error) {
      ctx.set.status = 500;
      return {
        success: false,
        message: "Failed to retrieve user",
        data: null,
      };
    }
  }

  async getProfile(ctx: Context) {
    try {
      const userId = (ctx as any).userId;
      const user = await this.userService.getUserById(userId);

      if (!user) {
        ctx.set.status = 404;
        return {
          success: false,
          message: "User not found",
          data: null,
        };
      }

      return {
        success: true,
        message: "Profile retrieved successfully",
        data: user,
      };
    } catch (error) {
      ctx.set.status = 500;
      return {
        success: false,
        message: "Failed to retrieve profile",
        data: null,
      };
    }
  }
}
