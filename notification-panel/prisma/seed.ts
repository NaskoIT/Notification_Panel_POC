// Import Prisma Client
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

const NOTIFICATIONS_TO_SEED_COUNT = 15;
// Define the main function that will handle database operations
async function main() {
  // Define notification types for variety
  const types = [
    "PLATFORM_UPDATE",
    "COMMENT_TAG",
    "ACCESS_GRANTED",
    "JOIN_WORKSPACE",
  ];

  // Define some sample messages
  const versions = ["3.2.1", "3.3.1", "4.1.1", "5.1.1", "5.2.1"];
  const names = [
    "Nasko.IT",
    "Yavor Belakov",
    "Iliya Valchanov",
    "Simona Dobreva",
    "Ilko Kacharov",
    "Margarita Arsova",
  ];

  const getMessage = (type: string, index: number) => {
    if (type === "PLATFORM_UPDATE") {
      return versions[index % versions.length];
    }

    return names[index % names.length];
  };

  // Seed 34 notifications
  for (let i = 1; i <= NOTIFICATIONS_TO_SEED_COUNT; i++) {
    const type = types[i % types.length];
    const message = getMessage(type, i);
    const read = i % 2 === 0;
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30)); // Random date within the last 30 days

    const notification = await prisma.notification.create({
      data: {
        type,
        message,
        read,
        createdAt,
      },
    });

    console.log(
      `Created notification ${notification.id}: ${notification.message}`
    );
  }
}

// Execute the main function and handle disconnection and errors
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
