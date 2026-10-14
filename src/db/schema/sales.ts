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
import { salesOrderStatusEnum } from "./enums";
import { users, customerProfiles } from "./identity";
import { saleListings } from "./listings";
import { vehicles } from "./vehicles";

export const salesOrders = pgTable(
   "sales_orders",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      orderNumber: varchar("order_number", { length: 40 }).notNull(),
      customerId: uuid("customer_id")
         .notNull()
         .references(() => customerProfiles.id, { onDelete: "restrict" }),
      status: salesOrderStatusEnum("status").notNull().default("pending"),
      currency: varchar("currency", { length: 3 }).notNull().default("NGN"),
      subtotal: numeric("subtotal", { precision: 14, scale: 2 }).notNull(),
      discountAmount: numeric("discount_amount", {
         precision: 14,
         scale: 2,
      }).notNull().default("0"),
      taxAmount: numeric("tax_amount", {
         precision: 14,
         scale: 2,
      }).notNull().default("0"),
      deliveryFee: numeric("delivery_fee", {
         precision: 14,
         scale: 2,
      }).notNull().default("0"),
      totalAmount: numeric("total_amount", {
         precision: 14,
         scale: 2,
      }).notNull(),
      customerNote: text("customer_note"),
      createdBy: uuid("created_by").references(() => users.id, {
         onDelete: "set null",
      }),
      confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
      completedAt: timestamp("completed_at", { withTimezone: true }),
      cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
      createdAt: timestamp("created_at", { withTimezone: true })
         .notNull()
         .defaultNow(),
      updatedAt: timestamp("updated_at", { withTimezone: true })
         .notNull()
         .defaultNow(),
   },
   (t) => [
      uniqueIndex("sales_orders_number_unique").on(t.orderNumber),
      index("sales_orders_customer_created_idx").on(t.customerId, t.createdAt),
      index("sales_orders_status_created_idx").on(t.status, t.createdAt),
      check("sales_orders_subtotal_check", sql`${t.subtotal} >= 0`),
      check("sales_orders_discount_check", sql`${t.discountAmount} >= 0`),
      check("sales_orders_tax_check", sql`${t.taxAmount} >= 0`),
      check("sales_orders_delivery_check", sql`${t.deliveryFee} >= 0`),
      check("sales_orders_total_check", sql`${t.totalAmount} >= 0`),
      check(
         "sales_orders_currency_check",
         sql`${t.currency} ~ '^[A-Z]{3}$'`,
      ),
   ],
);

export const salesOrderItems = pgTable(
   "sales_order_items",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      orderId: uuid("order_id")
         .notNull()
         .references(() => salesOrders.id, { onDelete: "restrict" }),
      listingId: uuid("listing_id").references(() => saleListings.id, {
         onDelete: "set null",
      }),
      vehicleId: uuid("vehicle_id")
         .notNull()
         .references(() => vehicles.id, { onDelete: "restrict" }),
      vehicleTitle: varchar("vehicle_title", { length: 255 }).notNull(),
      stockNumber: varchar("stock_number", { length: 50 }).notNull(),
      quantity: integer("quantity").notNull().default(1),
      unitPrice: numeric("unit_price", { precision: 14, scale: 2 }).notNull(),
      discountAmount: numeric("discount_amount", {
         precision: 14,
         scale: 2,
      }).notNull().default("0"),
      lineTotal: numeric("line_total", { precision: 14, scale: 2 }).notNull(),
      createdAt: timestamp("created_at", { withTimezone: true })
         .notNull()
         .defaultNow(),
   },
   (t) => [
      index("sales_order_items_order_idx").on(t.orderId),
      index("sales_order_items_vehicle_idx").on(t.vehicleId),
      check("sales_order_items_quantity_check", sql`${t.quantity} > 0`),
      check("sales_order_items_unit_price_check", sql`${t.unitPrice} >= 0`),
      check(
         "sales_order_items_discount_check",
         sql`${t.discountAmount} >= 0`,
      ),
      check("sales_order_items_line_total_check", sql`${t.lineTotal} >= 0`),
   ],
);

export const salesDeliveries = pgTable(
   "sales_deliveries",
   {
      id: uuid("id").primaryKey().defaultRandom(),
      orderId: uuid("order_id")
         .notNull()
         .references(() => salesOrders.id, { onDelete: "restrict" }),
      addressId: uuid("address_id"),
      recipientName: varchar("recipient_name", { length: 200 }).notNull(),
      recipientPhone: varchar("recipient_phone", { length: 32 }),
      addressLine1: varchar("address_line_1", { length: 255 }).notNull(),
      addressLine2: varchar("address_line_2", { length: 255 }),
      city: varchar("city", { length: 100 }).notNull(),
      state: varchar("state", { length: 100 }).notNull(),
      countryCode: varchar("country_code", { length: 2 })
         .notNull()
         .default("NG"),
      trackingReference: varchar("tracking_reference", { length: 100 }),
      deliveredAt: timestamp("delivered_at", { withTimezone: true }),
      createdAt: timestamp("created_at", { withTimezone: true })
         .notNull()
         .defaultNow(),
   },
   (t) => [
      index("sales_deliveries_order_idx").on(t.orderId),
      uniqueIndex("sales_deliveries_tracking_unique").on(t.trackingReference),
   ],
);