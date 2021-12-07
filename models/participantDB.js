const mongoose=require('mongoose');

const participantSchema=new mongoose.Schema({
    participantName: String,
    participantEmail:String,
    participantRole: String
});

const participantModel=new mongoose.model('Participant',participantSchema);
module.exports=participantModel;