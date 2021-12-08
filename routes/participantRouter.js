var express=require('express');
var router=express.Router();

var Participant=require('../models/participantDB');

router.get('/',async(req,res)=>{
    var partcipants=await Participant.find();
    res.json(partcipants);
});

router.post('/',(req,res)=>{
    var {name,email,role}=req.body;
    console.log(req.body);
    var participant=new Participant({
        name: name,
        email: email,
        role: role
    });
    participant.save();
    res.status('200').send('Participant data saved');    
});

router.post('/deleteParticipant',(req,res)=>{
    var {id}=req.body;
    Participant.deleteOne({id:id},(err)=>{
        
    });
});

module.exports=router;