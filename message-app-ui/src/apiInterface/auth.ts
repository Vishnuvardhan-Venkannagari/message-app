import { BiBody } from "react-icons/bi";
import conf from "../conf/conf.ts";
import store from "../store/store" 

interface LoginInput {
    email: string
    password: string
}
  
interface SessionData {
    token: string
    user: any
}


interface SignupInput{
    email: string
    password: string
    firstName : string
    lastName: string
}


interface SignupResponse {
    message: string;
    token: string;
    user: {
      id: string;
      email: string;
      name: string;
      [key: string]: any;
    };
}

export class AuthInterface {
    private api_url: string
    // private token: string
    constructor(){
        this.api_url = conf.apiUrl
        // const token = store.getState().auth.authtoken
        // if (!token) throw new Error("Missing token")
        // this.token = token
    }

    async logIn(body: LoginInput): Promise<SessionData | null>{
        try {
            const response = await fetch(`/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        email: body.email,
                        password: body.password
                    }
                )
            });
            if (response.status === 200) {
                const data = await response.json()
                return data
            } else{
                throw new Error("Login failed")
            }
        } catch (error) {
            console.log("Error in LoginEmail", error)
            return null
        }
    }

    async getCurrentUser(token: string): Promise<any>{
        const me = await fetch(`/api/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authtoken": token
            }
        });
        if (me.ok) {
            return await me.json()
          } else {
            throw new Error("Unauthorized")
        }
    }

    async logOut(){
        try {
            return null
        } catch (error) {
            console.log("/api/logOut", error)
        }
    }

    async signUp(body: SignupInput): Promise<SignupResponse | null>{
        try {
            const response = await fetch(`/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {
                        email: body.email,
                        password: body.password,
                        name: body.firstName + " " + body.lastName
                    }
                )
            });
            if (response.status === 200) {
                const data = await response.json()
                return data
            } else{
                throw new Error("Login failed")
            }
        } catch (error) {
            console.log("Error in LoginEmail", error)
            return null
        }
    }
}

const authservice = new AuthInterface()
export default authservice