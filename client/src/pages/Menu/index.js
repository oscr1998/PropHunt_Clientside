import { React, useState } from 'react'
import { Login, Register } from '../../components'
import { Link } from 'react-router-dom';
import './style.css'
import { Zoom, Flip } from 'react-reveal';


export default function Menu() {

    const [ regModel, setRegModel ] = useState(false)

    return (
        <div id='menuContainer'>
        <h1 id='h1menu'>Logo</h1>
        <Zoom><div className='loginContainer nes-container is-centered'>
            
            <Login />

            <Flip><button id='joinbtn' onClick={() => setRegModel(true)} className="nes-btn is-primary">Register</button></Flip>
            {regModel? <Register  setRegModel={setRegModel}/> : null}
            
            <Flip><button className="nes-btn">
                <Link to='/leaderboard'>Leaderboard</Link>
            </button></Flip>
            
        </div>
        </Zoom>
        </div>
    )
}
