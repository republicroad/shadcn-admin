# 后端 API 对接完成说明

## 已完成的功能模块

### 1. API 服务层
- **位置**: `src/lib/api.ts` 和 `src/services/`
- **功能**: 
  - Axios 实例配置（请求/响应拦截器）
  - 自动添加 JWT Token
  - 统一错误处理
  - 401 自动跳转登录

### 2. 服务模块
所有服务都在 `src/services/` 目录下：

- `auth.service.ts` - 认证服务
  - 登录、刷新 Token
  - 获取用户信息、权限、角色
  - 修改密码
  - 权限和角色检查

- `user.service.ts` - 用户管理服务
  - 用户列表（分页）
  - 创建、更新、删除用户
  - 批量删除
  - 重置密码、修改密码

- `role.service.ts` - 角色管理服务
  - 角色列表（分页）
  - 创建、更新、删除角色
  - 批量删除
  - 分配菜单权限、数据权限

- `menu.service.ts` - 菜单管理服务
  - 菜单树、菜单列表
  - 创建、更新、删除菜单
  - 根据角色/用户获取菜单

- `dept.service.ts` - 部门管理服务
  - 部门树、部门列表
  - 创建、更新、删除部门
  - 根据角色获取部门

- `post.service.ts` - 岗位管理服务
  - 岗位列表（分页）
  - 创建、更新、删除岗位
  - 批量删除

### 3. 前端页面

#### 角色管理 (`/roles`)
- 完整的 CRUD 功能
- 分页、排序、筛选
- 批量删除
- 数据权限配置

#### 菜单管理 (`/menus`)
- 菜单树形展示
- 创建、编辑、删除菜单
- 菜单类型：目录、菜单、按钮
- 权限标识配置

#### 部门管理 (`/departments`)
- 部门树形结构
- 创建、编辑、删除部门
- 部门负责人、联系方式

#### 岗位管理 (`/posts`)
- 岗位列表（分页）
- 创建、编辑、删除岗位
- 批量删除
- 岗位排序

### 4. 侧边栏导航
已更新 `src/components/layout/data/sidebar-data.ts`，添加了系统管理菜单组：
- 角色管理
- 菜单管理
- 部门管理
- 岗位管理

## 使用说明

### 1. 配置后端地址
```bash
# 复制环境变量示例文件
cp .env.example .env

# 编辑 .env 文件，设置后端 API 地址
VITE_API_BASE_URL=http://localhost:3000
```

### 2. 启动前端项目
```bash
npm run dev
```

### 3. 访问页面
- 角色管理: http://localhost:5173/roles
- 菜单管理: http://localhost:5173/menus
- 部门管理: http://localhost:5173/departments
- 岗位管理: http://localhost:5173/posts

## 技术栈

- **前端框架**: React 19 + TypeScript
- **路由**: TanStack Router
- **状态管理**: Zustand
- **UI 组件**: shadcn/ui + Radix UI
- **表单**: React Hook Form + Zod
- **HTTP 客户端**: Axios
- **表格**: TanStack Table

## 项目结构

```
src/
├── lib/
│   └── api.ts                    # Axios 配置
├── services/                     # API 服务层
│   ├── auth.service.ts
│   ├── user.service.ts
│   ├── role.service.ts
│   ├── menu.service.ts
│   ├── dept.service.ts
│   ├── post.service.ts
│   └── index.ts
├── features/                     # 功能模块
│   ├── roles/                    # 角色管理
│   ├── menus/                    # 菜单管理
│   ├── departments/              # 部门管理
│   └── posts/                    # 岗位管理
└── routes/                       # 路由配置
    └── _authenticated/
        ├── roles/
        ├── menus/
        ├── departments/
        └── posts/
```

## 后端接口对应关系

### 认证接口
- POST `/api/auth/login` - 登录
- POST `/api/auth/refresh` - 刷新 Token
- GET `/api/auth/userinfo` - 获取用户信息
- GET `/api/auth/permissions` - 获取用户权限
- GET `/api/auth/roles` - 获取用户角色
- PUT `/api/auth/changePassword` - 修改密码

### 用户管理
- GET `/api/system/user/list` - 用户列表
- GET `/api/system/user/:id` - 用户详情
- POST `/api/system/user` - 创建用户
- PUT `/api/system/user/:id` - 更新用户
- DELETE `/api/system/user/:id` - 删除用户
- DELETE `/api/system/user/batch` - 批量删除

### 角色管理
- GET `/api/system/role/list` - 角色列表
- GET `/api/system/role/all` - 所有角色
- GET `/api/system/role/:id` - 角色详情
- POST `/api/system/role` - 创建角色
- PUT `/api/system/role/:id` - 更新角色
- DELETE `/api/system/role/:id` - 删除角色
- DELETE `/api/system/role/batch` - 批量删除
- PUT `/api/system/role/:id/menus` - 分配菜单权限
- PUT `/api/system/role/:id/depts` - 分配数据权限

### 菜单管理
- GET `/api/system/menu/tree` - 菜单树
- GET `/api/system/menu/list` - 菜单列表
- GET `/api/system/menu/:id` - 菜单详情
- POST `/api/system/menu` - 创建菜单
- PUT `/api/system/menu/:id` - 更新菜单
- DELETE `/api/system/menu/:id` - 删除菜单

### 部门管理
- GET `/api/system/dept/tree` - 部门树
- GET `/api/system/dept/list` - 部门列表
- GET `/api/system/dept/:id` - 部门详情
- POST `/api/system/dept` - 创建部门
- PUT `/api/system/dept/:id` - 更新部门
- DELETE `/api/system/dept/:id` - 删除部门

### 岗位管理
- GET `/api/system/post/list` - 岗位列表
- GET `/api/system/post/all` - 所有岗位
- GET `/api/system/post/:id` - 岗位详情
- POST `/api/system/post` - 创建岗位
- PUT `/api/system/post/:id` - 更新岗位
- DELETE `/api/system/post/:id` - 删除岗位
- DELETE `/api/system/post/batch` - 批量删除

## 注意事项

1. **Token 管理**: Token 存储在 localStorage 中，自动在请求头中添加
2. **错误处理**: 401 错误会自动清除 Token 并跳转到登录页
3. **分页**: 后端分页从 1 开始，前端表格从 0 开始，已做转换
4. **数据格式**: 所有接口返回格式为 `{ code, msg, data }`

## 下一步工作

1. 实现登录页面，对接 `/api/auth/login` 接口
2. 实现用户管理页面的完整功能
3. 添加权限控制（基于角色和权限）
4. 添加国际化支持
5. 优化表格性能（虚拟滚动）
6. 添加导出功能
