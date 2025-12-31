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

Install	bun add drizzle-orm && bun add -D drizzle-kit
使用 drizzle-kit 来管理数据库表的模式变更

Summary of Commands

Pull Schema	bunx drizzle-kit pull
Push Changes	bunx drizzle-kit push (to update DB from code)
View Studio	bunx drizzle-kit studio (to view data in browser)


查询 drizzle-kit 相关命令:
> bunx drizzle-kit --help

```bash
$ bunx drizzle-kit --help
Available Commands:
  generate     修改数据库表结构后(添加列，增加索引，新增表)生成对应的变更迁移文件
  migrate      运行迁移文件同步数据库表结构. 一般在生产环境使用.
  introspect   根据当前数据库反射生成相关类型定义.
  push         将当前的表 schema 类型定义和数据库表字段作双向同步.
  studio       提供一个基于浏览器的web页面管理数据库表
  up           
  check        
  drop         
  export       Generate diff between current state and empty state in specified formats: sql
```

drizzle-kit generate	lets you generate SQL migration files based on your Drizzle schema either upon declaration or on subsequent changes, see here.
drizzle-kit migrate	lets you apply generated SQL migration files to your database, see here.
drizzle-kit pull	lets you pull(introspect) database schema, convert it to Drizzle schema and save it to your codebase, see here
drizzle-kit push	lets you push your Drizzle schema to database either upon declaration or on subsequent schema changes, see here
drizzle-kit studio	will connect to your database and spin up proxy server for Drizzle Studio which you can use for convenient database browsing, see here
drizzle-kit check	will walk through all generate migrations and check for any race conditions(collisions) of generated migrations, see here
drizzle-kit up	used to upgrade snapshots of previously generated migrations, see here


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


## pg

安装 pg 并配置网络访问的简要步骤:

1. 安装 pg: apt install postgresql
2. sudo -u postgres psql  使用默认的 postgres 的用户进入 psql 的命令行.
3. sudo -u postgres psql -c '\password' 修改密码
4. postgresql.conf 修改 listen_addresses = '*'
5. pg_hba.conf 最后增加 host    all             all             0.0.0.0/0               scram-sha-256
6. 重启postgresql: sudo systemctl restart postgresql
6. psql -h 10.141.125.66 -U postgres -d postgres


### 步骤解释

postgresql.conf 修改listen_addresses:  
```ini
listen_addresses = '*'
```
pg_hba.conf 最后增加:  
```txt
host    all             all             0.0.0.0/0               scram-sha-256
```
pg_hba.conf 修改后可以使用如下命令重载:
```bash
sudo -u postgres psql -c 'SELECT pg_reload_conf();'
```
you can simply type 'psql' to log in as yourself 
```bash 
sudo -u postgres createuser --superuser $USER  
sudo -u postgres createdb $USER
```

### 创建用户

```bash
CREATE USER myuser WITH PASSWORD 'mypassword';
ALTER  USER myuser WITH PASSWORD 'new_secure_password';
```