import { type Conversation } from './chat-types'

export const mockConversations: Conversation[] = [
  {
    id: '1',
    title: 'React 性能优化技巧',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    updatedAt: Date.now() - 1000 * 60 * 60 * 2,
    messages: [
      {
        id: '1-1',
        role: 'user',
        content: '如何优化 React 应用的性能？',
        timestamp: Date.now() - 1000 * 60 * 60 * 2,
      },
      {
        id: '1-2',
        role: 'assistant',
        content:
          '优化 React 应用性能有以下几个常用方法：\n\n1. **使用 React.memo** 避免不必要的重渲染\n2. **使用 useMemo 和 useCallback** 缓存计算结果和函数引用\n3. **代码分割** 使用 React.lazy 和 Suspense 按需加载组件\n4. **虚拟列表** 对于长列表使用 react-window 或 react-virtual\n5. **避免匿名函数** 在 JSX 中避免使用内联匿名函数',
        timestamp: Date.now() - 1000 * 60 * 60 * 2 + 1000,
      },
    ],
  },
  {
    id: '2',
    title: 'TypeScript 泛型使用',
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    updatedAt: Date.now() - 1000 * 60 * 30,
    messages: [
      {
        id: '2-1',
        role: 'user',
        content: '能解释一下 TypeScript 泛型的使用场景吗？',
        timestamp: Date.now() - 1000 * 60 * 30,
      },
      {
        id: '2-2',
        role: 'assistant',
        content:
          'TypeScript 泛型是一种强大的工具，允许你编写可重用的类型安全代码。\n\n常见使用场景：\n\n```typescript\n// 1. 泛型函数\nfunction identity<T>(arg: T): T {\n  return arg\n}\n\n// 2. 泛型接口\ninterface ApiResponse<T> {\n  data: T\n  status: number\n  message: string\n}\n\n// 3. 泛型约束\nfunction getProperty<T, K extends keyof T>(obj: T, key: K) {\n  return obj[key]\n}\n```',
        timestamp: Date.now() - 1000 * 60 * 30 + 1000,
      },
    ],
  },
  {
    id: '3',
    title: 'CSS Grid 布局',
    createdAt: Date.now() - 1000 * 60 * 10,
    updatedAt: Date.now() - 1000 * 60 * 5,
    messages: [
      {
        id: '3-1',
        role: 'user',
        content: 'CSS Grid 和 Flexbox 有什么区别？',
        timestamp: Date.now() - 1000 * 60 * 5,
      },
      {
        id: '3-2',
        role: 'assistant',
        content:
          'CSS Grid 和 Flexbox 都是现代布局工具，但适用场景不同：\n\n**Flexbox（一维布局）**\n- 适合单行或单列的布局\n- 适合组件内部的对齐\n- 例如：导航栏、按钮组\n\n**Grid（二维布局）**\n- 适合同时控制行和列\n- 适合整体页面布局\n- 例如：仪表盘、图片画廊\n\n简单记忆：Flexbox 管一个方向，Grid 管两个方向。',
        timestamp: Date.now() - 1000 * 60 * 5 + 1000,
      },
    ],
  },
]
