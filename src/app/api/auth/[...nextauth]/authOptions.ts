import getUserProfile from "@/libs/getUserProfile"
import userLogin from "@/libs/userLogin"
import { AuthOptions } from "next-auth"
import CredentailsProvider from "next-auth/providers/credentials"

export const authOptions: AuthOptions = {
    providers: [
        // Authentication Provider, use Credentials Provider
        CredentailsProvider({ // Copy from https://next-auth.js.org/providers/credentials
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "email", placeholder: "Email" },
                password: { label: "Password", type: "password", placeholder: "Password" }
            },
            async authorize(credentials, req) {
            
                if(!credentials) return null

                const user = await userLogin(credentials.email, credentials.password)

            if (user) {
                // Any object returned will be saved in `user` property of the JWT
                const profile = await getUserProfile(user.token)

                return {
                    id: profile.data.id,
                    name: profile.data.name,
                    email: profile.data.email,
                    telephone: profile.data.telephone,
                    role: profile.data.role,
                    token: user.token
                }
            } else {
                // If you return null then an error will be displayed advising the user to check their details.
                return null

                // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
            }
            }
        })
    ],
    session: {strategy: 'jwt'},
    callbacks: {
        async jwt({token, user}){
            if(user){
                token.id = user.id
                token.role = user.role
                token.token = user.token
                token.name = user.name
                token.email = user.email
                token.telephone = user.telephone
            }
            return token
        },
        async session({session, token, user}){
            session.user.id = token.id as string
            session.user.role = token.role as string
            session.user.token = token.token as string
            session.user.name = token.name as string
            session.user.email = token.email as string
            session.user.telephone = token.telephone as string
            return session
        }
    }
}