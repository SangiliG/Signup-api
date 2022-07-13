const express=require("express");
const AWS= require('aws-sdk');
const path=require("path");
const bodyparser=require('body-parser')
const bcrypt=require('bcryptjs')
const app=express();
 require("./dydb");

const port=process.env.PORT||4000;
app.listen(port,()=>{
    console.log("Listening on port: "+ port);
})
const static_path=path.join(__dirname,"./main");
app.use(express.static(static_path));
app.use(bodyparser.json())

//aws
AWS.config.update({
    region:process.env.AWS_DEFAULT_REGION,
    accessKeyId:process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
});

const dynamoClient=new AWS.DynamoDB.DocumentClient();
const TABLE_NAME="signup";

//json
app.post('/api/register',async(req,res)=>{
    const{email,password:plaintext}=req.body
    
    if(!email||typeof email!=='string'){

        return res.json({
            status:'error',
            error:'Invalid Username'})
    }
    if(!plaintext||typeof plaintext!=='string'){
        return res.json
        ({status:'error',
        error:'Invalid password'})
    }
    if(plaintext.length<5){
        return res.json({
            status:'error',
            error:"Password should be atleast 6 character"
        })
    }
    

    const password=await bcrypt.hash(plaintext,10);
    req.body.password= password;
    console.log("-------------------------");
    console.log("email:",email);
    console.log( "password:",password)
    
    res.json({status:'OK'})
    //json
    const param={
        TableName:TABLE_NAME,
        Item:req.body  
    }

    await dynamoClient.put(param).promise().then(()=>{
        const body={
            Operation:'SAVE',
            Message:'SUCCESS',
            Item:req.body
        }
        res.json(body);
    },error=>{
        console.error('error occured',error);
    })
})

app.get("/",(req,res) =>{
    res.send("Hello")
});
