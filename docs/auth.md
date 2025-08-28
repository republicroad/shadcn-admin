


## authtication

使用jwt来对用户进行认证.
用户在系统中有四种状态:

1. active    (激活中)
2. inactive  (非活跃状态, 只读账号, 允许登录)
3. invited   (邀请中)
4. suspended (暂停, 账号锁定, 不允许登录)


## authrization

基于 zen-engine 建立基于角色RBAC和基于属性ABAC的权限系统.
默认情况下支持基于角色的权限设计, 根据决策引擎的运营特点.
分为三类角色:
1. admin
2. manager
3. oprator


## 架构

/api 开头的路由用来做这个 shadcn-admin 的运营系统.