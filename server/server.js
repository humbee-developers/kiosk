const multer = require("multer");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

const app = express();

app.use(cors()); // Use this after the variable declaration

app.use(express.json()); // tell the server to accept the json data from frontend

const PORT = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const Storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "_" + file.originalname);
  },
});

const upload = multer({
  storage: Storage,
}).single("image");

app.post("/secondmail", (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send("Error uploading file.");
    } else {
      const { name, email, phone, category } = req.body;
      console.log("name:", name);
      console.log("email:", email);
      console.log("phone:", phone);
      console.log("category:", category);

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "jaykalariya.humbee@gmail.com",
          pass: "wecdoqzwxfcifkss",
        },
      });

      const mailOption = {
        from: "ira.humbee@gmail.com", 
        to: "ira.humbee@gmail.com",
        subject: "Email Test",
        html: `
        <p>New Inquiry Form from this site </p>
        <div style="border: 1px dashed black; padding: 20px;">
          <ul style="list-style-type: none; padding: 0; margin: 0;">
            <li><strong>Name:</strong> ${name}</li><br /><br />
            <li><strong>Email:</strong> ${email}</li> <br /><br />
            <li><strong>Phone:</strong> ${phone}</li> <br /><br />
            <li><strong>Inquiry:</strong> ${category}</li><br /><br />
          </ul>
          </div>`,
      };

      transporter.sendMail(mailOption, function (err, info) {
        if (err) {
          console.log(err);
          return res.status(500).send("Error sending email.");
        } else {
          console.log("Email Sent", info.response);
          return res.status(200).send("Email sent successfully.");
        }
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
