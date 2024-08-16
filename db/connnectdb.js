import mongoose from "mongoose";
export const connectdb  = async ()=>{
try {
  const conn =  await mongoose.connect(process.env.MONGO_URI)
  console.log(`MONGO CONNECTED : ${conn.connection.host}`)
} catch (error) {
    console.log("ERROR CONNECTION TO MONGOOSE :" , error.message)
    process.exit(1); // 1 is for failure // 0 status code is for sucess // 
}
}