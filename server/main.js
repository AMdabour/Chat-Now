const express = require('express');
const {makeRoutes} = require('./routes/index');
const cors = require('cors');
require('dotenv').config()

const app = express();
const port = process.env.PORT | 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
makeRoutes(app)

app.get('/', (req, res) => {
    res.send('Hello, World!');
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});
