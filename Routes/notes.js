const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const Note = require("../models/Note")
const fetchuser = require("../middleware/fetchuser")

//ROUTE 1: Get all the notes GET "/api/auth/getallnotes". login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


//ROUTE 2: Add a new note POST "/api/auth/addnote". login required
router.post("/addnote", fetchuser, [
    body('title', "Enter a valid Title").isLength({ min: 3 }),
    body('description', "Descripton must be at least 5 characters").isLength({ min: 5 })
], async (req, res) => {

    try {
        const { title, description, tag } = req.body;
        // If there are errors, return bad requests and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Note({
            title, description, tag, user: req.user.id
        })

        const savedNote = await note.save()
        res.json(note);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


module.exports = router