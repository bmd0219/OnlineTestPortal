const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const crypto = require("crypto");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const httpserver = require("http").createServer(app);
const io = require("socket.io")(httpserver);
const nodemailer = require('nodemailer')
require("dotenv").config();

//routes
const profroutes = require("./routes/prof");
const studentroutes = require("./routes/student");

const db = process.env.MONGODB_URI;

// Connect to Mongo
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  }) // Adding new mongo url parser
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

const conn = mongoose.connection;

//Gridfs Storage Managers
let gfs;
conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
});

const storage = new GridFsStorage({
  url: db,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const originalname = file.originalname;
        const fileInfo = {
          filename: filename,
          originalname: originalname,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

app.post("/student/login", async (req, res) => {
  const { rollno } = req.body;

  if (!rollno) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  let emailId = rollno.toString() + "@nitt.edu"

  const verificationCode = Math.floor(Math.random() * 900000) + 100000

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GPD
    }
  })

  var mailOptions = {
    to: emailId,
    subject: 'OTP for Exam Login',
    Text: `The OTP for verification is ${verificationCode}.`
  }

  transporter.sendMail(mailOptions, function (err) {
    if (err) { return res.status(500) }
    res.status(200).json({msg :'A verification email has been sent to ' + email + '.'});
});
});
