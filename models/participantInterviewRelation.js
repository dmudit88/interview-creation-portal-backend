const mongoose=require('mongoose');

const participantInterviewRelationSchema=new mongoose.Schema({
    interviewId: {type: mongoose.Schema.Types.ObjectId, ref: 'Interview'},
    participantId:{type: mongoose.Schema.Types.ObjectId, ref: 'Participant'}
});

module.exports=new mongoose.model('ParticipantInterviewRelation',participantInterviewRelationSchema);