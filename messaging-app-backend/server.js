import express from 'express'
import mongoose from 'mongoose'
import Cors from 'cors'
import Pusher from 'pusher'
import Messages from './dbMessages.js'

// App config
const app = express()
const port = process.env.PORT || 9000
const connection_url = "mongodb+srv://admin:VBGwyn*AYyaxUXKnJ@cluster0.x0czx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

// Middleware
app.use(express.json())
app.use(Cors())

// DB config
mongoose.connect(connection_url, async (err) => {
    if (err) throw err;
    console.log("Connected to db...")
})

const pusher = new Pusher({
    appId: "1290105",
    key: "6e9871ac51ee4c39104a",
    secret: "498c4a88d06b729aa3d4",
    cluster: "eu",
    useTLS: true
})
// API Endpoints
const db = mongoose.connection
db.once("open", () => {
    console.log("DB Connected")
    const msgCollection = db.collection("messagingmessages")
    const changeStream = msgCollection.watch()
    changeStream.on('change', change => {
        console.log(change)
        if (change.operationType === "insert") {
            const messageDetails = change.fullDocument
            pusher.trigger("messages", "inserted", {
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received
            })
        } else {
            console.log("Error trigerring Pusher")
        }
    })
})

app.get("/", (req, res) => res.status(200).send("Hello World!"))

app.post("/messages/new", (req, res) => {
    const dbMessage = req.body
    Messages.create(dbMessage, (err, data) => {
        if (err)
            res.status(500).send(err)
        else
            res.status(201).send(data)
    })
})

app.get("/messages/sync", (req, res) => {
    Messages.find((err, data) => {
        if (err)
            res.status(500).send(err)
        else
            res.status(201).send(data)
    })
})
// Listener
app.listen(port, () => console.log(`Listening on  localhost: ${port}`))