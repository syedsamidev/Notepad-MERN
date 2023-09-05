import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import About from './Components/About';
import Home from './Components/Home';
import Navbar from './Components/Navbar';
import NoteState from './context/notes/NoteState';
import Login from './Components/Login';
import Signup from './Components/Signup';

function App() {
  return (
    <>
    <NoteState>
      <BrowserRouter>
        <Navbar/>
          <Routes>
            <Route exact path="/" element={<Home />}/>
            <Route exact path="/about"index element={<About />} />
            <Route exact path="/login" element={<Login />}/>
            <Route exact path="/signup" element={<Signup />}/>
          </Routes>
      </BrowserRouter>
    </NoteState>
    </>
  );
}

export default App;
