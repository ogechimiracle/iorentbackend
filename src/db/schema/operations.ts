

import {
   pgTable,
   uuid,
   varchar,
   text,
   integer,
   numeric,
   timestamp,
   jsonb,
   index,
   check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { maintenanceStatusEnum } from "./enums";
import { users } from "./identity";
import { vehicles } from "./vehicles";

export const maintenanceRecords = pgTable(
   "maintenance_records",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      vehicleId: uuid("vehicle_id")
         .notNull()
         .references(() => vehicles.id, { onDelete: "restrict" }),
      title: varchar("title", { length: 200 }).notNull(),
      description: text("description"),
      serviceProvider: varchar("service_provider", { length: 200 }),
      status: maintenanceStatusEnum("status").notNull().default("scheduled"),
      scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
      startedAt: timestamp("started_at", { withTimezone: true }),
      completedAt: timestamp("completed_at", { withTimezone: true }),
      odometerKm: integer("odometer_km"),
      cost: numeric("cost", { precision: 14, scale: 2 }).notNull().default("0"),
      currency: varchar("currency", { length: 3 }).notNull().default("NGN"),
      invoiceStorageKey: text("invoice_storage_key"),
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
      index("maintenance_vehicle_status_idx").on(t.vehicleId, t.status),
      index("maintenance_scheduled_at_idx").on(t.scheduledAt),
      check("maintenance_cost_check", sql`${t.cost} >= 0`),
      check(
         "maintenance_odometer_check",
         sql`${t.odometerKm} IS NULL OR ${t.odometerKm} >= 0`,
      ),
      check(
         "maintenance_currency_check",
         sql`${t.currency} ~ '^[A-Z]{3}$'`,
      ),
   ],
);

export const vehicleStatusHistory = pgTable(
   "vehicle_status_history",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      vehicleId: uuid("vehicle_id")
         .notNull()
         .references(() => vehicles.id, { onDelete: "restrict" }),
      previousStatus: varchar("previous_status", { length: 40 }),
      newStatus: varchar("new_status", { length: 40 }).notNull(),
      reason: text("reason"),
      changedBy: uuid("changed_by").references(() => users.id, {
         onDelete: "set null",
      }),
      changedAt: timestamp("changed_at", { withTimezone: true })
         .notNull()
         .defaultNow(),
   },
   (t) => [index("vehicle_status_history_vehicle_date_idx").on(
      t.vehicleId,
      t.changedAt,
   )],
);

export const auditLogs = pgTable(
   "audit_logs",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      actorUserId: uuid("actor_user_id").references(() => users.id, {
         onDelete: "set null",
      }),
      action: varchar("action", { length: 100 }).notNull(),
      entityType: varchar("entity_type", { length: 100 }).notNull(),
      entityId: uuid("entity_id"),
      requestId: varchar("request_id", { length: 100 }),
      ipAddress: varchar("ip_address", { length: 64 }),
      userAgent: text("user_agent"),
      changes: jsonb("changes").$type<Record<string, unknown>>(),
      createdAt: timestamp("created_at", { withTimezone: true })
         .notNull()
         .defaultNow(),
   },
   (t) => [
      index("audit_logs_actor_date_idx").on(t.actorUserId, t.createdAt),
      index("audit_logs_entity_idx").on(t.entityType, t.entityId),
      index("audit_logs_request_idx").on(t.requestId),
   ],
);

export const notifications = pgTable(
   "notifications",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      userId: uuid("user_id")
         .notNull()
         .references(() => users.id, { onDelete: "cascade" }),
      channel: varchar("channel", { length: 30 }).notNull(),
      subject: varchar("subject", { length: 255 }),
      body: text("body").notNull(),
      metadata: jsonb("metadata").$type<Record<string, unknown>>(),
      sentAt: timestamp("sent_at", { withTimezone: true }),
      readAt: timestamp("read_at", { withTimezone: true }),
      createdAt: timestamp("created_at", { withTimezone: true })
         .notNull()
         .defaultNow(),
   },
   (t) => [
      index("notifications_user_read_date_idx").on(
         t.userId,
         t.readAt,
         t.createdAt,
      ),
   ],
);