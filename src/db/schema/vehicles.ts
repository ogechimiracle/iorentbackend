
import {
   pgTable,
   uuid,
   varchar,
   text,
   integer,
   boolean,
   timestamp,
   numeric,
   index,
   uniqueIndex,
   check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import {
   vehicleConditionEnum,
   vehicleOperationalStatusEnum,
   vehicleOwnershipTypeEnum,
} from "./enums";
import { users } from "./identity";

export const vehicleMakes = pgTable(
   "vehicle_makes",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      name: varchar("name", { length: 100 }).notNull(),
      slug: varchar("slug", { length: 120 }).notNull(),
   },
   (t) => [
      uniqueIndex("vehicle_makes_name_unique").on(t.name),
      uniqueIndex("vehicle_makes_slug_unique").on(t.slug),
   ],
);

export const vehicleModels = pgTable(
   "vehicle_models",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      makeId: uuid("make_id")
         .notNull()
         .references(() => vehicleMakes.id, { onDelete: "restrict" }),
      name: varchar("name", { length: 120 }).notNull(),
      slug: varchar("slug", { length: 140 }).notNull(),
   },
   (t) => [
      uniqueIndex("vehicle_models_make_name_unique").on(t.makeId, t.name),
      uniqueIndex("vehicle_models_make_slug_unique").on(t.makeId, t.slug),
   ],
);

export const vehicleCategories = pgTable(
   "vehicle_categories",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      name: varchar("name", { length: 100 }).notNull(),
      slug: varchar("slug", { length: 120 }).notNull(),
      description: text("description"),
   },
   (t) => [
      uniqueIndex("vehicle_categories_name_unique").on(t.name),
      uniqueIndex("vehicle_categories_slug_unique").on(t.slug),
   ],
);

export const vehicleFeatures = pgTable(
   "vehicle_features",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      name: varchar("name", { length: 100 }).notNull(),
      slug: varchar("slug", { length: 120 }).notNull(),
   },
   (t) => [
      uniqueIndex("vehicle_features_name_unique").on(t.name),
      uniqueIndex("vehicle_features_slug_unique").on(t.slug),
   ],
);

export const vehicles = pgTable(
   "vehicles",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      stockNumber: varchar("stock_number", { length: 50 }).notNull(),
      makeId: uuid("make_id")
         .notNull()
         .references(() => vehicleMakes.id, { onDelete: "restrict" }),
      modelId: uuid("model_id")
         .notNull()
         .references(() => vehicleModels.id, { onDelete: "restrict" }),
      categoryId: uuid("category_id").references(
         () => vehicleCategories.id,
         { onDelete: "set null" },
      ),
      ownershipType: vehicleOwnershipTypeEnum("ownership_type")
         .notNull()
         .default("company_owned"),
      ownerUserId: uuid("owner_user_id").references(() => users.id, {
         onDelete: "restrict",
      }),
      condition: vehicleConditionEnum("condition").notNull(),
      operationalStatus: vehicleOperationalStatusEnum("operational_status")
         .notNull()
         .default("available"),
      year: integer("year").notNull(),
      vin: varchar("vin", { length: 50 }),
      registrationNumber: varchar("registration_number", { length: 50 }),
      transmission: varchar("transmission", { length: 30 }),
      fuelType: varchar("fuel_type", { length: 30 }),
      mileageKm: integer("mileage_km").notNull().default(0),
      color: varchar("color", { length: 50 }),
      seats: integer("seats").notNull().default(5),
      description: text("description"),
      isActive: boolean("is_active").notNull().default(true),
      createdBy: uuid("created_by").references(() => users.id, {
         onDelete: "set null",
      }),
      createdAt: timestamp("created_at", { withTimezone: true })
         .notNull()
         .defaultNow(),
      updatedAt: timestamp("updated_at", { withTimezone: true })
         .notNull()
         .defaultNow(),
   },
   (t) => [
      uniqueIndex("vehicles_stock_number_unique").on(t.stockNumber),
      uniqueIndex("vehicles_vin_unique").on(t.vin),
      index("vehicles_make_model_idx").on(t.makeId, t.modelId),
      index("vehicles_category_idx").on(t.categoryId),
      index("vehicles_status_active_idx").on(t.operationalStatus, t.isActive),
      index("vehicles_ownership_idx").on(t.ownershipType, t.ownerUserId),
      check("vehicles_year_check", sql`${t.year} BETWEEN 1886 AND 2200`),
      check("vehicles_mileage_check", sql`${t.mileageKm} >= 0`),
      check("vehicles_seats_check", sql`${t.seats} BETWEEN 1 AND 100`),
      check(
         "vehicles_owner_type_check",
         sql`(${t.ownershipType} = 'company_owned' AND ${t.ownerUserId} IS NULL)
       OR (${t.ownershipType} = 'third_party' AND ${t.ownerUserId} IS NOT NULL)`,
      ),
   ],
);

export const vehicleImages = pgTable(
   "vehicle_images",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      vehicleId: uuid("vehicle_id")
         .notNull()
         .references(() => vehicles.id, { onDelete: "cascade" }),
      storageKey: text("storage_key").notNull(),
      altText: varchar("alt_text", { length: 255 }),
      sortOrder: integer("sort_order").notNull().default(0),
      isPrimary: boolean("is_primary").notNull().default(false),
      createdAt: timestamp("created_at", { withTimezone: true })
         .notNull()
         .defaultNow(),
   },
   (t) => [
      index("vehicle_images_vehicle_order_idx").on(t.vehicleId, t.sortOrder),
      uniqueIndex("vehicle_images_one_primary_per_vehicle")
         .on(t.vehicleId)
         .where(sql`${t.isPrimary} = true`),
   ],
);

export const vehicleFeatureAssignments = pgTable(
   "vehicle_feature_assignments",
   {
      vehicleId: uuid("vehicle_id")
         .notNull()
         .references(() => vehicles.id, { onDelete: "cascade" }),
      featureId: uuid("feature_id")
         .notNull()
         .references(() => vehicleFeatures.id, { onDelete: "cascade" }),
   },
   (t) => [
      uniqueIndex("vehicle_feature_assignments_pk").on(
         t.vehicleId,
         t.featureId,
      ),
   ],
);

export const vehicleDocuments = pgTable(
   "vehicle_documents",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      vehicleId: uuid("vehicle_id")
         .notNull()
         .references(() => vehicles.id, { onDelete: "restrict" }),
      documentType: varchar("document_type", { length: 80 }).notNull(),
      storageKey: text("storage_key").notNull(),
      documentNumber: varchar("document_number", { length: 100 }),
      expiresAt: timestamp("expires_at", { withTimezone: true }),
      verifiedAt: timestamp("verified_at", { withTimezone: true }),
      createdAt: timestamp("created_at", { withTimezone: true })
         .notNull()
         .defaultNow(),
   },
   (t) => [index("vehicle_documents_vehicle_idx").on(t.vehicleId)],
);