import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

export const mock = new MockAdapter(axios);
const login_res = {
    "status": 0,
    "message": "登陆成功！",
    "data": {
        "user": {
            "user_id": "fb417c920bb142eabd6016a3520663b3",
            "user_key": "a5737c292dab487a95e6cc31cd8c4d0b",
            "username": "wanghao@geetest.com",
            "permissions": [],
        },
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IndhbmdoYW9AZ2VldGVzdC5jb20iLCJ1c2VyX2lkIjoiZmI0MTdjOTIwYmIxNDJlYWJkNjAxNmEzNTIwNjYzYjMiLCJleHAiOjE3NTUzNTM5MTh9.Z2x7nm5oa_ZuOgGt01gwsZhyxOT27nyOBJjJI5vpvCs",
        "expire_time": 1755353918
    }
}
// mock.onGet('/geerule/login').reply(200, login_res);
mock.onAny('/geerule/login').reply(200, login_res);

// const httpClient = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export default httpClient;