import {
   pgTable,
   uuid,
   varchar,
   text,
   timestamp,
   boolean,
   index,
   uniqueIndex,
} from "drizzle-orm/pg-core";
import { documentStatusEnum, userRoleEnum, userStatusEnum } from "./enums";

export const users = pgTable(
   "users",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      email: varchar("email", { length: 255 }).notNull(),
      name: varchar("name", { length: 100 }).notNull(),
      phone: varchar("phone", { length: 32 }),
      passwordHash: text("password_hash"),
      firstName: varchar("first_name", { length: 100 }),
      lastName: varchar("last_name", { length: 100 }),
      role: userRoleEnum("role").notNull().default("user"),
      status: userStatusEnum("status").notNull().default("active"),
      emailVerifiedAt: timestamp("email_verified_at", {
         withTimezone: true,
      }),
      phoneVerifiedAt: timestamp("phone_verified_at", {
         withTimezone: true,
      }),
      lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
      createdAt: timestamp("created_at", { withTimezone: true })
         .notNull()
         .defaultNow(),
      updatedAt: timestamp("updated_at", { withTimezone: true })
         .notNull()
         .defaultNow(),
   },
   (t) => [
      uniqueIndex("users_email_unique").on(t.email),
      uniqueIndex("users_phone_unique").on(t.phone),
      index("users_role_status_idx").on(t.role, t.status),
   ],
);

export const userSessions = pgTable(
   "user_sessions",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      userId: uuid("user_id")
         .notNull()
         .references(() => users.id, { onDelete: "cascade" }),
      tokenHash: text("token_hash").notNull(),
      expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
      revokedAt: timestamp("revoked_at", { withTimezone: true }),
      createdAt: timestamp("created_at", { withTimezone: true })
         .notNull()
         .defaultNow(),
   },
   (t) => [
      uniqueIndex("user_sessions_token_hash_unique").on(t.tokenHash),
      index("user_sessions_user_expiry_idx").on(t.userId, t.expiresAt),
   ],
);

export const customerProfiles = pgTable(
   "customer_profiles",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      userId: uuid("user_id")
         .notNull()
         .unique()
         .references(() => users.id, { onDelete: "restrict" }),
      dateOfBirth: timestamp("date_of_birth", { mode: "date" }),
      companyName: varchar("company_name", { length: 200 }),
      taxId: varchar("tax_id", { length: 100 }),
      createdAt: timestamp("created_at", { withTimezone: true })
         .notNull()
         .defaultNow(),
      updatedAt: timestamp("updated_at", { withTimezone: true })
         .notNull()
         .defaultNow(),
   },
);

export const customerAddresses = pgTable(
   "customer_addresses",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      customerId: uuid("customer_id")
         .notNull()
         .references(() => customerProfiles.id, { onDelete: "cascade" }),
      label: varchar("label", { length: 50 }),
      recipientName: varchar("recipient_name", { length: 200 }).notNull(),
      phone: varchar("phone", { length: 32 }),
      addressLine1: varchar("address_line_1", { length: 255 }).notNull(),
      addressLine2: varchar("address_line_2", { length: 255 }),
      city: varchar("city", { length: 100 }).notNull(),
      state: varchar("state", { length: 100 }).notNull(),
      countryCode: varchar("country_code", { length: 2 })
         .notNull()
         .default("NG"),
      postalCode: varchar("postal_code", { length: 20 }),
      isDefault: boolean("is_default").notNull().default(false),
      createdAt: timestamp("created_at", { withTimezone: true })
         .notNull()
         .defaultNow(),
   },
   (t) => [index("customer_addresses_customer_idx").on(t.customerId)],
);

export const customerDocuments = pgTable(
   "customer_documents",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      customerId: uuid("customer_id")
         .notNull()
         .references(() => customerProfiles.id, { onDelete: "restrict" }),
      documentType: varchar("document_type", { length: 80 }).notNull(),
      storageKey: text("storage_key").notNull(),
      status: documentStatusEnum("status").notNull().default("pending"),
      verifiedBy: uuid("verified_by").references(() => users.id, {
         onDelete: "set null",
      }),
      verifiedAt: timestamp("verified_at", { withTimezone: true }),
      expiresAt: timestamp("expires_at", { withTimezone: true }),
      createdAt: timestamp("created_at", { withTimezone: true })
         .notNull()
         .defaultNow(),
   },
   (t) => [
      index("customer_documents_customer_status_idx").on(
         t.customerId,
         t.status,
      ),
   ],
);