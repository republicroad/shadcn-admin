// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw'
const login_res = {
    "status": 0,
    "message": "登陆成功！",
    "data": {
        "user": {
            "user_id": "2344f9862db5422b8a155897626f72c4",
            "user_key": "4c61f72fdca348b095b2a9c2eeb95a64",
            "username": "wanghao@geetest.com",
            "permissions": []
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IndhbmdoYW9AZ2VldGVzdC5jb20iLCJ1c2VyX2lkIjoiMjM0NGY5ODYyZGI1NDIyYjhhMTU1ODk3NjI2ZjcyYzQiLCJleHAiOjE3NTUyMzkyMDZ9.WXJyPx58AFl8YvmG0R9AimdhVTaGA6SSDlCkPhxZSDE",
        "expire_time": 1755239206
    }
}

export const handlers = [
  http.post('geerule/login', () => {
    return HttpResponse.json(login_res)
  }),
]