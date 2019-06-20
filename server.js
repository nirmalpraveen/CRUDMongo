const express = require('express');
const mongoose = require ('mongoose');
const config = require('./config');
const app = express();
var path = require('path');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    
    username: {
        type: String
    },
    password: {
        type: String
    },
    userDetails: [{ type: Schema.Types.ObjectId, ref: 'userDetailsModel' }]

}, {collection: 'Users'});

const user =  mongoose.model('User',UserSchema);

const UserDetailsSchema = new Schema({
    
    FirstName: {
        type: String
    },
    LastName: {
        type: String
    },
    address: {
        type: String
    },
    phone: {
        type: Number
    }

}, {collection: 'UserDetails'});

const userDetailsModel =  mongoose.model('UserDetails',UserDetailsSchema);

var dbConn = mongoose.connect(config.database, (err)=>{
    if(err){console.log(err);}
    else {console.log('Connected to DB Successfully')}
},{ useNewUrlParser: true })


app.get('/',(req,res,next)=>{
    res.json({
        name: 'Nirmal Praveen'
    })
})

app.get('/main',(req,res,next)=>{
    res.sendFile(path.join(__dirname + '/DisplayUsers.html'));
})

app.get('/CreateUser',(req,res,next)=>{
    res.sendFile(path.join(__dirname + '/CreateUser.html'));
})

app.get('/ListUsers',(req,res,next)=>{
    
    //user.find().populate('userDetailsModel')
    user.find().populate('userDetailsModel').exec(function (err, doc) {
        if (err) return console.error(err);
        res.send(doc)        
        
    })})


app.get('/SearchUsers',(req,res,next)=>{
    res.sendFile(path.join(__dirname + '/SearchUser.html'));
    /*user.find({ "fname": "asdf" },function (err, fname) {
        if (err) return console.error(err);
        res.json({
            name: fname
            //name: 'Nirmal Praveen'
        })
      })*/
})

app.post('/SearchUsers',(req,res,next)=>{
    //res.sendFile(path.join(__dirname + '/SearchUser.html'));
    let firstName =req.body.fname;
    user.find({ "fname": firstName },function (err, fname) {
        if (err) return console.error(err);
        res.json({
            name: fname
            //name: 'Nirmal Praveen'
        })
      })
})

app.get('/DeleteUsers',(req,res,next)=>{
    res.sendFile(path.join(__dirname + '/DeleteUser.html'));
    /*user.find({ "fname": "asdf" },function (err, fname) {
        if (err) return console.error(err);
        res.json({
            name: fname
            //name: 'Nirmal Praveen'
        })
      })*/
})

app.post('/DeleteUsers',(req,res,next)=>{
    //res.sendFile(path.join(__dirname + '/SearchUser.html'));
    let firstName =req.body.fname;
    user.deleteOne({ "fname": firstName },function (err, fname) {
        if (err) return console.error(err);
        res.send(fname + 'User got delete' );
      })
})

app.post('/saveUser',(req,res,next)=>{
    //let user = new user.user();
    let name=req.body.username;
    //last=req.body.lname;
    //user.password=req.body.lname;
    //user.save();
    var dbConn = mongoose.connection;
    dbConn.collection('Users').insertOne({"username" : req.body.username,"password" : req.body.password});
    //dbConn.collection('Users').insert(req.body);
    
    //dbConn.collection('UserDetails').insertOne({"firstname" : req.body.ffname,"lastname" : req.body.llname,"address" : req.body.add, "mobile" : req.body.mbl});
    //dbConn.collection('UserDetails').insertOne(JSON.parse(req.body.llname));
    //dbConn.collection('UserDetails').insertOne(JSON.parse(req.body.add));
    //dbConn.collection('UserDetails').insertOne(JSON.parse(req.body.mbl));
    //user.insert(req.body);
       
    res.send(name + 'Details saved');
})

app.get('/UpdateUser',(req,res,next)=>{
    res.sendFile(path.join(__dirname + '/UpdateUser.html'));
    /*user.find({ "fname": "asdf" },function (err, fname) {
        if (err) return console.error(err);
        res.json({
            name: fname
            //name: 'Nirmal Praveen'
        })
      })*/
})

app.post('/UpdateUser',(req,res,next)=>{
    //res.sendFile(path.join(__dirname + '/SearchUser.html'));
    var ofirstName =req.body.oname;
    var nfirstName =req.body.nname; 
    
    user.findOneAndReplace({ "fname": ofirstName },{"fname": nfirstName}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
    
        res.send(doc);}
    )
})
    
    

app.listen(config.port, err =>{
    console.log('port 2398');
});