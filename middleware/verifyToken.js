import jwt from "jsonwebtoken"

export const verifyToken = (req , res , next)=>{
const token = req.cookies.token ; 
if(!token) return res.status(401).json({status:false , message: "Unauthorized ~ no token provided"})

    try {
        const decoded = jwt.verify(token , process.env.JWT_SECERT)
        if(!decoded){
            return res.status(401).json({status: false , message:"Unauthorized ~ invalid token"})
        }
        req.userId = decoded.userId
        next()  

    } catch (error) {
        console.log("Error in verifyToken"  , error)
        return res.status(400).json({status:false , message:"Server error"})
    }


}