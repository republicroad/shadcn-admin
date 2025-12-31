import { pgTable, unique, varchar, timestamp, integer, index, text, serial, json } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const brdeList = pgTable("brde_list", {
	id: varchar().primaryKey().notNull(),
	userId: varchar("user_id").notNull(),
	listName: varchar("list_name").notNull(),
	createTime: timestamp("create_time", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updateTime: timestamp("update_time", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	deleteTs: integer("delete_ts").default(0).notNull(),
}, (table) => [
	unique("brde_list_user_id_list_name_delete_ts_key").on(table.userId, table.listName, table.deleteTs),
]);

export const brdeProj = pgTable("brde_proj", {
	id: varchar().primaryKey().notNull(),
	projName: varchar("proj_name").notNull(),
	userId: varchar("user_id").notNull(),
	createTime: timestamp("create_time", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updateTime: timestamp("update_time", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const brdeRule = pgTable("brde_rule", {
	id: varchar().primaryKey().notNull(),
	projId: varchar("proj_id").notNull(),
	ruleDesc: varchar("rule_desc").notNull(),
	ruleName: varchar("rule_name").notNull(),
	createTime: timestamp("create_time", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updateTime: timestamp("update_time", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	ruleGraph: text("rule_graph").notNull(),
	ruleStatus: varchar("rule_status").default('close').notNull(),
	userId: varchar("user_id"),
}, (table) => [
	index("idx_brde_rule_proj_id_rule_status").using("btree", table.projId.asc().nullsLast().op("text_ops"), table.ruleStatus.asc().nullsLast().op("text_ops")),
]);

export const brdeUser = pgTable("brde_user", {
	id: varchar().primaryKey().notNull(),
	userKey: varchar("user_key").notNull(),
	username: varchar().notNull(),
	password: varchar().notNull().default(''),
	hashedPassword: varchar("hashed_password").notNull(),
	salt: varchar().notNull(),
	createTime: timestamp("create_time", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updateTime: timestamp("update_time", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("brde_user_username_key").on(table.username),
]);

export const operationLog = pgTable("operation_log", {
	id: serial().primaryKey().notNull(),
	opTime: timestamp("op_time", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: varchar("user_id").notNull(),
	opType: varchar("op_type").notNull(),
	opInfo: varchar("op_info").notNull(),
});

export const runLog = pgTable("run_log", {
	id: varchar().primaryKey().notNull(),
	eventTime: timestamp("event_time", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	eventDay: varchar("event_day").notNull(),
	eventHour: varchar("event_hour").notNull(),
	userId: varchar("user_id").notNull(),
	projId: varchar("proj_id").notNull(),
	input: json().notNull(),
	output: json().notNull(),
	shadowOutput: json("shadow_output").notNull(),
});

export const notifyDingtalk = pgTable("notify_dingtalk", {
	id: serial().primaryKey().notNull(),
	userId: varchar("user_id").notNull(),
	dingtalkName: varchar("dingtalk_name").notNull(),
	dingtalkUrl: varchar("dingtalk_url").notNull(),
	key: varchar().notNull(),
	tag: varchar(),
	createTime: timestamp("create_time", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updateTime: timestamp("update_time", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("notify_dingtalk_user_id_dingtalk_name_key").on(table.userId, table.dingtalkName),
]);

export const listData = pgTable("list_data", {
	id: serial().primaryKey().notNull(),
	listId: varchar("list_id").notNull(),
	value: varchar().notNull(),
	tag: varchar(),
	startTime: timestamp("start_time", { withTimezone: true, mode: 'string' }),
	endTime: timestamp("end_time", { withTimezone: true, mode: 'string' }),
	createTime: timestamp("create_time", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updateTime: timestamp("update_time", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	listName: varchar("list_name").notNull(),
	userId: varchar("user_id").notNull(),
	ttl: integer(),
}, (table) => [
	unique("list_data_list_id_value_key").on(table.listId, table.value),
]);

export const notifyEmail = pgTable("notify_email", {
	id: serial().primaryKey().notNull(),
	userId: varchar("user_id").notNull(),
	emailName: varchar("email_name").notNull(),
	email: varchar().notNull(),
	tag: varchar(),
	createTime: timestamp("create_time", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updateTime: timestamp("update_time", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("notify_email_user_id_email_name_key").on(table.userId, table.emailName),
]);

export const notifyFeishu = pgTable("notify_feishu", {
	id: serial().primaryKey().notNull(),
	userId: varchar("user_id").notNull(),
	feishuName: varchar("feishu_name").notNull(),
	feishuUrl: varchar("feishu_url").notNull(),
	key: varchar().notNull(),
	tag: varchar(),
	createTime: timestamp("create_time", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updateTime: timestamp("update_time", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("notify_feishu_user_id_feishu_name_key").on(table.userId, table.feishuName),
]);

export const notifyWebhook = pgTable("notify_webhook", {
	id: serial().primaryKey().notNull(),
	userId: varchar("user_id").notNull(),
	webhookName: varchar("webhook_name").notNull(),
	webhookUrl: varchar("webhook_url").notNull(),
	secretKey: varchar("secret_key"),
	secretValue: varchar("secret_value"),
	tag: varchar(),
	createTime: timestamp("create_time", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updateTime: timestamp("update_time", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("notify_webhook_user_id_webhook_name_key").on(table.userId, table.webhookName),
]);

export const gpFlowAggLists = pgTable("gp_flow_agg_lists", {
	id: varchar().primaryKey().notNull(),
	userId: varchar("user_id").notNull(),
	projId: varchar("proj_id").notNull(),
	name: varchar().notNull(),
	scene: varchar().notNull(),
	sinkTableName: varchar("sink_table_name").notNull(),
	gpFlowName: varchar("gp_flow_name").notNull(),
	sinkTtl: varchar("sink_ttl").notNull(),
	aggField: json("agg_field").notNull(),
	aggTime: varchar("agg_time").notNull(),
	sourceTableName: varchar("source_table_name").notNull(),
	createTime: timestamp("create_time", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	isDelete: integer("is_delete").default(0).notNull(),
});

export const sharedCounter = pgTable("shared_counter", {
	id: serial().primaryKey().notNull(),
	userId: varchar("user_id").notNull(),
	counterName: varchar("counter_name").notNull(),
	counterType: varchar("counter_type").notNull(),
	counterTime: varchar("counter_time").notNull(),
	counterFunc: varchar("counter_func").notNull(),
	createTime: timestamp("create_time", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updateTime: timestamp("update_time", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("shared_counter_user_id_counter_name_key").on(table.userId, table.counterName),
]);
