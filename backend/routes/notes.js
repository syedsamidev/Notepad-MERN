const express = require('express');
const router = express.Router();
const Notes = require("../models/Notes");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require('express-validator');

//-------------ROUTE - 1--------------
// Get All notes of the user using GET : "/api/notes/fetchallnotes".
router.get('/fetchallnotes',fetchuser, async (req, res)=>{
    try {
        const notes = await Notes.find({user : req.user.id});
        res.json(notes);

    } catch (error) {
        console.log(error);
        return res.status(500).send({error : "Internal server error"});
    }
});

//-------------ROUTE - 2--------------
//Add notes of user using POST : "/api/notes/addnotes".
router.post('/addnotes',fetchuser, [

    // title must be at least 3 chars long
    body('title','Enter a title of atleast 3 characters').isLength({ min: 3 }), 
    // description must be at least 5 chars long
    body('description','Enter description of atleast 5 chracters').isLength({ min: 5 }),] ,async (req, res)=>{

    // if there are errors, return them
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {title, description, tag} = req.body;
        const note = new Notes({
            title, description,tag, user : req.user.id
        })

        const savedNote = await note.save();
        res.json(savedNote);

        
    } catch (error) {
        console.log(error);
        return res.status(500).send({error : "Internal server error"});
    }
 
});

//-------------ROUTE - 3--------------
// Update Note of user using PUT : "/api/notes/updatenotes".
router.put('/updatenotes/:id',fetchuser, async (req, res)=>{

        const {title, description, tag} = req.body;

        try {
            const newNote = {};
            if(title){newNote.title = title}
            if(description){newNote.description = description}
            if(tag){newNote.tag = tag}

            let note = await Notes.findById(req.params.id);

            // If no notes are found
            if(!note){return res.status(404).send("Not found")}

            // If ids don't match
            if(note.user.toString() !== req.user.id){return res.status(404).send("Not Allowed")}

            //updating note
            note = await Notes.findByIdAndUpdate(req.params.id, {$set : newNote}, {new: true});
            res.json(note);
            
        } catch (error) {
            console.log(error);
            return res.status(500).send({error : "Internal server error"});
        }

});


//-------------ROUTE - 4--------------
// Delete Note of user using DELETE : "/api/notes/deletenotes".

router.delete('/deletenotes/:id',fetchuser, async (req, res)=>{

    try {
        let note = await Notes.findById(req.params.id);

        // If no notes are found
        if(!note){return res.status(404).send("Not found")}

        // If ids don't match
        if(note.user.toString() !== req.user.id){return res.status(404).send("Not Allowed")}

        //updating note
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({"Sucess": "Note has been deleted", note : note});
    } catch (error) {
        console.log(error);
        return res.status(500).send({error : "Internal server error"});
    }

});



module.exports = router;