
# brde web admin

基于 Shadcn Admin Dashboard 研发 brde web admin 项目. 使用 bun 进行项目管理.


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


## [tailwindcss](https://tailwindcss.com/)

补充 tailwindcss 的特点和用法


# Shadcn Admin Dashboard

Admin Dashboard UI crafted with Shadcn and Vite. Built with responsiveness and accessibility in mind.

![alt text](public/images/shadcn-admin.png)

I've been creating dashboard UIs at work and for my personal projects. I always wanted to make a reusable collection of dashboard UI for future projects; and here it is now. While I've created a few custom components, some of the code is directly adapted from ShadcnUI examples.

> This is not a starter project (template) though. I'll probably make one in the future.

## Features

- Light/dark mode
- Responsive
- Accessible
- With built-in Sidebar component
- Global Search Command
- 10+ pages
- Extra custom components

## Tech Stack

**UI:** [ShadcnUI](https://ui.shadcn.com) (TailwindCSS + RadixUI)

**Build Tool:** [Vite](https://vitejs.dev/)

**Routing:** [TanStack Router](https://tanstack.com/router/latest)

**Type Checking:** [TypeScript](https://www.typescriptlang.org/)

**Linting/Formatting:** [Eslint](https://eslint.org/) & [Prettier](https://prettier.io/)

**Icons:** [Tabler Icons](https://tabler.io/icons)

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

For questions or sponsorship inquiries, feel free to reach out at [contact@satnaing.dev](mailto:contact@satnaing.dev).

### Current Sponsor

- [Clerk](https://go.clerk.com/GttUAaK) - for backing the implementation of Clerk in this project

## Author

Crafted with 🤍 by [@satnaing](https://github.com/satnaing)

## License

Licensed under the [MIT License](https://choosealicense.com/licenses/mit/)
