import { jwtDecode } from "jwt-decode";

interface jwtPayload {
  username: string;
  user_id: string;
  exp: number;
  roles?: string[];
}

export function setAuthToken(jwtToken: string) {
    const userJwt: jwtPayload = jwtDecode(jwtToken);
    localStorage.setItem('authToken', jwtToken); 
    localStorage.setItem('authTokenUsername', userJwt.username); 
    localStorage.setItem('authTokenExp', userJwt.exp.toString()); 
    return userJwt;
}

export const signOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authTokenUsername');
    localStorage.removeItem('authTokenExp');
};

export function isAuthenticated() {
    const authToken:string|null = localStorage.getItem('authToken');
    const authTokenUsername:string|null = localStorage.getItem('authTokenUsername');
    const authTokenExp:number = Number(localStorage.getItem('authTokenExp') ?? 0);
    const currentTimestampMs = Date.now(); // Returns milliseconds since Epoch
    const currentTimestampSeconds = Math.floor(currentTimestampMs / 1000); // Converts to seconds and rounds down
    // console.log("isAuthenticated authTokenUsername:", authTokenUsername);
    // console.log("isAuthenticated authTokenExp:", authTokenExp);
    // console.log("isAuthenticated currentTimestampSeconds:", currentTimestampSeconds);
    if (authTokenUsername === null || authToken === null || currentTimestampSeconds > authTokenExp ){
        return false
    }
    return true;
}

export function isAuthenticated2() {
    const authToken:string = localStorage.getItem('authToken') ?? "";;
    const authTokenUsername:string = localStorage.getItem('authTokenUsername') ?? "";
    const authTokenExp:number = Number(localStorage.getItem('authTokenExp') ?? 0);
    const currentTimestampMs = Date.now(); // Returns milliseconds since Epoch
    const currentTimestampSeconds = Math.floor(currentTimestampMs / 1000); // Converts to seconds and rounds down
    // console.log("isAuthenticated authTokenUsername:", authTokenUsername);
    // console.log("isAuthenticated authTokenExp:", authTokenExp);
    // console.log("isAuthenticated currentTimestampSeconds:", currentTimestampSeconds);
    if (authTokenUsername === "" || authToken === "" || currentTimestampSeconds > authTokenExp ){
        return false
    }
    return true;
}