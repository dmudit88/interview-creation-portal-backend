var express=require('express');
var router=express.Router();

var Participant=require('../models/participantDB');
var Interview=require('../models/interviewDB');
var ParticipantInterviewRelation=require('../models/participantInterviewRelation');
const participantInterviewRelation = require('../models/participantInterviewRelation');

router.get('/',async(req,res)=>{
    const date=new Date(Date.now());
    
    var interviews=await Interview.find({'startTime':{$gte:date}}).lean();
    for(var i=0; i<interviews.length; i++){
        var participant=await participantInterviewRelation.find({'interviewId':interviews[i]._id});
        var t=[]
        for(var j=0; j<participant.length; j++){
            let participantOne=await Participant.findOne({'_id':participant[j].participantId});
            t.push(participantOne);
        }   
        interviews[i]["participants"]=t;
    }
    
    // console.log(interviews);
    res.json(interviews);
});

router.post('/',async(req,res)=>{
    var {title,location,description,startTime,endTime,participants}=req.body;
    var temp=await Participant.find({"email":{"$in":participants}});
    var conflict=false;
    for(var i=0; i<temp.length; i++){
        var participant=await participantInterviewRelation.find({'participationId':temp[i]._id});
        for(var j=0; j<participant.length; j++){
            var interviewDesc=await Interview.findOne({'_id':participant[i].interviewId});
            const startt=new Date(startTime);
            const interviewst=new Date(interviewDesc.startTime);
            const interviewet=new Date(interviewDesc.endTime);

            if(startt>= interviewst && startt<=interviewet){
                conflict=true;
                break;
            }
        }
        if(conflict){
            break;
        }
    }
    if(conflict){
        console.log("hello");
        res.status('200').send('Particpant schedule conflicting');

    }else{
        var interview=new Interview({
            title: title,
            location: location,
            description: description,
            startTime: startTime,
            endTime: endTime
        });
        interview.save();
        for(var i=0; i<temp.length; i++){
            const data=new ParticipantInterviewRelation({
                interviewId: interview.id,
                participantId: temp[i].id
            });
            data.save();
        }
        res.status('201').send('Success : Interview data saved');
    }
});

router.put('/',(req,res)=>{
    console.log(req.body);
    res.status('200').send('Success : Interview data updated');

});

router.get('/PIrelation',async(req,res)=>{
    var temp=await ParticipantInterviewRelation.find();
    res.json(temp);
});

router.post('/deleteInterview',(req,res)=>{
    var {id}=req.body;
    Interview.deleteOne({id:id},(err)=>{

    });

});

module.exports=router;