const port = 4000;
const express = require("express");
const multer = require("multer");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path=require('path');
const { v4: uuidv4 } = require('uuid');
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
require('dotenv').config();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const fetchuser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch (error) {
    return res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
};

const Users = mongoose.model("Users", {  // Schema for regular users
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  date: { type: Date, default: Date.now },
  userid: { type: String },
});

const HR = mongoose.model("HR", {  // Schema for HR users
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  date: { type: Date, default: Date.now },
  userid: { type: String },
});

app.post('/signup', async (req, res) => {
  console.log("Sign Up");
  let success = false;
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({ success: success, errors: "Existing user found with this email" });
  }
  
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    userid: req.body.id,
  });
  await user.save();
  const data = { user: { id: user.id } };
  const token = jwt.sign(data, 'secret_ecom');
  success = true;
  res.json({ success, token });
});

app.post('/login', async (req, res) => {
  console.log("Login");
  let success = false;
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = { user: { id: user.id } };
      success = true;
      console.log(user.id);
      const token = jwt.sign(data, 'secret_ecom');
      res.json({ success,name: req.body.name, token });
    } else {
      return res.status(400).json({ success: success, errors: "Please try with correct email/password" });
    }
  } else {
    return res.status(400).json({ success: success, errors: "Please try with correct email/password" });
  }
});

app.post('/signup-hr', async (req, res) => {  // Endpoint for HR sign up
  console.log("HR Sign Up");
  let success = false;
  let check = await HR.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({ success: success, errors: "Existing HR user found with this email" });
  }
  const hrUser = new HR({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    userid: req.body.id,
  });
  await hrUser.save();
  const data = { user: { id: hrUser.id } };
  const token = jwt.sign(data, 'secret_ecom');
  success = true;
  res.json({ success, token });
});

app.post('/login-hr', async (req, res) => {  // Endpoint for HR login
  console.log("HR Login");
  let success = false;
  let user = await HR.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = { user: { id: user.id } };
      success = true;
      console.log(user.id);
      const token = jwt.sign(data, 'secret_ecom');
      res.json({ success, token });
    } else {
      return res.status(400).json({ success: success, errors: "Please try with correct email/password" });
    }
  } else {
    return res.status(400).json({ success: success, errors: "Please try with correct email/password" });
  }
});

const referralSchema = new mongoose.Schema({

  name: { type: String, required: true },
  email: { type: String, required: false },
  contact: { type: String, required: true },
  userEmail: { type: String, required: true },
  dateSubmitted: { type: Date, default: Date.now },
  status: { type: String, required: true },
  location: { type: String, required: true },
  userId: { type: String, required: true },
  resume: { type: String },
});
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);

  }

const Referral = mongoose.model('Referral', referralSchema);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir); // Save to 'uploads' folder
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); 
    cb(null, file.fieldname + '-' + Date.now() + ext); 
  }
});

const fileFilter = function(req, file, cb) {
  if (file.mimetype === 'application/pdf' || file.mimetype === 'image/png' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    cb(null, true); 
  } else {
    cb(new Error('Only PDF, PNG, DOC, DOCX files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 20 // Limit file size to 20MB
  }
});

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(uploadsDir));

// Endpoint to fetch resume (PDF or PNG)
app.get('/api/get-resume/uploads/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadsDir, filename);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(404).send('File not found');
    }
  });
});

