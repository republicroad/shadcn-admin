
import { type CounterType } from './schema'

export const callTypes = new Map<CounterType, string>([
  ['rate', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['group_distinct', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
])

export const counter_times = [
  {
    value: '10s',
    label: '10秒',
  },
  {
    value: '1m',
    label: '1分钟',
  },
  {
    value: '5m',
    label: '5分钟',
  },
  {
    value: '1h',
    label: '1小时',
  },
  {
    value: '1d',
    label: '1天',
  },
  {
    value: '7d',
    label: '7天',
  },
]

export const counter_types = [
  {
    value: 'rate',
    label: '计数',
  },
  {
    value: 'group_distinct',
    label: '去重计数',
  },
]
