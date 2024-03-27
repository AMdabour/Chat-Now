const express = require('express');
const {router} = require('./routes/index');
const cors = require('cors');

const app = express();
const port = process.env.PORT | 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use('/auth', router);


app.get('/', (req, res) => {
    res.send('Hello, World!');
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});
