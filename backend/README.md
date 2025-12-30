# Elysia with Bun runtime

## Getting Started
To get started with this template, simply paste this command into your terminal:
```bash
bun create elysia ./elysia-example
```

## Development
To start the development server run:
```bash
bun run dev
```

Open http://localhost:8000/ with your browser to see the result.

### swagger


```ts

```

### database

使用 drizzle-kit 来管理数据库表的模式变更
Summary of Commands
Action 	Command
Install	bun add drizzle-orm && bun add -D drizzle-kit
Pull Schema	bunx drizzle-kit pull
Push Changes	bunx drizzle-kit push (to update DB from code)
View Studio	bunx drizzle-kit studio (to view data in browser)


查询 drizzle-kit 相关命令:
> bunx drizzle-kit --help


#### 反射数据库得到类型定义(pull):

> bunx drizzle-kit pull

为了连接到数据库, bunx drizzle-kit pull 默认使用一些客户端的库. 
比如:
连接到 sqlite 需要使用 @libsql/client 库,
连接到 postgresql 需要使用 pg 和 @types/pg 库.
因为bun内置了用zig实现的sqlite和postgresql的客户端, 所以上面这些包不会在线上使用. 可以只把他们安装在开发环境中.
> bun add -D drizzle-kit pg @types/pg @libsql/client

在本仓库中:
drizzle.config.ts 文件配置了 sqlite 的连接示例
> bunx drizzle-kit pull
drizzle_pg.config.ts 文件配置了 postgresql 的连接示例
> bunx drizzle-kit pull --config drizzle_pg.config.ts

#### 推送数据库表的字段变化到数据库中(push)

> bunx drizzle-kit push

同理，也可以使用 --config 指定配置文件

> bunx drizzle-kit push --config drizzle_pg.config.ts

#### drizzle studio

使用如下命令可以在浏览器中查看和管理数据:
> bunx drizzle-kit studio


## test

bun 自动递归寻找下列文件中的测试用例.

- *.test.{js|jsx|ts|tsx}
- *_test.{js|jsx|ts|tsx}
- *.spec.{js|jsx|ts|tsx}
- *_spec.{js|jsx|ts|tsx}


[bun:test](https://bun.com/docs/cli/test)  
[Writing tests](https://bun.com/docs/test/writing)  
[elysiajs Unit Test  ](https://elysiajs.com/patterns/unit-test.html)  
