var express=require('express');
var router=express.Router();

var Participant=require('../models/participantDB');

router.get('/',async(req,res)=>{
    var partcicpants=await Participant.find();
    res.json(partcicpants);
});

router.post('/',(req,res)=>{
    var participant=new Participant({
        participantName: req.body.name,
        participantEmail: req.body.email,
        participantRole: req.body.role

    });
    participant.save();
    
});

module.exports=router;