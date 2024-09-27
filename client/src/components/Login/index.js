import { React, useEffect, useState } from 'react'
import './style.css'
import Flip from 'react-reveal/Flip'

//* Socket
import { store_socket } from '../../actions/socket/socketSlice'
import io from 'socket.io-client';

import axios from 'axios'

import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Login() {

    const navigate = useNavigate();
    const Flask_URI = useSelector(state => state.flask.URI)
    const isLogin = localStorage.getItem('isLogin');

    const [ loginErrMsg, setloginErrMsg ] = useState(null)
    const [ loginInfo, setLoginInfo ] = useState({
        username: "",
        password: "",
    })

    useEffect(()=>{
        if(isLogin == "true"){
            navigate('/dashboard')
        }
    }, [loginErrMsg])

    function handelLogin(e){
        e.preventDefault();
        axios.post(`${Flask_URI}/login`, {
            username: loginInfo.username,
            password: loginInfo.password,
        })
        .then((res)=> {
            if(res.status === 200){
                localStorage.setItem("isLogin", true)
                localStorage.setItem("username", loginInfo.username)
                localStorage.setItem("password", loginInfo.password)
                setloginErrMsg("")
            } else {
                console.warn("Something wired at login");
            }
        })
        .catch((err) => {
            if(err.response.status === 400){
                localStorage.setItem("isLogin", false)
                setloginErrMsg("Incorrect login details")
            } else {
                console.warn("Something wired at /login/catch");
            }
        });
    }

    return (
        <form onSubmit={handelLogin} className="nes-field">
            <h1>Login</h1>
            <br />
    
                <input 
                    required
                    type="text" 
                    placeholder='Username' 
                    value={loginInfo.username} 
                    onChange={(e) => { setLoginInfo({...loginInfo, username: e.target.value }) }}
                    className = "loginbutton nes-input usrNm"
                    id='loginInput'
                />

                <input 
                    required
                    type="password" 
                    placeholder='Password' 
                    value={loginInfo.password} 
                    onChange={(e) => { setLoginInfo({...loginInfo, password: e.target.value }) }} 
                    className = "nes-input usrNm"
                    id='passwordInput'
                />


                <h3 style={{"color": "#D04E3E"}}>{loginErrMsg}</h3>

            <Flip><input id='loginbtn' type="submit" value="Login" className='nes-btn is-success'/></Flip>
        </form>
    )
}
