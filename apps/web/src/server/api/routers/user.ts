import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const userRouter = createTRPCRouter({
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required").max(100),
        image: z.string().url("Must be a valid URL").optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return db.user.update({
        where: { id: ctx.session.user.id },
        data: { name: input.name, image: input.image },
        select: { id: true, name: true, image: true },
      });
    }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { id: true, name: true, email: true, image: true },
    });
  }),
});
