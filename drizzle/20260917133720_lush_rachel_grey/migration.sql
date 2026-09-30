CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(100) NOT NULL,
	"email" varchar(150) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	"role" varchar(50) DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
