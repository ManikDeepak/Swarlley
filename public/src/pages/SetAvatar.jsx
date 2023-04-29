import React,{useState,useEffect} from 'react'
import {useNavigate } from 'react-router-dom';
import styled from 'styled-components'
import Loader from '../assets/loader.gif'
import {ToastContainer,toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { setAvatarRoute } from '../utils/APIRoutes';
import {Buffer} from 'buffer'

function SetAvatar() {
    const api = "http://api.multiavatar.com/12345678";
    const navigate = useNavigate()
    const [avatars,setAvatar] = useState([]);
    const [isLoading,setIsloading] = useState(true);
    const [selectedAvatar,setSeletectedAvatar] = useState(undefined)

    const toastOptions={
    position:"bottom-right",
    autoClose:5000,
    pauseOnHover:true,
    draggable:true,
    theme:"dark"

  }
    useEffect(() => {
    if(!localStorage.getItem('Swarlley')){
      navigate('/login')
    }
  },[])

  const fetchData = async () =>{
    const data = []
    for (let i=0;i<4;i++){
    const image = await axios.get(
            `${api}/${Math.round(Math.random()*1000)}`
        )
        const buffer = new Buffer(image.data)
        data.push(buffer.toString("base64"))
    }
    setAvatar(data)
    setIsloading(false)
  }

  const setProfilePicture = async () => {
    if(selectedAvatar === undefined){
        toast.error("Please select an Avatar",toastOptions)
    }else{
        const user = await JSON.parse(localStorage.getItem("Swarlley"))
        const {data} = await axios.post(`${setAvatarRoute}/${user._id}`,{
            image:avatars[selectedAvatar]
        })
        
        if(data.isSet){
            user.isAvatarImageSet = true;
            user.avatarImage = data.image;
            localStorage.setItem("Swarlley",JSON.stringify(user))
            navigate('/')
        }else{
            toast.error("Error setting avatar. Please try again",toastOptions)
        }
    }
  };
  useEffect( () =>{
    fetchData()
  },[])

  return (
    <>
    {
        isLoading ? <Container>
            <img src={Loader} alt="loader" className='loader' />
        </Container> :
    <Container>
    <div className="title-container">
        <h1>Pick an Avatar as your profile picture.</h1>
    </div>
    <div className="avatars">
    {avatars.map((avatar,index)=>{
        return (
            <div
            key={index}
            className={`avatar ${selectedAvatar === index?"selected":""}`}>
                <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" 
                onClick={() => setSeletectedAvatar(index)} />
            </div>
        )
    })}
    </div>
    <button className='submit-btn' onClick={() => setProfilePicture()}> Set as Profile Picture</button>
    </Container>
}
    <ToastContainer/>
    </>
  )
}


const Container = styled.div`
display:flex;
align-items:center;
justify-content:center;
flex-direction:column;
gap:3rem;
background-color:#131324;
height:100vh;
width:100vw;
.loader{
    max-inline-size:100%;
}
.title-container{
    h1{
        color:white;

    }
    }
    .avatars{
        display:flex;
        gap:2rem;
        .avatar{
            display:flex;
            flex-direction:column;
            border: 0.4rem solid transparent;
            padding:0.4rem;
            border-radius:5rem;
            display:flex;
            justify-content:center;
            align-items:center;
            transition: 0.2s ease-in-out;
            cursor:pointer;
            img{
                height:6rem;
            }
        }
        .selected{
            border: 0.4rem solid #4e0eff;

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
`

export default SetAvatar