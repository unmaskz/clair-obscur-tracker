import { title } from "process";

const { PrismaClient } = require('@prisma/client');
const fs = require('fs/promises');
const prisma = new PrismaClient();

async function main() {
  // Read and parse JSON files
  const [groupsRaw, categoriesRaw, locationsRaw] = await Promise.all([
    fs.readFile('data/groups.json', 'utf-8'),
    fs.readFile('data/categories.json', 'utf-8'),
    fs.readFile('data/locations.json', 'utf-8'),
  ]);

  const groups = JSON.parse(groupsRaw);
  const categories = JSON.parse(categoriesRaw);
  const locations = JSON.parse(locationsRaw);

  // Seed Groups
  console.log('Seeding groups...');
  for (const group of groups) {
    await prisma.group.upsert({
      where: { title: group.title },
      update: {},
      create: {
        title: group.title,
        color: group.color,
      },
    });
  }

  // Seed Categories
  console.log('Seeding categories...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { title: category.title },
      update: {},
      create: {
        title: category.title,
        icon: category.icon,
        template: category.template,
        groupId: category.groupId,
      },
    });
  }

  // Seed Locations
  console.log('Seeding locations...');
  for (const location of locations) {
    await prisma.location.upsert({
      where: { id: location.id },
      update: {},
      create: {
        id: location.id,
        title: location.title,
        description: location.description,
        latitude: location.latitude,
        longitude: location.longitude,
        category: {
          connect: { id: location.categoryId },
        }
      },
    });
  }

  console.log('✅ Seeding completed.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
