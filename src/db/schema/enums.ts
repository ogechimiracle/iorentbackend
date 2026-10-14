import { pgEnum } from "drizzle-orm/pg-core";

export const userStatusEnum = pgEnum("user_status", [
   "active",
   "inactive",
   "suspended",
]);

export const userRoleEnum = pgEnum("user_role", [
   "user",
   "staff",
   "manager",
   "admin",
   "super_admin",
]);

export const vehicleConditionEnum = pgEnum("vehicle_condition", [
   "new",
   "used",
   "certified_pre_owned",
]);

export const vehicleOperationalStatusEnum = pgEnum(
   "vehicle_operational_status",
   [
      "available",
      "reserved",
      "rented",
      "sold",
      "maintenance",
      "inactive",
   ],
);

export const vehicleOwnershipTypeEnum = pgEnum("vehicle_ownership_type", [
   "company_owned",
   "third_party",
]);

export const listingStatusEnum = pgEnum("listing_status", [
   "draft",
   "published",
   "paused",
   "reserved",
   "completed",
   "archived",
]);

export const salesOrderStatusEnum = pgEnum("sales_order_status", [
   "pending",
   "confirmed",
   "awaiting_payment",
   "paid",
   "processing",
   "completed",
   "cancelled",
   "refunded",
]);

export const rentalBookingStatusEnum = pgEnum("rental_booking_status", [
   "pending",
   "confirmed",
   "awaiting_payment",
   "paid",
   "ready_for_pickup",
   "active",
   "completed",
   "cancelled",
   "no_show",
]);

export const rentalTypeEnum = pgEnum("rental_type", [
   "self_drive",
   "chauffeur",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
   "card",
   "bank_transfer",
   "ussd",
   "cash",
   "pos",
   "cheque",
   "wallet",
   "other",
]);

export const paymentProviderEnum = pgEnum("payment_provider", [
   "paystack",
   "flutterwave",
   "stripe",
   "bank",
   "manual",
   "wallet",
   "other",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
   "pending",
   "processing",
   "successful",
   "failed",
   "cancelled",
   "reversed",
]);

export const refundStatusEnum = pgEnum("refund_status", [
   "pending",
   "processing",
   "successful",
   "failed",
   "cancelled",
]);

export const documentStatusEnum = pgEnum("document_status", [
   "pending",
   "verified",
   "rejected",
   "expired",
]);

export const maintenanceStatusEnum = pgEnum("maintenance_status", [
   "scheduled",
   "in_progress",
   "completed",
   "cancelled",
]);

export const inspectionTypeEnum = pgEnum("inspection_type", [
   "pickup",
   "return",
   "maintenance",
   "sale",
]);

export const inspectionStatusEnum = pgEnum("inspection_status", [
   "pending",
   "passed",
   "failed",
   "requires_attention",
]);

export const notificationChannelEnum = pgEnum("notification_channel", [
   "email",
   "sms",
   "in_app",
]);