import {
   pgTable,
   uuid,
   varchar,
   text,
   integer,
   numeric,
   timestamp,
   index,
   uniqueIndex,
   check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import {
   rentalBookingStatusEnum,
   inspectionTypeEnum,
   inspectionStatusEnum,
   rentalTypeEnum,
} from "./enums";
import { users, customerProfiles } from "./identity";
import { rentalListings } from "./listings";
import { vehicles } from "./vehicles";

export const rentalBookings = pgTable(
   "rental_bookings",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      bookingNumber: varchar("booking_number", { length: 40 }).notNull(),
      customerId: uuid("customer_id")
         .notNull()
         .references(() => customerProfiles.id, { onDelete: "restrict" }),
      listingId: uuid("listing_id").references(() => rentalListings.id, {
         onDelete: "restrict",
      }),
      vehicleId: uuid("vehicle_id")
         .notNull()
         .references(() => vehicles.id, { onDelete: "restrict" }),
      rentalType: rentalTypeEnum("rental_type").notNull(),
      status: rentalBookingStatusEnum("status").notNull().default("pending"),
      currency: varchar("currency", { length: 3 }).notNull().default("NGN"),

      pickupAt: timestamp("pickup_at", { withTimezone: true }).notNull(),
      returnAt: timestamp("return_at", { withTimezone: true }).notNull(),
      actualPickupAt: timestamp("actual_pickup_at", { withTimezone: true }),
      actualReturnAt: timestamp("actual_return_at", { withTimezone: true }),

      pickupLocation: text("pickup_location").notNull(),
      returnLocation: text("return_location").notNull(),

      dailyRate: numeric("daily_rate", { precision: 14, scale: 2 }).notNull(),
      rentalDays: integer("rental_days").notNull(),
      rentalAmount: numeric("rental_amount", {
         precision: 14,
         scale: 2,
      }).notNull(),
      securityDeposit: numeric("security_deposit", {
         precision: 14,
         scale: 2,
      }).notNull().default("0"),
      discountAmount: numeric("discount_amount", {
         precision: 14,
         scale: 2,
      }).notNull().default("0"),
      extraCharges: numeric("extra_charges", {
         precision: 14,
         scale: 2,
      }).notNull().default("0"),
      totalAmount: numeric("total_amount", {
         precision: 14,
         scale: 2,
      }).notNull(),

      driverName: varchar("driver_name", { length: 200 }),
      driverPhone: varchar("driver_phone", { length: 32 }),
      driverLicenseDocumentId: uuid("driver_license_document_id"),
      customerNote: text("customer_note"),

      confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
      cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
      completedAt: timestamp("completed_at", { withTimezone: true }),
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
      uniqueIndex("rental_bookings_number_unique").on(t.bookingNumber),
      index("rental_bookings_customer_created_idx").on(
         t.customerId,
         t.createdAt,
      ),
      index("rental_bookings_vehicle_period_idx").on(
         t.vehicleId,
         t.pickupAt,
         t.returnAt,
      ),
      index("rental_bookings_status_pickup_idx").on(t.status, t.pickupAt),
      check(
         "rental_bookings_period_check",
         sql`${t.returnAt} > ${t.pickupAt}`,
      ),
      check("rental_bookings_days_check", sql`${t.rentalDays} > 0`),
      check("rental_bookings_rate_check", sql`${t.dailyRate} >= 0`),
      check("rental_bookings_amount_check", sql`
      ${t.rentalAmount} >= 0 AND
      ${t.securityDeposit} >= 0 AND
      ${t.discountAmount} >= 0 AND
      ${t.extraCharges} >= 0 AND
      ${t.totalAmount} >= 0
    `),
      check(
         "rental_bookings_currency_check",
         sql`${t.currency} ~ '^[A-Z]{3}$'`,
      ),
      check(
         "rental_bookings_driver_check",
         sql`(${t.rentalType} = 'self_drive')
       OR (${t.rentalType} = 'chauffeur' AND
           ${t.driverName} IS NOT NULL)`,
      ),
   ],
);



export const rentalAgreements = pgTable(
   "rental_agreements",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      bookingId: uuid("booking_id")
         .notNull()
         .references(() => rentalBookings.id, { onDelete: "restrict" }),
      agreementNumber: varchar("agreement_number", { length: 50 }).notNull(),
      storageKey: text("storage_key"),
      termsVersion: varchar("terms_version", { length: 40 }).notNull(),
      customerAcceptedAt: timestamp("customer_accepted_at", {
         withTimezone: true,
      }),
      customerSignatureStorageKey: text("customer_signature_storage_key"),
      staffUserId: uuid("staff_user_id").references(() => users.id, {
         onDelete: "set null",
      }),
      createdAt: timestamp("created_at", { withTimezone: true })
         .notNull()
         .defaultNow(),
   },
   (t) => [
      uniqueIndex("rental_agreements_booking_unique").on(t.bookingId),
      uniqueIndex("rental_agreements_number_unique").on(t.agreementNumber),
   ],
);

export const rentalInspections = pgTable(
   "rental_inspections",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      bookingId: uuid("booking_id")
         .notNull()
         .references(() => rentalBookings.id, { onDelete: "restrict" }),
      vehicleId: uuid("vehicle_id")
         .notNull()
         .references(() => vehicles.id, { onDelete: "restrict" }),
      inspectionType: inspectionTypeEnum("inspection_type").notNull(),
      status: inspectionStatusEnum("status").notNull().default("pending"),
      odometerKm: integer("odometer_km"),
      fuelLevelPercent: integer("fuel_level_percent"),
      notes: text("notes"),
      inspectedBy: uuid("inspected_by").references(() => users.id, {
         onDelete: "set null",
      }),
      inspectedAt: timestamp("inspected_at", { withTimezone: true }),
      createdAt: timestamp("created_at", { withTimezone: true })
         .notNull()
         .defaultNow(),
   },
   (t) => [
      index("rental_inspections_booking_idx").on(t.bookingId),
      check(
         "rental_inspections_odometer_check",
         sql`${t.odometerKm} IS NULL OR ${t.odometerKm} >= 0`,
      ),
      check(
         "rental_inspections_fuel_check",
         sql`${t.fuelLevelPercent} IS NULL OR
          ${t.fuelLevelPercent} BETWEEN 0 AND 100`,
      ),
   ],
);

export const rentalInspectionImages = pgTable(
   "rental_inspection_images",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      inspectionId: uuid("inspection_id")
         .notNull()
         .references(() => rentalInspections.id, { onDelete: "cascade" }),
      storageKey: text("storage_key").notNull(),
      caption: varchar("caption", { length: 255 }),
      createdAt: timestamp("created_at", { withTimezone: true })
         .notNull()
         .defaultNow(),
   },
   (t) => [index("rental_inspection_images_inspection_idx").on(t.inspectionId)],
);