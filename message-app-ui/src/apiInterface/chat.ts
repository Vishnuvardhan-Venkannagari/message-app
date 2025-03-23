import conf from "../conf/conf.ts";
// import store from "../store/store" 

interface chatData {
    token: string
    user: string
    name: string
}

export class ChatInterface {
    private api_url: string
    constructor(){
        this.api_url = conf.apiUrl
        console.log(this.api_url)
    }
    
    async getAllUsers(token: string): Promise<any>{
        const users = await fetch(`/api/all-users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authtoken": token
            }
        });
        if (users.ok) {
            return await users.json()
          } else {
            throw new Error("Unauthorized")
        }
    }

    async getAllChats(token: string): Promise<any>{
        const chats = await fetch(`/api/chats`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authtoken": token
            }
        });
        if (chats.ok) {
            return await chats.json()
          } else {
            throw new Error("Unauthorized")
        }
    }

    async createNewChat(body: chatData): Promise<any>{
        const createchat = await fetch(`/api/chats/create-room`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authtoken": body.token
            },
            body: JSON.stringify(
                {
                    to_user_id: body.user,
                    receiver_name: body.name
                }
            )
        });
        if (createchat.ok) {
            return await createchat.json()
          } else {
            throw new Error("Unauthorized")
        }
    }

}

const chatservice = new ChatInterface()
export default chatservice