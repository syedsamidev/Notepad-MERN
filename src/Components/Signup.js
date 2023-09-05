import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = () => {

  const [credentials, setCredentials] = useState({name:"",email: "", password: "",cpassword:""}) 
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
      e.preventDefault();
      const response = await fetch("http://localhost:5000/api/auth/createuser", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({name:credentials.name, email: credentials.email, password: credentials.password})
      });
      const json = await response.json();
      if (json.success){
          // Save the auth token and redirect
          localStorage.setItem('token', json.authToken); 
          navigate('/')
      }
      else{
          alert("Invalid credentials");
      }
  }

  const onChange = (e)=>{
      setCredentials({...credentials, [e.target.name]: e.target.value})
  }

  return (
    <div>
      <form className="container my-4" onSubmit={handleSubmit}>
        <h2>Create Account to use Notepad</h2>
        <div className="my-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" className="form-control" value={credentials.name} onChange={onChange} id="name" name="name" aria-describedby="emailHelp"  placeholder='Enter Your Full Name'/>
          </div>
          <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input type="email" className="form-control" value={credentials.email} onChange={onChange} id="email" name="email" aria-describedby="emailHelp"  placeholder='Enter Email' required/>
              <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" value={credentials.password} onChange={onChange} name="password" id="password" placeholder='Enter Password' required minLength={5}/>
          </div>
          <div className="mb-3">
              <label htmlFor="password" className="form-label">Confirm Password</label>
              <input type="password" className="form-control" value={credentials.cpassword} onChange={onChange} name="cpassword" id="cpassword" placeholder='Enter Password Again' required minLength={5}/>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default Signup
