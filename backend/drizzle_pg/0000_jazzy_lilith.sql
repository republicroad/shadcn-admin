-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "brde_list" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"list_name" varchar NOT NULL,
	"create_time" timestamp with time zone DEFAULT now() NOT NULL,
	"update_time" timestamp with time zone DEFAULT now() NOT NULL,
	"delete_ts" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "brde_list_user_id_list_name_delete_ts_key" UNIQUE("user_id","list_name","delete_ts")
);
--> statement-breakpoint
CREATE TABLE "brde_proj" (
	"id" varchar PRIMARY KEY NOT NULL,
	"proj_name" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"create_time" timestamp with time zone DEFAULT now() NOT NULL,
	"update_time" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "brde_rule" (
	"id" varchar PRIMARY KEY NOT NULL,
	"proj_id" varchar NOT NULL,
	"rule_desc" varchar NOT NULL,
	"rule_name" varchar NOT NULL,
	"create_time" timestamp with time zone DEFAULT now() NOT NULL,
	"update_time" timestamp with time zone DEFAULT now() NOT NULL,
	"rule_graph" text NOT NULL,
	"rule_status" varchar DEFAULT 'close' NOT NULL,
	"user_id" varchar
);
--> statement-breakpoint
CREATE TABLE "brde_user" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_key" varchar NOT NULL,
	"username" varchar NOT NULL,
	"hashed_password" varchar NOT NULL,
	"salt" varchar NOT NULL,
	"create_time" timestamp with time zone DEFAULT now() NOT NULL,
	"update_time" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "brde_user_username_key" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "operation_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"op_time" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" varchar NOT NULL,
	"op_type" varchar NOT NULL,
	"op_info" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "run_log" (
	"id" varchar PRIMARY KEY NOT NULL,
	"event_time" timestamp with time zone DEFAULT now() NOT NULL,
	"event_day" varchar NOT NULL,
	"event_hour" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"proj_id" varchar NOT NULL,
	"input" json NOT NULL,
	"output" json NOT NULL,
	"shadow_output" json NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notify_dingtalk" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"dingtalk_name" varchar NOT NULL,
	"dingtalk_url" varchar NOT NULL,
	"key" varchar NOT NULL,
	"tag" varchar,
	"create_time" timestamp with time zone DEFAULT now() NOT NULL,
	"update_time" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "notify_dingtalk_user_id_dingtalk_name_key" UNIQUE("user_id","dingtalk_name")
);
--> statement-breakpoint
CREATE TABLE "list_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"list_id" varchar NOT NULL,
	"value" varchar NOT NULL,
	"tag" varchar,
	"start_time" timestamp with time zone,
	"end_time" timestamp with time zone,
	"create_time" timestamp with time zone DEFAULT now() NOT NULL,
	"update_time" timestamp with time zone DEFAULT now() NOT NULL,
	"list_name" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"ttl" integer,
	CONSTRAINT "list_data_list_id_value_key" UNIQUE("list_id","value")
);
--> statement-breakpoint
CREATE TABLE "notify_email" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"email_name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"tag" varchar,
	"create_time" timestamp with time zone DEFAULT now() NOT NULL,
	"update_time" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "notify_email_user_id_email_name_key" UNIQUE("user_id","email_name")
);
--> statement-breakpoint
CREATE TABLE "notify_feishu" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"feishu_name" varchar NOT NULL,
	"feishu_url" varchar NOT NULL,
	"key" varchar NOT NULL,
	"tag" varchar,
	"create_time" timestamp with time zone DEFAULT now() NOT NULL,
	"update_time" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "notify_feishu_user_id_feishu_name_key" UNIQUE("user_id","feishu_name")
);
--> statement-breakpoint
CREATE TABLE "notify_webhook" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"webhook_name" varchar NOT NULL,
	"webhook_url" varchar NOT NULL,
	"secret_key" varchar,
	"secret_value" varchar,
	"tag" varchar,
	"create_time" timestamp with time zone DEFAULT now() NOT NULL,
	"update_time" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "notify_webhook_user_id_webhook_name_key" UNIQUE("user_id","webhook_name")
);
--> statement-breakpoint
CREATE TABLE "gp_flow_agg_lists" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"proj_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"scene" varchar NOT NULL,
	"sink_table_name" varchar NOT NULL,
	"gp_flow_name" varchar NOT NULL,
	"sink_ttl" varchar NOT NULL,
	"agg_field" json NOT NULL,
	"agg_time" varchar NOT NULL,
	"source_table_name" varchar NOT NULL,
	"create_time" timestamp with time zone DEFAULT now() NOT NULL,
	"is_delete" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shared_counter" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"counter_name" varchar NOT NULL,
	"counter_type" varchar NOT NULL,
	"counter_time" varchar NOT NULL,
	"counter_func" varchar NOT NULL,
	"create_time" timestamp with time zone DEFAULT now() NOT NULL,
	"update_time" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "shared_counter_user_id_counter_name_key" UNIQUE("user_id","counter_name")
);
--> statement-breakpoint
CREATE INDEX "idx_brde_rule_proj_id_rule_status" ON "brde_rule" USING btree ("proj_id" text_ops,"rule_status" text_ops);
*/