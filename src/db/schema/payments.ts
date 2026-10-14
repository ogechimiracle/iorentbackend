

import {
   pgTable,
   uuid,
   varchar,
   text,
   numeric,
   timestamp,
   jsonb,
   index,
   uniqueIndex,
   check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import {
   paymentMethodEnum,
   paymentProviderEnum,
   paymentStatusEnum,
   refundStatusEnum,
} from "./enums";
import { users } from "./identity";
import { salesOrders } from "./sales";
import { rentalBookings } from "./rentals";

export const payments = pgTable(
   "payments",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      reference: varchar("reference", { length: 100 }).notNull(),
      idempotencyKey: varchar("idempotency_key", { length: 160 }),
      salesOrderId: uuid("sales_order_id").references(() => salesOrders.id, {
         onDelete: "restrict",
      }),
      rentalBookingId: uuid("rental_booking_id").references(
         () => rentalBookings.id,
         { onDelete: "restrict" },
      ),
      method: paymentMethodEnum("method").notNull(),
      provider: paymentProviderEnum("provider").notNull(),
      providerReference: varchar("provider_reference", { length: 200 }),
      status: paymentStatusEnum("status").notNull().default("pending"),
      amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
      currency: varchar("currency", { length: 3 }).notNull().default("NGN"),
      paidAt: timestamp("paid_at", { withTimezone: true }),
      receivedBy: uuid("received_by").references(() => users.id, {
         onDelete: "set null",
      }),
      offlineReceiptReference: varchar("offline_receipt_reference", {
         length: 150,
      }),
      metadata: jsonb("metadata").$type<Record<string, unknown>>(),
      createdAt: timestamp("created_at", { withTimezone: true })
         .notNull()
         .defaultNow(),
      updatedAt: timestamp("updated_at", { withTimezone: true })
         .notNull()
         .defaultNow(),
   },
   (t) => [
      uniqueIndex("payments_reference_unique").on(t.reference),
      uniqueIndex("payments_idempotency_unique").on(t.idempotencyKey),
      uniqueIndex("payments_provider_reference_unique")
         .on(t.provider, t.providerReference)
         .where(sql`${t.providerReference} IS NOT NULL`),
      index("payments_sales_order_status_idx").on(t.salesOrderId, t.status),
      index("payments_rental_booking_status_idx").on(
         t.rentalBookingId,
         t.status,
      ),
      index("payments_created_at_idx").on(t.createdAt),
      check("payments_amount_check", sql`${t.amount} > 0`),
      check(
         "payments_currency_check",
         sql`${t.currency} ~ '^[A-Z]{3}$'`,
      ),
      check(
         "payments_one_target_check",
         sql`(
        (${t.salesOrderId} IS NOT NULL AND ${t.rentalBookingId} IS NULL)
        OR
        (${t.salesOrderId} IS NULL AND ${t.rentalBookingId} IS NOT NULL)
      )`,
      ),
      check(
         "payments_offline_receipt_check",
         sql`(${t.method} NOT IN ('cash', 'pos', 'cheque', 'bank_transfer')
        OR ${t.provider} <> 'manual'
        OR ${t.receivedBy} IS NOT NULL
        OR ${t.offlineReceiptReference} IS NOT NULL)`,
      ),
   ],
);

export const refunds = pgTable(
   "refunds",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      paymentId: uuid("payment_id")
         .notNull()
         .references(() => payments.id, { onDelete: "restrict" }),
      reference: varchar("reference", { length: 100 }).notNull(),
      providerReference: varchar("provider_reference", { length: 200 }),
      status: refundStatusEnum("status").notNull().default("pending"),
      amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
      reason: text("reason"),
      processedBy: uuid("processed_by").references(() => users.id, {
         onDelete: "set null",
      }),
      processedAt: timestamp("processed_at", { withTimezone: true }),
      createdAt: timestamp("created_at", { withTimezone: true })
         .notNull()
         .defaultNow(),
   },
   (t) => [
      uniqueIndex("refunds_reference_unique").on(t.reference),
      index("refunds_payment_status_idx").on(t.paymentId, t.status),
      check("refunds_amount_check", sql`${t.amount} > 0`),
   ],
);

export const paymentEvents = pgTable(
   "payment_events",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      paymentId: uuid("payment_id").references(() => payments.id, {
         onDelete: "restrict",
      }),
      provider: paymentProviderEnum("provider").notNull(),
      providerEventId: varchar("provider_event_id", { length: 200 }).notNull(),
      eventType: varchar("event_type", { length: 100 }).notNull(),
      payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
      processedAt: timestamp("processed_at", { withTimezone: true }),
      processingError: text("processing_error"),
      receivedAt: timestamp("received_at", { withTimezone: true })
         .notNull()
         .defaultNow(),
   },
   (t) => [
      uniqueIndex("payment_events_provider_event_unique").on(
         t.provider,
         t.providerEventId,
      ),
      index("payment_events_unprocessed_idx").on(t.receivedAt),
   ],
);