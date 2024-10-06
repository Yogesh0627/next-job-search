
import mongoose,{Document,Schema} from "mongoose"


export interface User extends Document{
    // username:string
    password:string,
    email:string,
    userType:string
    
    // verificationCode:string,
    // verificationCodeExpiry:Date,
    // forgotPasswordCode:string,
    // forgotPasswordExpiry:Date,
    // isVerified:boolean
    // isAcceptingMessage:boolean,
    // messages:Message[]
}

const userSchema:Schema<User>= new Schema({
    // username:{
    //     type:String,
    //     required:[true,"Username is required"],
    //     trim:true,
    //     unique:true
    // },
    password:{
        type:String,
        required:[true,"Password is required"],
        trim:true

    },
    email:{
        type:String,
        required:[true,"Email is Required"],
        unique:true,
        trim:true,
        match:[/.+\@.+\..+/,"Please provide a valid email"]
    },
    userType:{
        type:String,
        required:[true,  "Please provide a user type"],
        trim:true
    }
})

const UserModel = mongoose.models.users as mongoose.Model<User> || mongoose.model<User>("users",userSchema)

export default UserModel