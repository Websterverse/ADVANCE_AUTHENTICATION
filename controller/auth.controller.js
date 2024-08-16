import bcryptjs from "bcryptjs";
import crypto from "crypto"
import dotenv from "dotenv"
import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail, sendVerificationEmail  , sendWelcomeEmail , sendRestSuccessEmail} from "../mailtrap/emails.js";


export const login = async (req  , res)=>{
const {email , password} = req.body ; 
try {
    
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({success:false , message:"INVALID CREDENTIALS"})
    }

    const isPasswordValid = await bcryptjs.compare(password , user.password);
    if(!isPasswordValid){
        return res.status(400).json({success:false , message:"INVALID CREDENTIALS"})
    }

     generateTokenAndSetCookie(res, user._id)
     user.lastlogin = new Date();
     await user.save()

return res.status(200).json({success: true , message: " User Login Successfully!!" , user : {
    ...user._doc ,
    password : undefined , 
}
})

} catch (error) {
    console.log("ERROR IN LOGIN");
    res.status(400).json({success:false , message: error.message});
}
}

export const logout = async (req  , res)=>{
res.clearCookie("token")
res.status(200).json({ success : true , message: "USER LOGOUT SYCCESSFULLY"})
console.log("LOGOUT SUCCESSFULLY!!")

}


export const signup = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        // Check if all fields are present
        if (!email || !password || !name) {
            throw new Error("All fields are required!!!");
        }

        // Check if user already exists
        const userAlreadyExists = await User.findOne({ email });
        if(userAlreadyExists){
            console.log(userAlreadyExists)
        }

        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User Already Exists!!!" });
        }


        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Generate verification token
        const verificationToken = Math.floor(100000 + Math.random() * 90000).toString();

        // Create new user
        const user = new User({
            email,
            name,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpireAt: Date.now() + 24 * 60 * 60 * 1000,
        });

        // Save user to the database
        await user.save();

        // Generate JWT token and set it in the cookie
        generateTokenAndSetCookie(res, user._id);

// verification function //
 await sendVerificationEmail(user.email,verificationToken)


        // Send response
        res.status(201).json({
            success: true,
            message: "User created",
            user: {
                ...user._doc,
                password: undefined,
            },

        });

    } catch (error) {
        // Handle errors
         res.status(400).json({ success: false, message: error.message });
    }
};


export const verifyEmail = async(req, res)=>{
    // - - - - - //
const {code} = req.body ;

try {
    
const user =  await User.findOne({
verificationToken : code ,
verificationTokenExpireAt : { $gt : Date.now()}
})

if(!user){
    return res.status(400).json({ success :false  , message:"Invalid or expired verification code"})
}

user.isVerified = true ;
user.verificationToken = undefined;
user.verificationTokenExpireAt = undefined
await user.save()

await sendWelcomeEmail(user.email , user.name);

res.status(200).json({success:true , message:"Email verified successfully" , user :{
    ...user._doc,
    password: undefined,
}})

} catch (error) {

    console.log("error in verifyEmail ", error);
    res.status(500).json({ success: false, message: "Server error" });
}


}

export const forgotPassword = async(req, res)=>{

const {email} = req.body ;

try {
    const user =  await User.findOne({email})
    if(!user){
        return res.status(400).json({success:false , message:"User not found"})
    }

// generate reset token //
const resetToken = crypto.randomBytes(20).toString("hex");
const resetTokenExpireAt = Date.now()  +  1 * 60 * 60 *1000

user.resetPasswordToken = resetToken
user.resetPasswordExpireAt = resetTokenExpireAt
await user.save() ;

// send email 

await sendPasswordResetEmail(user.email , `${process.env.CLIENT_URL}/reset-password/${resetToken}`)

res.status(200).json({success:true , message:"Password rest link sent to your email"})
} catch (error) {
    console.log("ERROR IN FORGOT PASSWORD " , error)
res.status(400).json({success:false , message:error.message})
}
}


export const resetPassword = async(req , res)=>{
    try {
        const {password} = req.body ;
        const {token} = req.params ;
        const user = await User.findOne({
             resetPasswordToken: token,
             resetPasswordExpireAt : {$gt: Date.now() },
        }) 

       if(!user){
        return res.status(400).json({success:false , message:"Invalid or expired rest Token"});
       }

       //update Password //
       const hashPassword = await bcryptjs.hash(password , 10);
       user.password = hashPassword ,
       user.resetPasswordToken = undefined,
       user.resetPasswordExpireAt = undefined

await user.save()

await sendRestSuccessEmail(user.email)

res.status(200).json({success:true , message:"Password reset successfully"})

    } catch (error) {
         
        console.log("Error in resetPassword" , error)
res.status(400).json({success:false , message:error.message})

    }
}


export const checkAuth = async(req , res)=>{
try {
    
    const user =  await User.findById(req.userId).select("-password")
    if(!user) return res.status(400).json({success:false , message:"User not defined"})      
    res.status(200).json({success:true , user})

} catch (error) {
    
console.log("Error in checkAuth" , error)
res.status(400).json({success:false , message: error.message})
}
}
