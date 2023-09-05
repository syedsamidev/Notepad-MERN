import React , {useContext, useEffect, useRef, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import noteContext from '../context/notes/noteContext'
import Addnote from './Addnote';
import Notesitem from './Notesitem';

export default function Notes() {
  const context = useContext(noteContext);
  const {notes, getAllNotes, editNote} = context;

  const [note, setNote] = useState({id:"", utitle:"", udescription:"", utag:"" });
  const ref = useRef(null);
  const refClose = useRef(null);
  const navigate = useNavigate();

  useEffect(()=>{
    if(localStorage.getItem('token')){
      getAllNotes();
    } else{
      navigate("/login")
    }
    // eslint-disable-next-line
  },[])
    
    const handleClick=()=>{
        editNote(note.id, note.utitle, note.udescription, note.utag );
        refClose.current.click();
    }

    const onChange=(e)=>{
        setNote({...note,[e.target.name]: e.target.value})
    }

  const updateNote=(note)=>{
    ref.current.click();
    setNote({id: note._id, utitle: note.title, udescription: note.description, utag: note.tag});
  }

  return (
    <>
    <Addnote/>

    <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
      Launch demo modal
    </button>

    <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Update Note</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3 my-3">
                <label htmlFor="title" className="form-label">Title</label>
                <input type="text" className="form-control" id="utitle" name="utitle" value = {note.utitle} onChange={onChange} aria-describedby="emailHelp"/>
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <input type="text" className="form-control"  value = {note.udescription} id="udescription" name="udescription" onChange={onChange}/>
              </div>
              <div className="mb-3">
                <label htmlFor="tag" className="form-label">Tag</label>
                <input type="text" className="form-control"  id="utag" name="utag" value = {note.utag} onChange={onChange}/>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" ref={refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary" onClick={handleClick}>Update Note</button>
          </div>
        </div>
      </div>
    </div>

    <div className='row my-3'>
        <h1>Your Notes</h1>
        <div >{notes.length===0 && "You have not saved any notes "}</div>
        {notes.map((note)=>{
            return <Notesitem key={note._id} updateNote={updateNote} note = {note}/>
        })}
    </div>
    </>
  )
}
