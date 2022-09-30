const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const Note = require("../models/Note")
const fetchuser = require("../middleware/fetchuser")

//ROUTE 1: Get all the notes GET "/api/notes/getallnotes". login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


//ROUTE 2: Add a new note POST "/api/notes/addnote". login required
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


//ROUTE 3: Update a note PUT "/api/notes/updatenote". login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {

    const { title, description, tag } = req.body;

    try {
        // Storing new note
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // Find The note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") };

        // Check if User is same or not
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

//ROUTE 4: Delete a note delete "/api/notes/deletenote". login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
    try {

        // Find The note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") };

        // Check if User is same or not
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({"Success":"Note is deleted",note:note});

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router