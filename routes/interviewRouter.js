var express = require("express");
var nodemailer = require("nodemailer");
var moment=require('moment');
var router = express.Router();
require("dotenv").config();

var smtpTransport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

var Participant = require("../models/participantDB");
var Interview = require("../models/interviewDB");
var ParticipantInterviewRelation = require("../models/participantInterviewRelation");
const participantInterviewRelation = require("../models/participantInterviewRelation");

router.get("/", async (req, res) => {
  const date = new Date(Date.now());

  var interviews = await Interview.find({ endTime: { $gte: date } }).lean();
  for (var i = 0; i < interviews.length; i++) {
    var participant = await participantInterviewRelation.find({
      interviewId: interviews[i]._id,
    });
    var t = [];
    for (var j = 0; j < participant.length; j++) {
      let participantOne = await Participant.findOne({
        _id: participant[j].participantId,
      });
      t.push(participantOne);
    }
    interviews[i]["participants"] = t;
  }

  // console.log(interviews);
  res.json(interviews);
});

router.post("/", async (req, res) => {
  var { title, location, description, startTime, endTime, participants } =req.body;
  var temp = await Participant.find({ email: { $in: participants } });
  console.log(temp);
  var conflict = false;
  for (var i = 0; i < temp.length; i++) {
    var participant = await participantInterviewRelation.find({
      participationId: temp[i]._id,
    });

    for (var j = 0; j < participant.length; j++) {
      var interviewDesc = await Interview.findOne({
        _id: participant[j].interviewId,
      });

      if (interviewDesc == null) {
        console.log(participant[j].interviewId);
        continue;
      }
      const startt = new Date(startTime);
      const endt = new Date(endTime);
      const interviewst = new Date(interviewDesc.startTime);
      const interviewet = new Date(interviewDesc.endTime);

      if (startt <= interviewet && endt >= interviewst) {
        conflict = true;
        break;
      }
    }
    if (conflict) {
      break;
    }
  }
  if (conflict) {
    console.log("hello");
    res.status("200").send("Particpant schedule conflicting");
  } else {
    var interview = new Interview({
      title: title,
      location: location,
      description: description,
      startTime: startTime,
      endTime: endTime,
    });
    interview.save();
    for (var i = 0; i < temp.length; i++) {
      const data = new ParticipantInterviewRelation({
        interviewId: interview.id,
        participantId: temp[i].id,
      });
      data.save();
    }
    var content="Hi,Your Interview is Scheduled. Start Time: "+moment(startTime).format("DD MMM, YYYY HH:mm")+" Endtime: "+moment(endTime).format("DD MMM, YYYY HH:mm");
    mailOptions = {
      from: process.env.MAIL_USER,
      to: participants,
      subject: "Interview Scheduled",
      text:content
        
    };
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function (error, response) {
      console.log('mail sent');
      
    });
    res.status("201").send("Success : Interview data saved");
  }
});

router.put("/", async (req, res) => {
  console.log(req.body);
  const interviewId = req.body.interviewId;
  var { title, location, description, startTime, endTime, participants } =
    req.body;
  var pidata = await participantInterviewRelation.find({
    interviewId: interviewId,
  });
  var olddata = await Interview.find({ _id: interviewId }).lean();
  var participantOlddata = [];
  for (var i = 0; i < pidata; i++) {
    var t = Participant.findOne({ _id: pidata[i].participantId });
    participantOlddata.push(t);
  }

  var p = Interview.deleteOne({ _id: interviewId });
  var temp = await Participant.find({ email: { $in: participants } });
  var conflict = false;
  for (var i = 0; i < temp.length; i++) {
    var participant = await participantInterviewRelation.find({
      participationId: temp[i]._id,
    });
    if (participant == null) {
      continue;
    }
    for (var j = 0; j < participant.length; j++) {
      var interviewDesc = await Interview.findOne({
        _id: participant[j].interviewId,
      });
      if (interviewDesc == null) {
        continue;
      }
      if (interviewDesc._id == interviewId) {
        console.log("interviewDA");
        continue;
      }
      const startt = new Date(startTime);
      const endt = new Date(endTime);
      const interviewst = new Date(interviewDesc.startTime);
      const interviewet = new Date(interviewDesc.endTime);

      if (startt <= interviewet && endt >= interviewst) {
        conflict = true;
        break;
      }
    }
    if (conflict) {
      break;
    }
  }
  if (conflict) {
    console.log("hello");

    res
      .status("200")
      .send(
        "Update could not be preformed due to particpant schedule conflicting"
      );
  } else {
    p.exec();
    var interview = new Interview({
      title: title,
      location: location,
      description: description,
      startTime: startTime,
      endTime: endTime,
    });
    interview.save();
    for (var i = 0; i < temp.length; i++) {
      const data = new ParticipantInterviewRelation({
        interviewId: interview.id,
        participantId: temp[i].id,
      });
      data.save();
    }
    res.status("201").send("Success : Interview data updated");
  }
});

router.get("/PIrelation", async (req, res) => {
  var temp = await ParticipantInterviewRelation.find();
  res.json(temp);
});

router.post("/deleteInterview", (req, res) => {
  var { id } = req.body;
  Interview.deleteOne({ id: id }, (err) => {});
});

module.exports = router;
