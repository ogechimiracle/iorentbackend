CREATE TYPE "document_status" AS ENUM('pending', 'verified', 'rejected', 'expired');--> statement-breakpoint
CREATE TYPE "inspection_status" AS ENUM('pending', 'passed', 'failed', 'requires_attention');--> statement-breakpoint
CREATE TYPE "inspection_type" AS ENUM('pickup', 'return', 'maintenance', 'sale');--> statement-breakpoint
CREATE TYPE "listing_status" AS ENUM('draft', 'published', 'paused', 'reserved', 'completed', 'archived');--> statement-breakpoint
CREATE TYPE "maintenance_status" AS ENUM('scheduled', 'in_progress', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "notification_channel" AS ENUM('email', 'sms', 'in_app');--> statement-breakpoint
CREATE TYPE "payment_method" AS ENUM('card', 'bank_transfer', 'ussd', 'cash', 'pos', 'cheque', 'wallet', 'other');--> statement-breakpoint
CREATE TYPE "payment_provider" AS ENUM('paystack', 'flutterwave', 'stripe', 'bank', 'manual', 'wallet', 'other');--> statement-breakpoint
CREATE TYPE "payment_status" AS ENUM('pending', 'processing', 'successful', 'failed', 'cancelled', 'reversed');--> statement-breakpoint
CREATE TYPE "refund_status" AS ENUM('pending', 'processing', 'successful', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "rental_booking_status" AS ENUM('pending', 'confirmed', 'awaiting_payment', 'paid', 'ready_for_pickup', 'active', 'completed', 'cancelled', 'no_show');--> statement-breakpoint
CREATE TYPE "rental_type" AS ENUM('self_drive', 'chauffeur');--> statement-breakpoint
CREATE TYPE "sales_order_status" AS ENUM('pending', 'confirmed', 'awaiting_payment', 'paid', 'processing', 'completed', 'cancelled', 'refunded');--> statement-breakpoint
CREATE TYPE "user_role" AS ENUM('user', 'staff', 'manager', 'admin', 'super_admin');--> statement-breakpoint
CREATE TYPE "user_status" AS ENUM('active', 'inactive', 'suspended');--> statement-breakpoint
CREATE TYPE "vehicle_condition" AS ENUM('new', 'used', 'certified_pre_owned');--> statement-breakpoint
CREATE TYPE "vehicle_operational_status" AS ENUM('available', 'reserved', 'rented', 'sold', 'maintenance', 'inactive');--> statement-breakpoint
CREATE TYPE "vehicle_ownership_type" AS ENUM('company_owned', 'third_party');--> statement-breakpoint
CREATE TABLE "customer_addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"customer_id" uuid NOT NULL,
	"label" varchar(50),
	"recipient_name" varchar(200) NOT NULL,
	"phone" varchar(32),
	"address_line_1" varchar(255) NOT NULL,
	"address_line_2" varchar(255),
	"city" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"country_code" varchar(2) DEFAULT 'NG' NOT NULL,
	"postal_code" varchar(20),
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"customer_id" uuid NOT NULL,
	"document_type" varchar(80) NOT NULL,
	"storage_key" text NOT NULL,
	"status" "document_status" DEFAULT 'pending'::"document_status" NOT NULL,
	"verified_by" uuid,
	"verified_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL UNIQUE,
	"date_of_birth" timestamp,
	"company_name" varchar(200),
	"tax_id" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicle_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(100) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "vehicle_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"vehicle_id" uuid NOT NULL,
	"document_type" varchar(80) NOT NULL,
	"storage_key" text NOT NULL,
	"document_number" varchar(100),
	"expires_at" timestamp with time zone,
	"verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicle_feature_assignments" (
	"vehicle_id" uuid NOT NULL,
	"feature_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicle_features" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(100) NOT NULL,
	"slug" varchar(120) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicle_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"vehicle_id" uuid NOT NULL,
	"storage_key" text NOT NULL,
	"alt_text" varchar(255),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicle_makes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(100) NOT NULL,
	"slug" varchar(120) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicle_models" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"make_id" uuid NOT NULL,
	"name" varchar(120) NOT NULL,
	"slug" varchar(140) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"stock_number" varchar(50) NOT NULL,
	"make_id" uuid NOT NULL,
	"model_id" uuid NOT NULL,
	"category_id" uuid,
	"ownership_type" "vehicle_ownership_type" DEFAULT 'company_owned'::"vehicle_ownership_type" NOT NULL,
	"owner_user_id" uuid,
	"condition" "vehicle_condition" NOT NULL,
	"operational_status" "vehicle_operational_status" DEFAULT 'available'::"vehicle_operational_status" NOT NULL,
	"year" integer NOT NULL,
	"vin" varchar(50),
	"registration_number" varchar(50),
	"transmission" varchar(30),
	"fuel_type" varchar(30),
	"mileage_km" integer DEFAULT 0 NOT NULL,
	"color" varchar(50),
	"seats" integer DEFAULT 5 NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vehicles_year_check" CHECK ("year" BETWEEN 1886 AND 2200),
	CONSTRAINT "vehicles_mileage_check" CHECK ("mileage_km" >= 0),
	CONSTRAINT "vehicles_seats_check" CHECK ("seats" BETWEEN 1 AND 100),
	CONSTRAINT "vehicles_owner_type_check" CHECK (("ownership_type" = 'company_owned' AND "owner_user_id" IS NULL)
       OR ("ownership_type" = 'third_party' AND "owner_user_id" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "rental_listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"vehicle_id" uuid NOT NULL,
	"slug" varchar(180) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"rental_type" "rental_type" NOT NULL,
	"daily_rate" numeric(14,2) NOT NULL,
	"weekly_rate" numeric(14,2),
	"monthly_rate" numeric(14,2),
	"security_deposit" numeric(14,2) DEFAULT '0' NOT NULL,
	"currency" varchar(3) DEFAULT 'NGN' NOT NULL,
	"pickup_instructions" text,
	"minimum_rental_days" integer DEFAULT 1 NOT NULL,
	"maximum_rental_days" integer,
	"status" "listing_status" DEFAULT 'draft'::"listing_status" NOT NULL,
	"published_at" timestamp with time zone,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rental_listings_daily_rate_check" CHECK ("daily_rate" >= 0),
	CONSTRAINT "rental_listings_deposit_check" CHECK ("security_deposit" >= 0),
	CONSTRAINT "rental_listings_weekly_rate_check" CHECK ("weekly_rate" IS NULL OR "weekly_rate" >= 0),
	CONSTRAINT "rental_listings_monthly_rate_check" CHECK ("monthly_rate" IS NULL OR "monthly_rate" >= 0),
	CONSTRAINT "rental_listings_days_check" CHECK ("minimum_rental_days" >= 1 AND
          ("maximum_rental_days" IS NULL OR
           "maximum_rental_days" >= "minimum_rental_days")),
	CONSTRAINT "rental_listings_currency_check" CHECK ("currency" ~ '^[A-Z]{3}$')
);
--> statement-breakpoint
CREATE TABLE "sale_listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"vehicle_id" uuid NOT NULL,
	"slug" varchar(180) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"asking_price" numeric(14,2) NOT NULL,
	"currency" varchar(3) DEFAULT 'NGN' NOT NULL,
	"status" "listing_status" DEFAULT 'draft'::"listing_status" NOT NULL,
	"published_at" timestamp with time zone,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sale_listings_price_check" CHECK ("asking_price" >= 0),
	CONSTRAINT "sale_listings_currency_check" CHECK ("currency" ~ '^[A-Z]{3}$')
);
--> statement-breakpoint
CREATE TABLE "sales_deliveries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"order_id" uuid NOT NULL,
	"address_id" uuid,
	"recipient_name" varchar(200) NOT NULL,
	"recipient_phone" varchar(32),
	"address_line_1" varchar(255) NOT NULL,
	"address_line_2" varchar(255),
	"city" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"country_code" varchar(2) DEFAULT 'NG' NOT NULL,
	"tracking_reference" varchar(100),
	"delivered_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales_order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"order_id" uuid NOT NULL,
	"listing_id" uuid,
	"vehicle_id" uuid NOT NULL,
	"vehicle_title" varchar(255) NOT NULL,
	"stock_number" varchar(50) NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_price" numeric(14,2) NOT NULL,
	"discount_amount" numeric(14,2) DEFAULT '0' NOT NULL,
	"line_total" numeric(14,2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sales_order_items_quantity_check" CHECK ("quantity" > 0),
	CONSTRAINT "sales_order_items_unit_price_check" CHECK ("unit_price" >= 0),
	CONSTRAINT "sales_order_items_discount_check" CHECK ("discount_amount" >= 0),
	CONSTRAINT "sales_order_items_line_total_check" CHECK ("line_total" >= 0)
);
--> statement-breakpoint
CREATE TABLE "sales_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"order_number" varchar(40) NOT NULL,
	"customer_id" uuid NOT NULL,
	"status" "sales_order_status" DEFAULT 'pending'::"sales_order_status" NOT NULL,
	"currency" varchar(3) DEFAULT 'NGN' NOT NULL,
	"subtotal" numeric(14,2) NOT NULL,
	"discount_amount" numeric(14,2) DEFAULT '0' NOT NULL,
	"tax_amount" numeric(14,2) DEFAULT '0' NOT NULL,
	"delivery_fee" numeric(14,2) DEFAULT '0' NOT NULL,
	"total_amount" numeric(14,2) NOT NULL,
	"customer_note" text,
	"created_by" uuid,
	"confirmed_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sales_orders_subtotal_check" CHECK ("subtotal" >= 0),
	CONSTRAINT "sales_orders_discount_check" CHECK ("discount_amount" >= 0),
	CONSTRAINT "sales_orders_tax_check" CHECK ("tax_amount" >= 0),
	CONSTRAINT "sales_orders_delivery_check" CHECK ("delivery_fee" >= 0),
	CONSTRAINT "sales_orders_total_check" CHECK ("total_amount" >= 0),
	CONSTRAINT "sales_orders_currency_check" CHECK ("currency" ~ '^[A-Z]{3}$')
);
--> statement-breakpoint
CREATE TABLE "rental_agreements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"booking_id" uuid NOT NULL,
	"agreement_number" varchar(50) NOT NULL,
	"storage_key" text,
	"terms_version" varchar(40) NOT NULL,
	"customer_accepted_at" timestamp with time zone,
	"customer_signature_storage_key" text,
	"staff_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rental_bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"booking_number" varchar(40) NOT NULL,
	"customer_id" uuid NOT NULL,
	"listing_id" uuid,
	"vehicle_id" uuid NOT NULL,
	"rental_type" "rental_type" NOT NULL,
	"status" "rental_booking_status" DEFAULT 'pending'::"rental_booking_status" NOT NULL,
	"currency" varchar(3) DEFAULT 'NGN' NOT NULL,
	"pickup_at" timestamp with time zone NOT NULL,
	"return_at" timestamp with time zone NOT NULL,
	"actual_pickup_at" timestamp with time zone,
	"actual_return_at" timestamp with time zone,
	"pickup_location" text NOT NULL,
	"return_location" text NOT NULL,
	"daily_rate" numeric(14,2) NOT NULL,
	"rental_days" integer NOT NULL,
	"rental_amount" numeric(14,2) NOT NULL,
	"security_deposit" numeric(14,2) DEFAULT '0' NOT NULL,
	"discount_amount" numeric(14,2) DEFAULT '0' NOT NULL,
	"extra_charges" numeric(14,2) DEFAULT '0' NOT NULL,
	"total_amount" numeric(14,2) NOT NULL,
	"driver_name" varchar(200),
	"driver_phone" varchar(32),
	"driver_license_document_id" uuid,
	"customer_note" text,
	"confirmed_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rental_bookings_period_check" CHECK ("return_at" > "pickup_at"),
	CONSTRAINT "rental_bookings_days_check" CHECK ("rental_days" > 0),
	CONSTRAINT "rental_bookings_rate_check" CHECK ("daily_rate" >= 0),
	CONSTRAINT "rental_bookings_amount_check" CHECK (
      "rental_amount" >= 0 AND
      "security_deposit" >= 0 AND
      "discount_amount" >= 0 AND
      "extra_charges" >= 0 AND
      "total_amount" >= 0
    ),
	CONSTRAINT "rental_bookings_currency_check" CHECK ("currency" ~ '^[A-Z]{3}$'),
	CONSTRAINT "rental_bookings_driver_check" CHECK (("rental_type" = 'self_drive')
       OR ("rental_type" = 'chauffeur' AND
           "driver_name" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "rental_inspection_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"inspection_id" uuid NOT NULL,
	"storage_key" text NOT NULL,
	"caption" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rental_inspections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"booking_id" uuid NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"inspection_type" "inspection_type" NOT NULL,
	"status" "inspection_status" DEFAULT 'pending'::"inspection_status" NOT NULL,
	"odometer_km" integer,
	"fuel_level_percent" integer,
	"notes" text,
	"inspected_by" uuid,
	"inspected_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rental_inspections_odometer_check" CHECK ("odometer_km" IS NULL OR "odometer_km" >= 0),
	CONSTRAINT "rental_inspections_fuel_check" CHECK ("fuel_level_percent" IS NULL OR
          "fuel_level_percent" BETWEEN 0 AND 100)
);
--> statement-breakpoint
CREATE TABLE "payment_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"payment_id" uuid,
	"provider" "payment_provider" NOT NULL,
	"provider_event_id" varchar(200) NOT NULL,
	"event_type" varchar(100) NOT NULL,
	"payload" jsonb NOT NULL,
	"processed_at" timestamp with time zone,
	"processing_error" text,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"reference" varchar(100) NOT NULL,
	"idempotency_key" varchar(160),
	"sales_order_id" uuid,
	"rental_booking_id" uuid,
	"method" "payment_method" NOT NULL,
	"provider" "payment_provider" NOT NULL,
	"provider_reference" varchar(200),
	"status" "payment_status" DEFAULT 'pending'::"payment_status" NOT NULL,
	"amount" numeric(14,2) NOT NULL,
	"currency" varchar(3) DEFAULT 'NGN' NOT NULL,
	"paid_at" timestamp with time zone,
	"received_by" uuid,
	"offline_receipt_reference" varchar(150),
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payments_amount_check" CHECK ("amount" > 0),
	CONSTRAINT "payments_currency_check" CHECK ("currency" ~ '^[A-Z]{3}$'),
	CONSTRAINT "payments_one_target_check" CHECK ((
        ("sales_order_id" IS NOT NULL AND "rental_booking_id" IS NULL)
        OR
        ("sales_order_id" IS NULL AND "rental_booking_id" IS NOT NULL)
      )),
	CONSTRAINT "payments_offline_receipt_check" CHECK (("method" NOT IN ('cash', 'pos', 'cheque', 'bank_transfer')
        OR "provider" <> 'manual'
        OR "received_by" IS NOT NULL
        OR "offline_receipt_reference" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "refunds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"payment_id" uuid NOT NULL,
	"reference" varchar(100) NOT NULL,
	"provider_reference" varchar(200),
	"status" "refund_status" DEFAULT 'pending'::"refund_status" NOT NULL,
	"amount" numeric(14,2) NOT NULL,
	"reason" text,
	"processed_by" uuid,
	"processed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "refunds_amount_check" CHECK ("amount" > 0)
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"actor_user_id" uuid,
	"action" varchar(100) NOT NULL,
	"entity_type" varchar(100) NOT NULL,
	"entity_id" uuid,
	"request_id" varchar(100),
	"ip_address" varchar(64),
	"user_agent" text,
	"changes" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "maintenance_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"vehicle_id" uuid NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"service_provider" varchar(200),
	"status" "maintenance_status" DEFAULT 'scheduled'::"maintenance_status" NOT NULL,
	"scheduled_at" timestamp with time zone,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"odometer_km" integer,
	"cost" numeric(14,2) DEFAULT '0' NOT NULL,
	"currency" varchar(3) DEFAULT 'NGN' NOT NULL,
	"invoice_storage_key" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "maintenance_cost_check" CHECK ("cost" >= 0),
	CONSTRAINT "maintenance_odometer_check" CHECK ("odometer_km" IS NULL OR "odometer_km" >= 0),
	CONSTRAINT "maintenance_currency_check" CHECK ("currency" ~ '^[A-Z]{3}$')
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"channel" varchar(30) NOT NULL,
	"subject" varchar(255),
	"body" text NOT NULL,
	"metadata" jsonb,
	"sent_at" timestamp with time zone,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicle_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"vehicle_id" uuid NOT NULL,
	"previous_status" varchar(40),
	"new_status" varchar(40) NOT NULL,
	"reason" text,
	"changed_by" uuid,
	"changed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_email_key";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone" varchar(32);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password_hash" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "first_name" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_name" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "status" "user_status" DEFAULT 'active'::"user_status" NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_verified_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone_verified_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_login_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "password";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar(255) USING "email"::varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "user_role" USING "role"::"user_role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user'::"user_role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone USING "created_at"::timestamp with time zone;--> statement-breakpoint
CREATE INDEX "customer_addresses_customer_idx" ON "customer_addresses" ("customer_id");--> statement-breakpoint
CREATE INDEX "customer_documents_customer_status_idx" ON "customer_documents" ("customer_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "user_sessions_token_hash_unique" ON "user_sessions" ("token_hash");--> statement-breakpoint
CREATE INDEX "user_sessions_user_expiry_idx" ON "user_sessions" ("user_id","expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "users_phone_unique" ON "users" ("phone");--> statement-breakpoint
CREATE INDEX "users_role_status_idx" ON "users" ("role","status");--> statement-breakpoint
CREATE UNIQUE INDEX "vehicle_categories_name_unique" ON "vehicle_categories" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "vehicle_categories_slug_unique" ON "vehicle_categories" ("slug");--> statement-breakpoint
CREATE INDEX "vehicle_documents_vehicle_idx" ON "vehicle_documents" ("vehicle_id");--> statement-breakpoint
CREATE UNIQUE INDEX "vehicle_feature_assignments_pk" ON "vehicle_feature_assignments" ("vehicle_id","feature_id");--> statement-breakpoint
CREATE UNIQUE INDEX "vehicle_features_name_unique" ON "vehicle_features" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "vehicle_features_slug_unique" ON "vehicle_features" ("slug");--> statement-breakpoint
CREATE INDEX "vehicle_images_vehicle_order_idx" ON "vehicle_images" ("vehicle_id","sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "vehicle_images_one_primary_per_vehicle" ON "vehicle_images" ("vehicle_id") WHERE "is_primary" = true;--> statement-breakpoint
CREATE UNIQUE INDEX "vehicle_makes_name_unique" ON "vehicle_makes" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "vehicle_makes_slug_unique" ON "vehicle_makes" ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "vehicle_models_make_name_unique" ON "vehicle_models" ("make_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "vehicle_models_make_slug_unique" ON "vehicle_models" ("make_id","slug");--> statement-breakpoint
CREATE UNIQUE INDEX "vehicles_stock_number_unique" ON "vehicles" ("stock_number");--> statement-breakpoint
CREATE UNIQUE INDEX "vehicles_vin_unique" ON "vehicles" ("vin");--> statement-breakpoint
CREATE INDEX "vehicles_make_model_idx" ON "vehicles" ("make_id","model_id");--> statement-breakpoint
CREATE INDEX "vehicles_category_idx" ON "vehicles" ("category_id");--> statement-breakpoint
CREATE INDEX "vehicles_status_active_idx" ON "vehicles" ("operational_status","is_active");--> statement-breakpoint
CREATE INDEX "vehicles_ownership_idx" ON "vehicles" ("ownership_type","owner_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "rental_listings_slug_unique" ON "rental_listings" ("slug");--> statement-breakpoint
CREATE INDEX "rental_listings_status_rate_idx" ON "rental_listings" ("status","daily_rate");--> statement-breakpoint
CREATE INDEX "rental_listings_vehicle_status_idx" ON "rental_listings" ("vehicle_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "sale_listings_slug_unique" ON "sale_listings" ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "sale_listings_vehicle_unique" ON "sale_listings" ("vehicle_id");--> statement-breakpoint
CREATE INDEX "sale_listings_status_price_idx" ON "sale_listings" ("status","asking_price");--> statement-breakpoint
CREATE INDEX "sales_deliveries_order_idx" ON "sales_deliveries" ("order_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sales_deliveries_tracking_unique" ON "sales_deliveries" ("tracking_reference");--> statement-breakpoint
CREATE INDEX "sales_order_items_order_idx" ON "sales_order_items" ("order_id");--> statement-breakpoint
CREATE INDEX "sales_order_items_vehicle_idx" ON "sales_order_items" ("vehicle_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sales_orders_number_unique" ON "sales_orders" ("order_number");--> statement-breakpoint
CREATE INDEX "sales_orders_customer_created_idx" ON "sales_orders" ("customer_id","created_at");--> statement-breakpoint
CREATE INDEX "sales_orders_status_created_idx" ON "sales_orders" ("status","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "rental_agreements_booking_unique" ON "rental_agreements" ("booking_id");--> statement-breakpoint
CREATE UNIQUE INDEX "rental_agreements_number_unique" ON "rental_agreements" ("agreement_number");--> statement-breakpoint
CREATE UNIQUE INDEX "rental_bookings_number_unique" ON "rental_bookings" ("booking_number");--> statement-breakpoint
CREATE INDEX "rental_bookings_customer_created_idx" ON "rental_bookings" ("customer_id","created_at");--> statement-breakpoint
CREATE INDEX "rental_bookings_vehicle_period_idx" ON "rental_bookings" ("vehicle_id","pickup_at","return_at");--> statement-breakpoint
CREATE INDEX "rental_bookings_status_pickup_idx" ON "rental_bookings" ("status","pickup_at");--> statement-breakpoint
CREATE INDEX "rental_inspection_images_inspection_idx" ON "rental_inspection_images" ("inspection_id");--> statement-breakpoint
CREATE INDEX "rental_inspections_booking_idx" ON "rental_inspections" ("booking_id");--> statement-breakpoint
CREATE UNIQUE INDEX "payment_events_provider_event_unique" ON "payment_events" ("provider","provider_event_id");--> statement-breakpoint
CREATE INDEX "payment_events_unprocessed_idx" ON "payment_events" ("received_at");--> statement-breakpoint
CREATE UNIQUE INDEX "payments_reference_unique" ON "payments" ("reference");--> statement-breakpoint
CREATE UNIQUE INDEX "payments_idempotency_unique" ON "payments" ("idempotency_key");--> statement-breakpoint
CREATE UNIQUE INDEX "payments_provider_reference_unique" ON "payments" ("provider","provider_reference") WHERE "provider_reference" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "payments_sales_order_status_idx" ON "payments" ("sales_order_id","status");--> statement-breakpoint
CREATE INDEX "payments_rental_booking_status_idx" ON "payments" ("rental_booking_id","status");--> statement-breakpoint
CREATE INDEX "payments_created_at_idx" ON "payments" ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "refunds_reference_unique" ON "refunds" ("reference");--> statement-breakpoint
CREATE INDEX "refunds_payment_status_idx" ON "refunds" ("payment_id","status");--> statement-breakpoint
CREATE INDEX "audit_logs_actor_date_idx" ON "audit_logs" ("actor_user_id","created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs" ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "audit_logs_request_idx" ON "audit_logs" ("request_id");--> statement-breakpoint
CREATE INDEX "maintenance_vehicle_status_idx" ON "maintenance_records" ("vehicle_id","status");--> statement-breakpoint
CREATE INDEX "maintenance_scheduled_at_idx" ON "maintenance_records" ("scheduled_at");--> statement-breakpoint
CREATE INDEX "notifications_user_read_date_idx" ON "notifications" ("user_id","read_at","created_at");--> statement-breakpoint
CREATE INDEX "vehicle_status_history_vehicle_date_idx" ON "vehicle_status_history" ("vehicle_id","changed_at");--> statement-breakpoint
ALTER TABLE "customer_addresses" ADD CONSTRAINT "customer_addresses_customer_id_customer_profiles_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer_profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "customer_documents" ADD CONSTRAINT "customer_documents_customer_id_customer_profiles_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer_profiles"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "customer_documents" ADD CONSTRAINT "customer_documents_verified_by_users_id_fkey" FOREIGN KEY ("verified_by") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "customer_profiles" ADD CONSTRAINT "customer_profiles_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "vehicle_documents" ADD CONSTRAINT "vehicle_documents_vehicle_id_vehicles_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "vehicle_feature_assignments" ADD CONSTRAINT "vehicle_feature_assignments_vehicle_id_vehicles_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "vehicle_feature_assignments" ADD CONSTRAINT "vehicle_feature_assignments_feature_id_vehicle_features_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "vehicle_features"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "vehicle_images" ADD CONSTRAINT "vehicle_images_vehicle_id_vehicles_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "vehicle_models" ADD CONSTRAINT "vehicle_models_make_id_vehicle_makes_id_fkey" FOREIGN KEY ("make_id") REFERENCES "vehicle_makes"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_make_id_vehicle_makes_id_fkey" FOREIGN KEY ("make_id") REFERENCES "vehicle_makes"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_model_id_vehicle_models_id_fkey" FOREIGN KEY ("model_id") REFERENCES "vehicle_models"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_category_id_vehicle_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "vehicle_categories"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_owner_user_id_users_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_created_by_users_id_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "rental_listings" ADD CONSTRAINT "rental_listings_vehicle_id_vehicles_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "rental_listings" ADD CONSTRAINT "rental_listings_created_by_users_id_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "sale_listings" ADD CONSTRAINT "sale_listings_vehicle_id_vehicles_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "sale_listings" ADD CONSTRAINT "sale_listings_created_by_users_id_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "sales_deliveries" ADD CONSTRAINT "sales_deliveries_order_id_sales_orders_id_fkey" FOREIGN KEY ("order_id") REFERENCES "sales_orders"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "sales_order_items" ADD CONSTRAINT "sales_order_items_order_id_sales_orders_id_fkey" FOREIGN KEY ("order_id") REFERENCES "sales_orders"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "sales_order_items" ADD CONSTRAINT "sales_order_items_listing_id_sale_listings_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "sale_listings"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "sales_order_items" ADD CONSTRAINT "sales_order_items_vehicle_id_vehicles_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_customer_id_customer_profiles_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer_profiles"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_created_by_users_id_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "rental_agreements" ADD CONSTRAINT "rental_agreements_booking_id_rental_bookings_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "rental_bookings"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "rental_agreements" ADD CONSTRAINT "rental_agreements_staff_user_id_users_id_fkey" FOREIGN KEY ("staff_user_id") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "rental_bookings" ADD CONSTRAINT "rental_bookings_customer_id_customer_profiles_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer_profiles"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "rental_bookings" ADD CONSTRAINT "rental_bookings_listing_id_rental_listings_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "rental_listings"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "rental_bookings" ADD CONSTRAINT "rental_bookings_vehicle_id_vehicles_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "rental_bookings" ADD CONSTRAINT "rental_bookings_created_by_users_id_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "rental_inspection_images" ADD CONSTRAINT "rental_inspection_images_3fAhlzgtG4X8_fkey" FOREIGN KEY ("inspection_id") REFERENCES "rental_inspections"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "rental_inspections" ADD CONSTRAINT "rental_inspections_booking_id_rental_bookings_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "rental_bookings"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "rental_inspections" ADD CONSTRAINT "rental_inspections_vehicle_id_vehicles_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "rental_inspections" ADD CONSTRAINT "rental_inspections_inspected_by_users_id_fkey" FOREIGN KEY ("inspected_by") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "payment_events" ADD CONSTRAINT "payment_events_payment_id_payments_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_sales_order_id_sales_orders_id_fkey" FOREIGN KEY ("sales_order_id") REFERENCES "sales_orders"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_rental_booking_id_rental_bookings_id_fkey" FOREIGN KEY ("rental_booking_id") REFERENCES "rental_bookings"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_received_by_users_id_fkey" FOREIGN KEY ("received_by") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_payment_id_payments_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_processed_by_users_id_fkey" FOREIGN KEY ("processed_by") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_user_id_users_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_vehicle_id_vehicles_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_created_by_users_id_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "vehicle_status_history" ADD CONSTRAINT "vehicle_status_history_vehicle_id_vehicles_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "vehicle_status_history" ADD CONSTRAINT "vehicle_status_history_changed_by_users_id_fkey" FOREIGN KEY ("changed_by") REFERENCES "users"("id") ON DELETE SET NULL;