import { React, useState } from 'react'
import './style.css'
import Flip from 'react-reveal/Flip'
//* Socket
import { store_socket } from '../../actions/socket/socketSlice'
import io from 'socket.io-client';
const serverEP = "https://localhost:3030/";


export default function Login() {

    const [loginInfo, setLoginInfo] = useState({
        username: "",
        password: "",
    })

    function handelLogin(e){
        e.preventDefault();
        //todo Send login detail to backend
        //todo upon successful login: 
        //todo      - const socket = io(serverEP);
        //todo      - socket.on('connect', () => { dispatch(store_socket(socket)) })
        //todo      - navigate('/dashboard')
        //todo if failed:
        //todo      - render an error msg
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
                    className = "nes-input usrNm"
                />

            
                <input 
                    required
                    type="text" 
                    placeholder='Password' 
                    value={loginInfo.password} 
                    onChange={(e) => { setLoginInfo({...loginInfo, password: e.target.value }) }} 
                    className = "nes-input usrNm"
                />
                <br />

            <Flip><input id='loginbtn' type="submit" value="Login" className='nes-btn is-success'/></Flip>
        </form>
    )
}
