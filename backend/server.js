const express = require("express")
const app = express()
const mysql = require("mysql2/promise")
const fs = require("fs")
app.use(express.json())
require("dotenv").config();
const port = process.env.PORT || 5000;
/*.  




updates 

name : 
version :
type:
builddate :
changelog : 


*/

let db;

const createdatabase =  async ()=>{

    try{
    db = await mysql.createConnection(
        {
            "host" :  process.env.db_host,
            "user" : process.env.db_user,
            "port" : process.env.db_port,
            "password" : process.env.db_password,
            "database": process.env.db_database,
            "dateStrings": true,
            "ssl" : { 
                 "ca" : fs.readFileSync(__dirname+"/../ca.pem") 
                ,"rejectUnauthorized" : true}
        }
    )
    await db.execute ("create table if not exists updates (id int auto_increment primary key, name varchar(100),version decimal(10,5),type varchar(100),builddate datetime , changelog text , url text not null);")
    console.log("Database is configured Sucessfully");
}
catch(error){
    console.log("Error is been happened");
    console.log(error);
}
}

createdatabase();


app.get("/getallupdates", async(req,res)=>{
    const [out] = await db.execute("select * from updates");
    res.send(out);
})
app.post("/addupdate/",async(req,res)=>{
    const [out] = await db.execute("insert into updates(name,version,type,builddate,changelog,url) value(?,?,?,?,?,?)",[req.body.name,req.body.version, req.body.type, req.body.builddate, req.body.changelog,req.body.url]);
    console.log("New software detected");

    res.send({
        "message" : "software update added",
        "data" : out
    })
})

app.delete("/deleteupdate/:id",async(req, res)=>{
   const [out] = await db.execute("delete from updates where id =?",[req.params.id]);
   console.log("Deleted Successfully");
   res.send(out);
})




app.get("/",(req,res)=>{
    res.send("Api is running")
})

app.listen(port,()=>{
    console.log(`Server is running ${port}`)
})