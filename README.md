
# brde web admin

基于 Shadcn Admin Dashboard 研发 brde web admin 项目. 使用 bun 进行项目管理.

## typescript


### null and undefined

[Beginner’s Guide: How to Check Null and Undefined in TypeScript](https://javascript.plainenglish.io/beginners-guide-how-to-check-null-and-undefined-in-typescript-c6492a07b609)


In TypeScript, when comparing a value to undefined, both the loose equality operator (==) and the strict equality operator (===) can be used, but they have different behaviors and implications:  

- Loose Equality (==):  

  The == operator performs type coercion before comparison. This means it attempts to convert the operands to a common type before checking their values.
When comparing undefined using ==, it will evaluate to true if the other operand is either null or undefined.
Example: null == undefined evaluates to true.

- Strict Equality (===):  

  The === operator performs a strict comparison, meaning it checks both the value and the type of the operands without any type coercion.
  When comparing undefined using ===, it will only evaluate to true if the other operand is exactly undefined. It will not consider null to be equal to undefined.  

  Example: null === undefined evaluates to false.  
  Recommendation:

  It is generally recommended to use the strict equality operator (===) for comparisons in TypeScript (and JavaScript). This is because:
  - Predictability:  
    It avoids unexpected behavior due to type coercion, making your code more predictable and easier to reason about.
  - Clarity:  
    It clearly indicates that you are looking for an exact match of both value and type.
  - Type Safety:  
    In TypeScript, strict equality aligns better with the type system, as it ensures that you are comparing values of the same type.  
    

When == might be used: While === is preferred, there are specific cases where == null might be used as a shorthand to check for both null and undefined simultaneously, as value == null will be true if value is either null or undefined. However, value === undefined should be used if the intent is to strictly check for undefined only.



## vite

[Environment Variables in Vite React Application](https://javascript.plainenglish.io/environment-variables-in-vite-react-application-ca2d5051ee7c)  
[Simplifying API Proxies in Vite: A Guide to vite.config.js](https://medium.com/@eric_abell/simplifying-api-proxies-in-vite-a-guide-to-vite-config-js-a5cc3a091a2f)  

## react

- [React: 用于构建 Web 和原生交互界面的库](https://zh-hans.react.dev/)  

- [快速入门](https://zh-hans.react.dev/learn)  
  - [教程：井字棋游戏](https://zh-hans.react.dev/learn/tutorial-tic-tac-toe)  

- [描述 UI: 制作可重用、可嵌套的组件](https://zh-hans.react.dev/learn/describing-the-ui)  
- [UI组件状态更新](https://zh-hans.react.dev/learn/adding-interactivity)  
- [状态管理: 组件间的状态隔离与共享](https://zh-hans.react.dev/learn/managing-state)  
- [组件与外部状态](https://zh-hans.react.dev/learn/escape-hatches)  


### hooks

react hook 用来修改组件状态，协调组件之间的状态变化, 控制组件和外部交互的变化.

[React 内置 Hook](https://zh-hans.react.dev/reference/react/hooks)  
[usehooks.com: A collection of modern, server-safe React hooks – from the ui.dev team](https://usehooks.com/)  


## [tanstack-router](https://tanstack.com/router/latest)

补充 tanstack-router 的特点和用法  

[TanStack Router v1 docs:](https://tanstack.com/router/latest/docs/framework/react/overview)  

示例程序: 
[TanStack Router React Example: Kitchen Sink File Based](https://tanstack.com/router/latest/docs/framework/react/examples/kitchen-sink-file-based)  

## [tanstack-query](https://tanstack.com/query/latest)

补充 tanstack-query 的特点和用法  

[TanStack Query v5](https://tanstack.com/query/latest/docs/framework/react/overview)  

示例程序: 
[TanStack Query React Example: Basic](https://tanstack.com/query/latest/docs/framework/react/examples/basic)


[React Query - useMutation](https://dev.to/this-is-learning/react-query-usemutation-2cmg)  


## mock api server

### [Mock Service Worker(MSW)](https://mswjs.io/docs/)

这是一个用于 mock 请求数据的库，在 node 和 浏览器的 worker 层面拦截网络请求. 这个mock库可以在调试工具的 network 中看到网络请求.
这个适合用于加速前端页面开发和调试.


### axios-mock-adapter

在main.tsx中加入此逻辑，表示在开发环境下动态导入 mocker 相关的模块. 这个mock工具的缺点是无法再调试工具看到网络请求.
```ts
if (import.meta.env.DEV)
{
  // const { axios_mocker } = await import('./mocks/browser')
  await import('./mocks/axios_mocker')
  console.log("axios mocker started!")
}
```

## [tailwindcss](https://tailwindcss.com/)

补充 tailwindcss 的特点和用法


## proxychains4

代理工具，用于加速安装依赖包

```bash
# 安装proxychains4
apt install proxychains4
```

```
# 将proxy 配置加入到配置文件/etc/proxychains4.conf 中

#socks4   127.0.0.1 9050  # 文件中的此行需注释掉
socks5  192.168.1.201 1080
```

## [bun 安装 ](https://www.bunjs.cn/docs/installation) 

Bun 是用于运行 JavaScript 和 TypeScript 应用程序的集成工具包。它以单一可执行文件的形式发布，文件名为 bun。

Bun 的核心是 Bun 运行时，这是一种快速 JavaScript 运行时，可直接替换 Node.js。Bun 采用 Zig 语言编写，底层采用 JavaScriptCore 引擎，大大减少了启动时间和内存使用量。

```bash
# 安装
# linux/macos curl
proxychains curl -fsSL https://bun.sh/install | proxychains bash

# npm
npm install -g bun

# Homebrew
brew install oven-sh/bun/bun


# 查看版本
bun --version
```

## Shadcn Admin web 依赖安装 、 运行

```bash
# 依赖安装
bun install 

# 运行
bun run dev
bun run dev  # 如果电脑上安装了 node
```

如果电脑上安装了 node 和 bun, 想强制程序使用 bun 的运行时, 请使用下列命令:  

```bash
bun -b run dev 
```

# Shadcn Admin Dashboard

Admin Dashboard UI crafted with Shadcn and Vite. Built with responsiveness and accessibility in mind.

![alt text](public/images/shadcn-admin.png)

[![Sponsored by Clerk](https://img.shields.io/badge/Sponsored%20by-Clerk-5b6ee1?logo=clerk)](https://go.clerk.com/GttUAaK)

I've been creating dashboard UIs at work and for my personal projects. I always wanted to make a reusable collection of dashboard UI for future projects; and here it is now. While I've created a few custom components, some of the code is directly adapted from ShadcnUI examples.

> This is not a starter project (template) though. I'll probably make one in the future.

## Features

- Light/dark mode
- Responsive
- Accessible
- With built-in Sidebar component
- Global search command
- 10+ pages
- Extra custom components
- RTL support

<details>
<summary>Customized Components (click to expand)</summary>

This project uses Shadcn UI components, but some have been slightly modified for better RTL (Right-to-Left) support and other improvements. These customized components differ from the original Shadcn UI versions.

If you want to update components using the Shadcn CLI (e.g., `npx shadcn@latest add <component>`), it's generally safe for non-customized components. For the listed customized ones, you may need to manually merge changes to preserve the project's modifications and avoid overwriting RTL support or other updates.

> If you don't require RTL support, you can safely update the 'RTL Updated Components' via the Shadcn CLI, as these changes are primarily for RTL compatibility. The 'Modified Components' may have other customizations to consider.

### Modified Components

- scroll-area
- sonner
- separator

### RTL Updated Components

- alert-dialog
- calendar
- command
- dialog
- dropdown-menu
- select
- table
- sheet
- sidebar
- switch

**Notes:**

- **Modified Components**: These have general updates, potentially including RTL adjustments.
- **RTL Updated Components**: These have specific changes for RTL language support (e.g., layout, positioning).
- For implementation details, check the source files in `src/components/ui/`.
- All other Shadcn UI components in the project are standard and can be safely updated via the CLI.

</details>

## Tech Stack

**UI:** [ShadcnUI](https://ui.shadcn.com) (TailwindCSS + RadixUI)

**Build Tool:** [Vite](https://vitejs.dev/)

**Routing:** [TanStack Router](https://tanstack.com/router/latest)

**Type Checking:** [TypeScript](https://www.typescriptlang.org/)

**Linting/Formatting:** [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/)

**Icons:** [Lucide Icons](https://lucide.dev/icons/), [Tabler Icons](https://tabler.io/icons) (Brand icons only)

**Auth (partial):** [Clerk](https://go.clerk.com/GttUAaK)

## Run Locally

Clone the project

```bash
  git clone https://github.com/satnaing/shadcn-admin.git
```

Go to the project directory

```bash
  cd shadcn-admin
```

Install dependencies

```bash
  pnpm install
```

Start the server

```bash
  pnpm run dev
```

## Sponsoring this project ❤️

If you find this project helpful or use this in your own work, consider [sponsoring me](https://github.com/sponsors/satnaing) to support development and maintenance. You can [buy me a coffee](https://buymeacoffee.com/satnaing) as well. Don’t worry, every penny helps. Thank you! 🙏

For questions or sponsorship inquiries, feel free to reach out at [satnaingdev@gmail.com](mailto:satnaingdev@gmail.com).

### Current Sponsor

- [Clerk](https://go.clerk.com/GttUAaK) - authentication and user management for the modern web

## Author

Crafted with 🤍 by [@satnaing](https://github.com/satnaing)

## License

Licensed under the [MIT License](https://choosealicense.com/licenses/mit/)