app.post('/api/saveReferral', upload.single('resume'), async (req, res) => {
  const { name, email, contact, userEmail, dateSubmitted, status, location, userId } = req.body;

  const resumePath = req.file ? req.file.path : '';

  const newReferral = new Referral({
    name,
    email,
    contact,
    userEmail,
    dateSubmitted,
    status,
    location,
    userId,
    resume: resumePath,
  });

  try {
    const savedReferral = await newReferral.save();
    res.status(200).json(savedReferral);
  } catch (error) {
    console.error('Failed to save referral:', error);
    res.status(500).json({ message: 'Failed to save referral', error });
  }
});
app.get('/api/getEmployeeByEmail', async (req, res) => {
  try {
    const userEmail = req.query.email;
    if (!userEmail) {
      return res.status(400).json({ message: 'Email parameter is missing' });
    }
    const employee = await Referral.find({ userEmail });
    if (!employee || employee.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    console.error('Error fetching employee by email:', error);
    res.status(500).json({ message: 'Failed to fetch employee', error });
  }
});


const EMAIL_USER = 'panupawar10@gmail.com';
const EMAIL_PASS = 'qoav jbya hknt xemu';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, 
  secure: false, 
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

app.post('/api/sendReferralEmail', async (req, res) => {
  const { userId: employeeEmail, email: referralEmail, name: referralName } = req.body;
  console.log(employeeEmail);
  console.log(referralEmail);
  console.log(referralName);

  let mailOptions = {
    from: EMAIL_USER,
    to: referralEmail,
    subject: 'You have been referred!',
    text: `Hello ${referralName},\n\nYou have been referred for the Company.\n\nBest regards,\nManoj Kumar-HR,\nTata Power Company Limited.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send email');
  }
});

app.post('/api/sendReferralEmail1', async (req, res) => {
  const { userId: employeeEmail, email: referralEmail, name: referralName } = req.body;
  console.log(employeeEmail);
  console.log(referralEmail);
  console.log(referralName);

  let mailOptions = {
    from: EMAIL_USER,
    to: referralEmail,
    subject: 'Congratulations, You have been selected for the Company!',
    text: `Hello ${referralName},\n\nYou have been selected for the company.\n\nBest regards,\nManoj Kumar-HR,\nTata Power Company Limited.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send email');
  }
});

app.post('/logout', async (req, res) => {
  req.session.destroy ? req.session.destroy() : (req.user = null); 

  res.status(200).json({ message: 'Logged out successfully' });
  res.redirect('/'); 
});

app.get('/api/getAllReferrals', async (req, res) => {
  try {
    const referrals = await Referral.find();
    const trueVerdicts = await Verdict.find({ decisionMade: true });
    const trueVerdictSerialNumbers = new Set(trueVerdicts.map(verdict => verdict.contactno));
    const filteredReferrals = referrals.filter(referral => !trueVerdictSerialNumbers.has(referral.contact));

    res.status(200).json(filteredReferrals);
    console.log(filteredReferrals);
  } catch (error) {
    console.error('Error fetching referrals:', error);
    res.status(500).json({ message: 'Failed to fetch referrals', error });
  }
});

const verdictSchema = new mongoose.Schema({
  finalVerdict: String,
  serialNumber: Number,
  decisionMade: {
    type: Boolean,
    default: false
  },
 contactno:String,
 name:String,
});

const Verdict = mongoose.model('Verdict', verdictSchema);

module.exports = Verdict;

app.post('/save-referral-status', async (req, res) => {
  try {
    const { serialNumber, finalVerdict, decisionMade ,contactno,name} = req.body;

    console.log(finalVerdict);
    let verdict = await Verdict.findOne({ contactno });
    //  console.log(verdict.finalVerdict);
    //  console.log( verdict.decisionMade);
    //  console.log( verdict.contactno);
    if (!verdict) {
      verdict = new Verdict({ serialNumber, finalVerdict, decisionMade,contactno,name});
    } else {
      verdict.finalVerdict = finalVerdict;
      verdict.decisionMade = decisionMade;
      verdict.name=name;
    }
     
    await verdict.save();
    res.status(200).send('Referral status updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to save referral status');
  }
});

app.get('/api/get-all-referral-statuses', async (req, res) => {
  try {
    const allVerdicts = await Verdict.find({ decisionMade:'true' }) // Ensure .exec() is called
    res.status(200).json(allVerdicts);
    console.log(allVerdicts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch referral statuses', error });
  }
});

app.get('/api/check-contact/:contact', async (req, res) => {
  try {
    const { contact } = req.params;
    console.log(contact);
    const existingReferral = await Referral.findOne({ contact: contact });
    res.status(200).json(!!existingReferral);
  } catch (error) {
    console.error('Error checking contact number:', error);
    res.status(500).send('Error checking contact number');
  }
});
app.listen(port, (error) => {
  if (!error) console.log("Server Running on port " + port);
  else console.log("Error : ", error);
});
