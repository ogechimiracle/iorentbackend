
import {
   pgTable,
   uuid,
   varchar,
   text,
   numeric,
   boolean,
   timestamp,
   index,
   uniqueIndex,
   check,
   integer,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { listingStatusEnum, rentalTypeEnum } from "./enums";
import { users } from "./identity";
import { vehicles } from "./vehicles";

export const saleListings = pgTable(
   "sale_listings",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      vehicleId: uuid("vehicle_id")
         .notNull()
         .references(() => vehicles.id, { onDelete: "restrict" }),
      slug: varchar("slug", { length: 180 }).notNull(),
      title: varchar("title", { length: 255 }).notNull(),
      description: text("description"),
      askingPrice: numeric("asking_price", {
         precision: 14,
         scale: 2,
      }).notNull(),
      currency: varchar("currency", { length: 3 }).notNull().default("NGN"),
      status: listingStatusEnum("status").notNull().default("draft"),
      publishedAt: timestamp("published_at", { withTimezone: true }),
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
      uniqueIndex("sale_listings_slug_unique").on(t.slug),
      // One active sale listing per physical vehicle.
      uniqueIndex("sale_listings_vehicle_unique").on(t.vehicleId),
      index("sale_listings_status_price_idx").on(t.status, t.askingPrice),
      check("sale_listings_price_check", sql`${t.askingPrice} >= 0`),
      check("sale_listings_currency_check", sql`${t.currency} ~ '^[A-Z]{3}$'`),
   ],
);

export const rentalListings = pgTable(
   "rental_listings",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      vehicleId: uuid("vehicle_id")
         .notNull()
         .references(() => vehicles.id, { onDelete: "restrict" }),
      slug: varchar("slug", { length: 180 }).notNull(),
      title: varchar("title", { length: 255 }).notNull(),
      description: text("description"),
      rentalType: rentalTypeEnum("rental_type").notNull(),
      dailyRate: numeric("daily_rate", {
         precision: 14,
         scale: 2,
      }).notNull(),
      weeklyRate: numeric("weekly_rate", { precision: 14, scale: 2 }),
      monthlyRate: numeric("monthly_rate", { precision: 14, scale: 2 }),
      securityDeposit: numeric("security_deposit", {
         precision: 14,
         scale: 2,
      })
         .notNull()
         .default("0"),
      currency: varchar("currency", { length: 3 }).notNull().default("NGN"),
      pickupInstructions: text("pickup_instructions"),
      minimumRentalDays: integer("minimum_rental_days").notNull().default(1),
      maximumRentalDays: integer("maximum_rental_days"),
      status: listingStatusEnum("status").notNull().default("draft"),
      publishedAt: timestamp("published_at", { withTimezone: true }),
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
      uniqueIndex("rental_listings_slug_unique").on(t.slug),
      index("rental_listings_status_rate_idx").on(t.status, t.dailyRate),
      index("rental_listings_vehicle_status_idx").on(t.vehicleId, t.status),
      check("rental_listings_daily_rate_check", sql`${t.dailyRate} >= 0`),
      check(
         "rental_listings_deposit_check",
         sql`${t.securityDeposit} >= 0`,
      ),
      check(
         "rental_listings_weekly_rate_check",
         sql`${t.weeklyRate} IS NULL OR ${t.weeklyRate} >= 0`,
      ),
      check(
         "rental_listings_monthly_rate_check",
         sql`${t.monthlyRate} IS NULL OR ${t.monthlyRate} >= 0`,
      ),
      check(
         "rental_listings_days_check",
         sql`${t.minimumRentalDays} >= 1 AND
          (${t.maximumRentalDays} IS NULL OR
           ${t.maximumRentalDays} >= ${t.minimumRentalDays})`,
      ),
      check(
         "rental_listings_currency_check",
         sql`${t.currency} ~ '^[A-Z]{3}$'`,
      ),
   ],
);