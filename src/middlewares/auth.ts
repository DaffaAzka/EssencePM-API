import { Context } from "elysia";

export const authGuard = async (ctx: Context) => {
  try {
    const auth = ctx.headers.authorization;
    if (!auth) {
      ctx.set.status = 401;
      return {
        success: false,
        message: "Authorization header required",
        data: null,
      };
    }

    const token = auth.replace("Bearer ", "");
    if (!token) {
      ctx.set.status = 401;
      return {
        success: false,
        message: "Token required",
        data: null,
      };
    }

    const payload = await(ctx as any).jwt.verify(token);

    if (!payload) {
      ctx.set.status = 401;
      return {
        success: false,
        message: "Invalid token",
        data: null,
      };
    }

    (ctx as any).userId = payload.userId;
    (ctx as any).user = payload;
  } catch (error) {
    ctx.set.status = 401;
    return {
      success: false,
      message: "Invalid token",
      data: null,
    };
  }
};
