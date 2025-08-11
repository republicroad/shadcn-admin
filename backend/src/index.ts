import { Elysia, t } from "elysia";
import { swagger } from '@elysiajs/swagger'

// const app = new Elysia().get("/", () => "Hello Elysia").listen(3000);
const app = new Elysia()
    // Apply the swagger plugin
    .use(swagger()) 
    .get('/', ({ path }) => path)
    .post('/hello', 'Do you miss me?')
    .post('/geerule/login',  ({ path,params }) => [params, path])
    .get('/user/:id', ({ params: { id } }) => { return {id:id} }, {
        params: t.Object({
            id: t.Number()
        })
      })
    .get('/json', () => {
        return {
            hello: 'Elysia'
        }
    })
    .listen(8000)

console.log(`Bun.version:${Bun.version}`);
// console.log(app);
console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
console.log(
  `🦊 Elysia openapi is running at http://${app.server?.hostname}:${app.server?.port}/swagger`
);
