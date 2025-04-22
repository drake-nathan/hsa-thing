import { TransactionType } from "@/generated/client";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const hsaTransactionRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        amount: z.number().positive(),
        date: z.date(),
        description: z.string().min(1),
        receiptUrl: z.string().nullable(),
        type: z.nativeEnum(TransactionType),
        withdrawn: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.hsaTransaction.create({
        data: {
          amount: input.amount,
          date: input.date,
          description: input.description,
          receiptUrl: input.receiptUrl,
          type: input.type,
          withdrawn: input.withdrawn,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.hsaTransaction.delete({
        where: { id: input.id },
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const transactions = await ctx.db.hsaTransaction.findMany({
      orderBy: { date: "desc" },
    });

    return transactions;
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const transaction = await ctx.db.hsaTransaction.findUnique({
        where: { id: input.id },
      });

      return transaction;
    }),

  update: publicProcedure
    .input(
      z.object({
        amount: z.number().positive().optional(),
        date: z.date().optional(),
        description: z.string().min(1).optional(),
        id: z.string(),
        receiptUrl: z.string().nullable().optional(),
        type: z.nativeEnum(TransactionType).optional(),
        withdrawn: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.hsaTransaction.update({
        data,
        where: { id },
      });
    }),
});
