const mongoose=require('mongoose');
const participantInterviewRelation=require('./participantInterviewRelation');


const participantSchema=new mongoose.Schema({
    name: String,
    email:{ type: String, unique: true },
    role: String
});
participantSchema.pre('deleteOne',function(next){
    console.log(this._conditions.id);
    participantInterviewRelation.deleteMany({participantId:this._conditions.id}).exec();
    next();
});

const participantModel=new mongoose.model('Participant',participantSchema);
module.exports=participantModel;