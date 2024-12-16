import nodemailer from 'nodemailer';
import Customer from '../models/customer.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendEmailOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token is missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const customer_email = decoded.email;

    const customer = await Customer.findOne({
      where: { email: customer_email },
    });
    console.log(customer.email);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const otp = generateOtp();

    const expiryTime = new Date(Date.now() + 10 * 60 * 1000);

    customer.email_otp = otp;
    customer.otp_expires_at = expiryTime;
    await customer.save();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Charudatta" <${process.env.SMTP_USER}>`,
      to: customer.email,
      subject: 'Your Email Verification Code',
      html: `<p>Your OTP for verifying your email address is:</p>
               <h1>${otp}</h1>
               <p>This OTP is valid for 10 minutes.</p>`,
    });

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Verify email address***********************
const verifyOtp = async (req, res) => {
  const { otp } = req.body;

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token is missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const customer_email = decoded.email;

    const customer = await Customer.findOne({
      where: { email: customer_email },
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (!customer.email_otp) {
      return res
        .status(400)
        .json({ message: 'OTP not generated for this email' });
    }

    const currentTime = new Date();
    if (currentTime > new Date(customer.otp_expires_at)) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    if (customer.email_otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    customer.email_verified = true;
    customer.email_otp = null;
    customer.otp_expires_at = null;
    await customer.save();

    res.status(200).json({ message: 'Email successfully verified' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { sendEmailOtp, verifyOtp };
