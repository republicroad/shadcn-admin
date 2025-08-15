// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('geerule/login', async ({ request }) => {
        const requestBody = await request.json();
        return HttpResponse.json(fake_user_login_jwt(requestBody))
  }),
]

interface LoginUser {
  email:string;
  password:string;
  username:string;
};

function fake_user_login_jwt(requestBody:any){
  const loginuser:LoginUser = requestBody;
  const user = {
    "username": loginuser.username,
    "user_id": "2344f9862db5422b8a155897626f72c4",
    "exp": Date.now()/1000 + 3600
  }
  // 1. Convert object to JSON string
  const jsonString = JSON.stringify(user);
  // 2. Base64 encode the JSON string
  const fakePayload = btoa(jsonString);
  var accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IndhbmdoYW9AZ2VldGVzdC5jb20iLCJ1c2VyX2lkIjoiMjM0NGY5ODYyZGI1NDIyYjhhMTU1ODk3NjI2ZjcyYzQiLCJleHAiOjE3NTU1MDMzNjh9.6zdp0451v8qqNZDsb28sXdU4Dwt3KJIVTRbOZQGHJSQ"
  // jwt token 本质就是 {header}.{payload}.{signature} 的格式字符串.
  // 其中 header 和 payload 都是 data object JSON.stringify() 之后在去 base64(btoa) 之后生成的字符串. 加上最后的签名用来校验是否被篡改.
  const [header, _payload, signature] = accessToken.split(".");  // 忽略掉原来的 payload, 因为payload中包含一个固定的过期时间, 此 payload 会被fake替换. 
  accessToken = [header, fakePayload, signature].join(".");

  const login_res: object = {
      "status": 0,
      "message": "登陆成功！",
      "data": {
          "user": {
              "user_id": "2344f9862db5422b8a155897626f72c4",
              "user_key": "4c61f72fdca348b095b2a9c2eeb95a64",
              "username": user["username"],
              "permissions": []
          },
          "accessToken": accessToken,
          "expire_time": 1755239206
      }
  }
  return login_res
}

