import {z} from "zod";

export const signupAdminValidationSchema=  z.object({
    email : z.string().email({message:"invalid email address"}),
    userType:z.string().default("A"),
    password : z.string()
    .min(6,{message:"Password must be atleast 6 characters"})
    .max(15, "Password should be maximum 15 characters long")
    .regex(
        /^(?=.*\d)(?=.*[!@#$%^&*()\-_=+\\\|{}\[\]:;"'<>,.?\/])(?=.*[a-z])(?=.*[A-Z]).{6,10}$/,
        "Password must contain at least one number, one special character, one lowercase letter, and one uppercase letter."
      ),
    confirmPassword: z
    .string()
    .min(6, "Password should be minimum 6 characters long")
    .max(15, "Password should be maximum 10 characters long")
}).refine((data)=>data.password===data.confirmPassword,{
    message:"Password doesn't match",
    path:["confirmPassword"]
})