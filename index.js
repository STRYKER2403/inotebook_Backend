const connecToMongo = require("./db");
const express = require('express')
var cors = require('cors')

connecToMongo();

const app = express()
const port = 5000

// Middleware to remove cors error
app.use(cors())
// Middleware to use req.body
app.use(express.json()) 


// Available Routes
app.use("/api/auth",require("./Routes/auth"))
app.use("/api/notes",require("./Routes/notes"))

app.listen(port, () => {
  console.log(`iNotebook Backend listening on port ${port}`)
})