import { type Dingtalk, type Email, type Feishu, type Webhook } from './schema'

export type NotificationRow = Email | Feishu | Dingtalk | Webhook

export function isEmailRow(row: NotificationRow | null): row is Email {
  return !!row && 'email_name' in row && 'email' in row
}

export function isFeishuRow(row: NotificationRow | null): row is Feishu {
  return !!row && 'feishu_name' in row && 'feishu_url' in row
}

export function isDingtalkRow(row: NotificationRow | null): row is Dingtalk {
  return !!row && 'dingtalk_name' in row && 'dingtalk_url' in row
}

export function isWebhookRow(row: NotificationRow | null): row is Webhook {
  return !!row && 'webhook_name' in row && 'webhook_url' in row
}
