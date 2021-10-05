require('dotenv').config();


const express = require('express');
const cors = require('cors')


const authRouter = require('./route/auth');
const postRouter = require('./route/post');


const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mern_app');
        console.log('Database connected')
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);

app.get('/', (req, res) => res.send('Hello World'));


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));