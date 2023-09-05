import noteContext from "./noteContext";
import { useState } from "react";

const NoteState=(props)=>{
    const host = 'http://localhost:5000';
    const initialNotes = [];

    const getAllNotes = async ()=>{
      //API CALL
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem("token")
        },
      });

      const json = await response.json();
      setNotes(json);

    }
    
    const [notes, setNotes] = useState(initialNotes);

    // Add a note
      const addNote= async (title, description, tag)=>{
          //API CALL
          const response = await fetch(`${host}/api/notes/addnotes`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
              'Content-Type': 'application/json',
              'auth-token': localStorage.getItem("token")
            },
            body: JSON.stringify({title, description, tag}) // body data type must match "Content-Type" header
          });
          const note = await response.json();
          setNotes(notes.concat(note));
      }

    // Delete a note
      const deleteNote= async (id)=>{
          //API CALL
          const response = await fetch(`${host}/api/notes/deletenotes/${id}`, {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
            headers: {
              'Content-Type': 'application/json',
              'auth-token':localStorage.getItem("token")
            }
          });
          const json = await response.json();

          const newNotes = notes.filter((note)=>{ return note._id !== id})
          setNotes(newNotes);
      }

    // Update a note
      const editNote= async (id, title, description, tag)=>{
          // API CALL
          const response = await fetch(`${host}/api/notes/updatenotes/${id}`, {
            method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            headers: {
              'Content-Type': 'application/json',
              'auth-token': localStorage.getItem("token")
            },
            body: JSON.stringify({title, description, tag}) // body data type must match "Content-Type" header
          });
          const json = await response.json();

          //Updating a note
          let newNotes = JSON.parse(JSON.stringify(notes))

          for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if(element._id === id){
              newNotes[index].title = title;
              newNotes[index].description = description;
              newNotes[index].tag = tag;
              break;
            }
          }
          setNotes(newNotes);
      }

    return(
        <noteContext.Provider value={{notes, addNote, deleteNote, editNote, getAllNotes}}>
            {props.children}
        </noteContext.Provider>

    )

}

export default NoteState;