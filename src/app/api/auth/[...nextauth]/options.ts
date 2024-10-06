import bcrypt from 'bcryptjs';
// import { connectDB } from '@/dbConfig/db';
// import { ApiResponse } from './../../../../types/APIResponse';
import UserModel from "@/models/userModel"
import {NextAuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"


export const authOptions:NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id:"credentials",
            name:"Credentails",
            credentials:{
                email: { label: "Email", type: "text", placeholder: "Enter your email" },
                password: { label: "Password", type: "password", placeholder:"Enter your password" }
            },
            async authorize(credentials:any):Promise<any>{

                // console.log(credentials)
                // await connectDB()
                try {
                    
                    // console.log(credentials.email)
                    // console.log(credentials.password)
                    const findingUser = await UserModel.findOne({email:credentials.email})
                    // console.log("🚀 ~ authorize ~ findingUser:", findingUser)
                    // console.log(findingUser,"findingUser")
                    if(!findingUser){
                        throw new Error("User not exist, please sign up")
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password,findingUser.password)

                    // console.log(isPasswordCorrect, "from next auth")
                    if(!isPasswordCorrect){
                        throw new Error("Invalid Password")
                    }
                    // console.log(findingUser, "after password matching")
                    return findingUser
                } catch (error:any) {
                    throw new Error(error)
                    console.log("Errror from options in next js",error.message)
                    return (`Errror from options in next js ${error.message}`)
                    return null
                }
            }
        })
    ],
    callbacks:{
        async jwt({token,user}) {

            if(user){
                token._id = user._id?.toString(),
                token.email = user?.email
                token.userType = user?.userType
                } 
            
            return token
        },
        async session({session,token,user}) {

            if(token){
                session.user._id = token._id,
                session.user.email = token.email,
                session.user.userType = token.userType
            }
            return session
        },
        async redirect({url,baseUrl}){
            return baseUrl
        }
    },
    // pages:{
    //     signIn:'/sign-in'
    // },
    session:{
        strategy:'jwt'
    },
    secret:process.env.NEXTAUTH_SECRET
}