const mongoose=require('mongoose');
const participantInterviewRelation=require('./participantInterviewRelation');
const interviewSchema=new mongoose.Schema({
    title: String,
    location: String,
    description: String,
    startTime:{ type: Date, required: true, default: Date.now},
    endTime:{ type: Date, required: true, default: Date.now},
});
interviewSchema.pre('deleteOne',function(next){
    participantInterviewRelation.deleteMany({interviewId:this._conditions.id}).exec();
    next();
});

const interviewModel=new mongoose.model('Interview',interviewSchema);
module.exports=interviewModel;