/* eslint-disable no-undef */

// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';

// dotenv.config();

// export const generateToken = (payload, duration) =>
//   jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: duration });

/* eslint-disable no-undef */

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
