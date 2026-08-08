import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import providers from "../data/providers.json";
import resources from "../data/resources.json";
import { stringifyTags } from "../lib/utils";

const prisma = new PrismaClient();

async function seed() {
  // Seed hotlines
  const hotlineEntries = Object.entries(resources.hotlines).map(([locale, hotline]) => ({
    locale,
    name: hotline.name,
    number: hotline.number,
    text: hotline.text,
  }));

  for (const h of hotlineEntries) {
    await prisma.hotline.upsert({
      where: { locale: h.locale },
      update: h,
      create: h,
    });
  }

  // Seed grants
  for (const g of resources.grants) {
    await prisma.grant.upsert({
      where: { legacyId: g.id },
      update: {
        name: g.name,
        description: g.description,
        amount: g.amount,
        coverage: g.coverage,
        featured: g.featured,
        rolling: g.rolling,
        tags: stringifyTags(g.tags),
      },
      create: {
        legacyId: g.id,
        name: g.name,
        description: g.description,
        amount: g.amount,
        coverage: g.coverage,
        featured: g.featured,
        rolling: g.rolling,
        tags: stringifyTags(g.tags),
      },
    });
  }

  // Seed providers
  for (const p of providers) {
    await prisma.provider.upsert({
      where: { legacyId: p.id },
      update: {
        name: p.name,
        locale: p.locale,
        type: p.type,
        verified: p.verified,
        cost: p.cost,
        description: p.description,
        tags: stringifyTags(p.tags),
        founded: p.founded,
        reach: p.reach,
      },
      create: {
        legacyId: p.id,
        name: p.name,
        locale: p.locale,
        type: p.type,
        verified: p.verified,
        cost: p.cost,
        description: p.description,
        tags: stringifyTags(p.tags),
        founded: p.founded,
        reach: p.reach,
      },
    });
  }

  // Create a default admin user if credentials are provided
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const existing = await prisma.user.findUnique({
      where: { email: process.env.ADMIN_EMAIL },
    });
    if (!existing) {
      await prisma.user.create({
        data: {
          email: process.env.ADMIN_EMAIL,
          hashedPassword: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12),
          role: "ADMIN",
        },
      });
    }
  }

  console.log("✅ Database seeded");
}

seed()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
