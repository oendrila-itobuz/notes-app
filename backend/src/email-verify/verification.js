import nodemailer from 'nodemailer'
// import handlebars from 'handlebars'
import dotenv from "dotenv/config";
// import fs from "fs"

export const mailSend = async (token, email) => {

// const emailTemplateSource = fs.readFileSync('template.hbs')
// const template = handlebars.compile(emailTemplateSource)
// const htmlToSend = template({message: token})
  
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.mailUser,
      pass: process.env.mailPass
    }
  });
  
  const mailConfigurations = {
    from: process.env.mailUser,
    to: email,
    subject: 'Email Verification',
    text: `You have recently visited our Notes App website and entered your email.
    Please follow the given link to verify your email.
    http://localhost:8000/user/verify/${token}
    Thanks`

    // text: htmlToSend
  };

  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) throw Error(error);
    console.log('Email Sent Successfully');
    console.log(info);
  });
}
