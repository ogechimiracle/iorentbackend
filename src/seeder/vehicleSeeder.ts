import { faker } from "@faker-js/faker";
import { db } from "../db"; // Adjust this import to your actual Drizzle db instance
import {
   vehicleMakes,
   vehicleModels,
   vehicleCategories,
   vehicles,
} from "../db/schema/vehicles"; // Adjust this import to your schema file path

async function seed() {
   console.log("🌱 Starting database seeding...");

   // 1. Create 1 Vehicle Category
   const [category] = await db
      .insert(vehicleCategories)
      .values({
         name: "SUV",
         slug: "suv",
         description: "Sport Utility Vehicles",
      })
      .returning();

   // 2. Create Vehicle Makes (Toyota & Ford)
   const [makeToyota] = await db
      .insert(vehicleMakes)
      .values({
         name: "Toyota",
         slug: "toyota",
      })
      .returning();

   const [makeFord] = await db
      .insert(vehicleMakes)
      .values({
         name: "Ford",
         slug: "ford",
      })
      .returning();

   // 3. Create Vehicle Models for each make
   const [modelRav4] = await db
      .insert(vehicleModels)
      .values({
         makeId: makeToyota.id,
         name: "RAV4",
         slug: "rav4",
      })
      .returning();

   const [modelExplorer] = await db
      .insert(vehicleModels)
      .values({
         makeId: makeFord.id,
         name: "Explorer",
         slug: "explorer",
      })
      .returning();

   // 4. Create EXACTLY TWO Vehicles adhering to constraints:
   // - vehicles_owner_type_check: company_owned -> ownerUserId MUST be null
   // - third_party -> ownerUserId MUST NOT be null (we'll keep both as company_owned to simplify without requiring a user ID)

   await db.insert(vehicles).values([
      {
         stockNumber: faker.string.alphanumeric(8).toUpperCase(),
         makeId: makeToyota.id,
         modelId: modelRav4.id,
         categoryId: category.id,
         ownershipType: "company_owned",
         ownerUserId: null, // Required to be null for company_owned per your check constraint
         condition: "used",
         operationalStatus: "available",
         year: 2022,
         vin: faker.vehicle.vin(),
         registrationNumber: faker.vehicle.vrm(),
         transmission: "Automatic",
         fuelType: "Gasoline",
         mileageKm: 25400,
         color: "Silver",
         seats: 5,
         description: faker.lorem.sentence(),
         isActive: true,
      },
      {
         stockNumber: faker.string.alphanumeric(8).toUpperCase(),
         makeId: makeFord.id,
         modelId: modelExplorer.id,
         categoryId: category.id,
         ownershipType: "company_owned",
         ownerUserId: null, // Required to be null for company_owned per your check constraint
         condition: "new",
         operationalStatus: "available",
         year: 2026,
         vin: faker.vehicle.vin(),
         registrationNumber: faker.vehicle.vrm(),
         transmission: "Automatic",
         fuelType: "Hybrid",
         mileageKm: 120,
         color: "Midnight Blue",
         seats: 7,
         description: faker.lorem.sentence(),
         isActive: true,
      },
   ]);

   console.log("✅ Seeding completed: Exactly 2 vehicles created successfully!");
}

seed().catch((err) => {
   console.error("❌ Seeding failed:", err);
   process.exit(1);
});