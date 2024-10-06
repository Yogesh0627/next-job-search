

import { NextRequest, NextResponse } from "next/server"
import bcrypt from 'bcryptjs'
import { connectDB } from "@/dbConfig/db"
import UserModel from "@/models/userModel"
// import { sendVerificationEmail } from "@/helpers/sendVerificationEmail"

connectDB()

export async function POST(request:NextRequest) {
try {
    const body = await request.json()
    const {email, password} = body

    const existingUserWithEmail = await UserModel.findOne({email})
    if(existingUserWithEmail){
        return NextResponse.json({success:false,msg:"User with this email already exist"},{status:400})
    }
    else{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        const newUser = new UserModel({
            email,
            password:hashedPassword,
            userType : "A"
        })
        const savedUser = await newUser.save()
        console.log("🚀 ~ POST ~ savedUser:", savedUser)
        return NextResponse.json({success:true,message:"Admin registered successfully"},{status:200})
    }
} catch (error) {
    console.log("An Error Occured during Sign up Admin")
    return NextResponse.json({success:false,message:"Error regestering Admin"},{status:500})
}

}