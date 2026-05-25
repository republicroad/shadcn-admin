export type NotificationChannel = 'email' | 'feishu' | 'dingtalk' | 'webhook'

export const notificationChannels: {
  value: NotificationChannel
  label: string
  description: string
}[] = [
  {
    value: 'email',
    label: '邮箱',
    description: '管理邮件通知接收人和标签配置。',
  },
  {
    value: 'feishu',
    label: '飞书',
    description: '管理飞书机器人通知配置与密钥信息。',
  },
  {
    value: 'dingtalk',
    label: '钉钉',
    description: '管理钉钉机器人通知配置与密钥信息。',
  },
  {
    value: 'webhook',
    label: 'Webhook',
    description: '管理通用 Webhook 地址与 Header 鉴权配置。',
  },
]
