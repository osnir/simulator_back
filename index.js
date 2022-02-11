const express = require('express');
const cors = require('cors')
const routers = require('./src/routers');
const app = express();

require('dotenv').config();

app.use(express.json());
app.use(cors());
app.use(routers);


const protocol = process.env.PROTOCOL || 'http';
const ip   = require('ip').address();
const port = process.env.PORT || 3040;


app.listen(port, () => {
    console.log(`Server started in http://localhost:${port} or ${protocol}:${ip}:${port}`);
});