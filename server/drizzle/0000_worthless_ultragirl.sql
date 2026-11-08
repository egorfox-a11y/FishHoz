CREATE TABLE "catches" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "catches_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"pond_id" bigint NOT NULL,
	"species" text NOT NULL,
	"quantity" integer NOT NULL,
	"total_weight" numeric,
	"purpose" text,
	"caught_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feedings" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "feedings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"pond_id" bigint NOT NULL,
	"amount" numeric NOT NULL,
	"feed_type" text,
	"fed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fish_batches" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "fish_batches_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"pond_id" bigint NOT NULL,
	"species_id" bigint,
	"quantity" integer NOT NULL,
	"avg_weight" numeric,
	"launch_date" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fish_species" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "fish_species_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"description" text,
	"optimal_temp_min" numeric,
	"optimal_temp_max" numeric,
	"feed_rate" numeric,
	"growth_rate" numeric,
	"maturity_months" integer
);
--> statement-breakpoint
CREATE TABLE "ponds" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ponds_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"area" numeric,
	"depth" numeric,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "reports_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"pond_id" bigint,
	"period" text NOT NULL,
	"type" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "transactions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"catch_id" bigint,
	"type" text NOT NULL,
	"category" text NOT NULL,
	"amount" numeric NOT NULL,
	"transaction_date" date NOT NULL,
	"comment" text
);
--> statement-breakpoint
ALTER TABLE "catches" ADD CONSTRAINT "catches_pond_id_ponds_id_fk" FOREIGN KEY ("pond_id") REFERENCES "public"."ponds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedings" ADD CONSTRAINT "feedings_pond_id_ponds_id_fk" FOREIGN KEY ("pond_id") REFERENCES "public"."ponds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fish_batches" ADD CONSTRAINT "fish_batches_pond_id_ponds_id_fk" FOREIGN KEY ("pond_id") REFERENCES "public"."ponds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fish_batches" ADD CONSTRAINT "fish_batches_species_id_fish_species_id_fk" FOREIGN KEY ("species_id") REFERENCES "public"."fish_species"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_pond_id_ponds_id_fk" FOREIGN KEY ("pond_id") REFERENCES "public"."ponds"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_catch_id_catches_id_fk" FOREIGN KEY ("catch_id") REFERENCES "public"."catches"("id") ON DELETE set null ON UPDATE no action;