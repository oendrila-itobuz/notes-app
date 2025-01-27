import nodemailer from 'nodemailer'

export const mailSend = async (token,email) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "oendrila@itobuz.com",
        pass: "kizl mcjp plxx fwyt"
    }
  });
  
  const mailConfigurations = {
    from: 'oendrila@itobuz.com',
    to: email,
    subject: 'Email Verification',
    text: `You have recently visited our Notes App website and entered your email.
           Please follow the given link to verify your email.
           http://localhost:8000/user/verify/${token} 
           Thanks`
  };
  
  transporter.sendMail(mailConfigurations, function(error, info){
    if (error) throw Error(error);
    console.log('Email Sent Successfully');
    console.log(info);
  });
}