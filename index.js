const express = require("express"),
  app = express(),
  nodemailer = require("nodemailer");
require("dotenv").config();

const clientemail = require("./clientMail"),
  ownermail = require("./ownerMail");
app.use(express.json());
app.use("/", express.static(__dirname + "/public"));
const generateMail = (
  name,
  email,
  description = "",
  phone = "",
  project = ""
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = !description
    ? {
        from: "monsooncse@gmail.com",
        to: email,
        subject: "Welcome from Orange",
        html: clientemail(name),
      }
    : {
        from: "monsooncse@gmail.com",
        to: "monsooncse@gmail.com",
        subject: "Welcome from Orange",
        html: ownermail(name, email, description, phone, project),
      };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });
};

app.post("/sendmail", (req, res) => {
  const { name, email, phone, description, project } = req.body;
  generateMail(name, email);
  generateMail(name, email, description, phone, project);
  res.json({ data: "message sent" });
});

app.listen(5000, () => console.log(`server listen at 5000`));
