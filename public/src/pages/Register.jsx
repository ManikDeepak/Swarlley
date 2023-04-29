import React,{useState,useEffect} from 'react'
import { Link,useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import Logo from '../assets/logo1.svg'
import {ToastContainer,toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { registerRoute } from '../utils/APIRoutes';

function Register() {
  const navigate = useNavigate()
  const handleSubmit = async(event) =>{
    event.preventDefault();
    if(handleValidation()){
      const {password,username,email} = value;
      const data = await axios.post(registerRoute,{
        username,
        email,
        password
      });
      console.log(data)
      if (data.data.status===false){
        toast.error(data.data.msg,toastOptions)
      }
      else{
        localStorage.setItem("Swarlley-user",JSON.stringify(data.data.user))
        navigate("/") 
      }
    }
  }
  useEffect(() => {
    if(localStorage.getItem('Swarlley')){
      navigate('/')
    }
  },[])

  const toastOptions={
    position:"bottom-right",
    autoClose:5000,
    pauseOnHover:true,
    draggable:true,
    theme:"dark"

  }
  const handleValidation = () =>{
    const {password,confirmPassword,username,email} = value;
    if (password!==confirmPassword){
      toast.error("Passwords do not match",toastOptions)
      return false
    }
    else if(username.length<3){
      toast.error('Username should be of more than 3 characters',toastOptions)
      return false
    }
    else if(email.length<3){
      toast.error("Please give a valid email address.",toastOptions)
      return false
    }else if(password.length<8){
      toast.error("Password must be of 8 or more characters.",toastOptions)
      return false
    } 
    return true
  }

  const[value,setValue] = useState({
    username:"",
    email:"",
    password:"",
    confirmPassword:""

  })
  const handleChange = (event) =>{
    setValue({...value,[event.target.name]:event.target.value})
  }

  return (
    <>
    <FormContainer>
      <form onSubmit={(event) => handleSubmit(event)}>
        <div className="brand">
          <img src={Logo} alt="" />
          <h1>Swarlley</h1>
        </div>
        <input type="text" placeholder='Username' name="username" onChange={(e)=>handleChange(e)}/>
        <input type="email" placeholder='Email' name="email" onChange={(e)=>handleChange(e)}/>
        <input type="password" placeholder='Password' name="password" onChange={(e)=>handleChange(e)}/>
        <input type="password" placeholder='Confirm Password' name="confirmPassword" onChange={(e)=>handleChange(e)}/>
        <button type="submit">Create User</button>
        <span>Already have an account? <Link to="/login"> Login</Link> </span>
      </form>
    </FormContainer>
    <ToastContainer/>
    </>
  )
}

const FormContainer = styled.div`
height:100vh;
width:100vw;
display:flex;
flex-direction:column;
justify-content:center;
gap:1rem;
align-items: center;
background-color:#131324;
.brand{
  display:flex;
  align-items:center;
  gap:1rem;
  justify-content:center;
  img{
    height:5rem;
  }
  h1{
    color:white;
    text-transform:uppercase;
  }
  
}
form{
  display:flex;
  flex-direction:column;
  gap:1.2rem;
  background-color:#00000075;
  border-radius:2rem;
  padding:3rem 5rem;
  input{
    background-color:transparent;
    position relative;
    padding:1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color:white;
    left:0%;
    width:100%;
    font-size:1rem;
    transition:0.3s ease-in;
    &:focus{
      border:0.1rem solid #997af0;
      outline:none;
      width:120%;
      left:-10%;
      transition:0.3s ease-in;
    }
  }
  button{
    background-color:#997af0;
    color:white;
    padding:1rem 2rem;
    border:none;
    font-weight:bold;
    cursor:pointer;
    border-radius:0.4rem;
    font-size:1rem;
    text-transform: uppercase;
    &:hover{
      background-color:#4e0eff;
    }
  }
  span{
    color:white;
    text-transform:uppercase;
    a{
      color:#4e0eff;
      text-decoration:none;
      font-weight:bold;
    }
  }

}
`;

export default Register