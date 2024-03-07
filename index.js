import express from "express";

import mysql from 'mysql2';
// import path from "path";
import multer from "multer"
import cors from "cors"
import bodyParser from "body-parser"

const app=express();
app.use(cors())
app.use(bodyParser.json())
// Create the connection to database
const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:"Sidharth@123",
    database: 'cornerstone',
  });

//   connection.query("select * from project",(err,rows,fields)=>{
//     console.log(rows)
// })
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'project_data/')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})

const upload=multer({storage:storage})

app.post("/upload",upload.single('file'),(req,res)=>{
    // console.log(req.query)
    if(!req.file){
        return res.status(404).send("No file uploaded")
    }
    // console.log(req.file)
    const {originalname,filename}=req.file
    const givenName=req.query.name;
    const expiryDate=req.query.expirydate;
    // console.log(expiryDate)

    
    const sql='INSERT INTO main_project(name,expiry_date,originalname,filename) VALUES (?,?,?,?)'
    connection.query(sql,[givenName,expiryDate,originalname,filename],(err,result)=>{
        if(err){
            console.log("error saving file in db");
            res.status(500).send("internal server error");
        }else{
            // console.log("file successfully saved in db: ",result);
            res.status(200).send("file uploaded & saved in db");
        }
    })
})

app.get("/projects",(req,res)=>{
    const sql='select * from main_project';
    connection.query(sql,(err,result)=>{
        if(err){
            console.log("error fecthing the data from the db");
            res.status(500).send("internal server error");
        }else{
            // console.log("file successfully saved in db: ",result);
            res.status(200).json(result)
        }
    })

})


//login 
app.post("/login",(req,res)=>{
    const {username,password}=req.body;
    const sql='select * from users where username=? and password=?';
    connection.query(sql,[username,password],(err,results)=>{
        if(err){
            console.log("error");
            res.send("error")
            
        }
        if(results.length>0){
            console.log("after login result is: ",results)
            res.json({success:true,message:"Login successfull",dt:results})
        }else{
            res.json({success:false,message:"Invalid Credentials"})
        }
    })
})

app.listen(8080,()=>{
    console.log("Server is running on port 8080");
})