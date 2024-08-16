import { VERIFICATION_EMAIL_TEMPLATE  ,  PASSWORD_RESET_REQUEST_TEMPLATE , PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplates.js"
import { mailtrapclient , sender } from "./mailtrap.config.js"

export const sendVerificationEmail = async(email , verificationCode)=>{

const recipient = [{email}]

try {
    const response = await mailtrapclient.send({
from : sender ,
to:recipient ,
subject:"Verify your email",
html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}" , verificationCode),
category:"Email Verification"
    })

console.log("Email sent successfully" , response)
} catch (error) {
  console.error(`Error sending verification`, error)
  throw new Error(`Error sending verifcation email: ${error}`)   
}

}



export const sendWelcomeEmail = async(email , name)=>{

const recipient = [{email}];

try {
    const response = await mailtrapclient.send({
        from:sender,
        to:recipient ,
        template_uuid:  "d53d82f0-f3a9-4c4c-9a55-8982f461352c",      
        template_variables: {
            company_info_name:"KinGKARR-INTERNATIONALS" , 
            name: name
          }
    })

    console.log( "WELCOME EMAIL SENT SUCCESSFULLY" ,  response)


} catch (error) {
    
    console.error(`Error sending welcome email`, error);

    throw new Error(`Error sending welcome email: ${error}`);

}

}



export const sendPasswordResetEmail = async(email, resetURL)=>{
const recipient = [{email}]

try {
    const response = await mailtrapclient.send({
        from: sender ,
        to : recipient ,
        subject: "Forget  password",
        html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}" , resetURL),
        category: "Password Reset"
    })


    console.log( "PASSWORD RESET  EMAIL SENT SUCCESSFULLY" ,  response)


} catch (error) {
    console.error(`Error sending password reset email` , error)

throw new Error(`Error sending reset email : ${error}`)
}


}



export const sendRestSuccessEmail = async(email)=>{
const recipient = [{email}]

try {
    const response = await mailtrapclient.send({
        from: sender ,
        to : recipient ,
        subject: "Reset your password",
        category : 'Reset password',
        html: PASSWORD_RESET_SUCCESS_TEMPLATE , 
    });

console.log("Password reset email sent successfully " , response)

} catch (error) {

    throw new Error(`Error sending password reset success email: ${error}`);

}

}