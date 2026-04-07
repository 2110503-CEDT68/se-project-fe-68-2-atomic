import NextAuth from "next-auth";

declare module "next-auth"{
    interface Session {
		user:{
			id: string,
			name: string,
			email: string,
			telephone: string,
			role: string,
			token: string
		}
	}

    interface User {
        id: string,
        name?: string | null,
        email?: string | null,
        telephone?: string,
        role: string,
        token: string
    }
}