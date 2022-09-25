const connecToMongo = require("./db");
const express = require('express')

connecToMongo();

const app = express()
const port = 3000

// Available Routes
app.use("/api/auth",require("./Routes/auth"))
app.use("/api/notes",require("./Routes/notes"))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})