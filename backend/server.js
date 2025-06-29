import express from 'express';
/*we are using type: module hence we can use import or export 
but in case we use commonjs then we have to do this in 
const express = require('express'); 
*/
import dotenv from 'dotenv';
dotenv.config();
// as we cannot access jwsecretkey directly and therefore we need to import dotenv

import cookieParser from 'cookie-parser';
import cors from 'cors';

import connenctDB from './config/db.js';

import userRoutes from './Routes/userRoutes.js'
import taskRoutes from './Routes/taskRoutes.js'

dotenv.config();

const app = express();

const port = process.env.PORT || 5500;

connenctDB();
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5500',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api/users',userRoutes);
app.use('/api/tasks',taskRoutes);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
    
})
