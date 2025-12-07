const nodeMailer = require("nodemailer");


exports.SendEmail =() =>{
    try {
     var datetime = new Date();
     console.log('Email Sent'+datetime.toLocaleTimeString());
 
 
     const toEmail = "gaganit1265@gmail.com";
     const subject = "Corn Job Test";
     const body = "This is Cron Job Notification :"+datetime.toLocaleTimeString();
 
 
     const mailTransPort = nodeMailer.createTransport({
         //service : 'gmail',
         host :'smtp.gmail.com',
         port : '465',
         auth : {user :'gagantest33@gmail.com' , pass : ''}
     });
 
     const mailObj = {
         from : 'gagantest33@gmail.com',
         to : toEmail,
         subject : subject,
         //text : body,
         html : '<h1> Daily Sales Report For Ecomm</h1><br/><h3>Total Shoes Sales : 1001</h3><br/><h3>Total Sales Shoes Price  : 210012 INR</h3>',
         attachments : [{filename : 'Report.pdf',path:'C:/Users/gagan/OneDrive/Desktop/Gagan-SE 2.pdf'}]
     };
 
     mailTransPort.sendMail(mailObj,function(err,info){
         if(err){
             console.log(err)
         }else{
             console.log(info)
         }
     })
    } catch (error) {
     console.log(error);
    }
 }
