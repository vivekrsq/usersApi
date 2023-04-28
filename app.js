const express = require('express')
const cors = require('cors');
const app = express()
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3001"
}))


//routes
const UserRoute = require("./routes/users");

const port = 3000

app.use('/uploads', express.static('uploads'));
// 4. Create an Express route to handle the request for retrieving documents.
app.use('/users', UserRoute);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})