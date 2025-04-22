import { PrismaClient, TransactionType } from "@/generated/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

const main = async () => {
  // Clear existing data (optional) - use with caution
  await prisma.hsaTransaction.deleteMany();

  console.info("🌱 Seeding database...");

  // Seed HSA transactions
  const transactions = [
    {
      amount: 1500,
      date: new Date("2023-12-15"),
      description: "Annual contribution",
      receiptUrl: null,
      type: TransactionType.deposit,
      withdrawn: false,
    },
    {
      amount: 150,
      date: new Date("2023-12-20"),
      description: "Doctor visit",
      receiptUrl: "/placeholder.svg?height=300&width=300",
      type: TransactionType.expense,
      withdrawn: true,
    },
    {
      amount: 75,
      date: new Date("2024-01-05"),
      description: "Prescription",
      receiptUrl: "/placeholder.svg?height=300&width=300",
      type: TransactionType.expense,
      withdrawn: false,
    },
    {
      amount: 1000,
      date: new Date("2024-01-15"),
      description: "Employer contribution",
      receiptUrl: null,
      type: TransactionType.deposit,
      withdrawn: false,
    },
  ];

  for (const transaction of transactions) {
    await prisma.hsaTransaction.create({
      data: transaction,
    });
  }

  console.info(`✅ Seeded ${transactions.length} HSA transactions`);
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e: unknown) => {
    console.error("❌ Error seeding database:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
