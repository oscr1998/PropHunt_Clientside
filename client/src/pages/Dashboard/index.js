import { React, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import './styles.css';
import { Zoom, Flip } from 'react-reveal';
import { AnimatePresence } from "framer-motion";

//* Components
import { CreateGame } from '../../components';

//* Redux
import { useSelector, useDispatch } from "react-redux";
import { store_roomID, store_socket, update_players } from '../../actions/socket/socketSlice'

import axios from 'axios'

//! DEVELOPMENT ONLY
import io from 'socket.io-client';

export let socket
export let room
//! DEVELOPMENT ONLY

export default function Dashboard() {

    const navigate = useNavigate()
    const dispatch = useDispatch();

    const Flask_URI = useSelector(state => state.flask.URI)
    const isLogin = localStorage.getItem('isLogin');


    const [ createGameModel, setCreateGameModel ] = useState(false)
    const [ roomID, setRoomID ] = useState("123")
    const [ stats, setStats ] = useState("")

    useEffect(() => {
        console.log("ping!! do socket");
        if(isLogin === "false" || isLogin === null){
            navigate('/')
        } else if (isLogin == "true"){
            axios.post(`${Flask_URI}/login`, {
                username: localStorage.getItem('username'),
                password: localStorage.getItem('password'),
            })
            .then((res)=> {
                if(res.status === 200){
                    setStats(res.data)
                }
            })
            .catch((err) => {
                if(err.response.status === 400){
                    alert("Sorry, something bad happen. \nPlease re-login")
                    localStorage.setItem("isLogin", false)
                } else {
                    console.warn("Something wired at /login/catch");
                }
            });

        }
    },[])

    function handleJoinRoom(e){
        e.preventDefault();
        room = roomID
        socket.emit('join-room', roomID, msg => { 
            console.log(`ID(${msg.id}) has joined room(${msg.room})`);
            dispatch(store_roomID(roomID))
            navigate('/lobby')
        })
    }

    function handleLogout(){
        axios.get(`${Flask_URI}/logout`,{ withCredentials: true })
        .then((res) => {
            console.log(res);
        }).catch((err) => {
            console.warn(err);
        })
        localStorage.clear();
        navigate('/')
    }

    function playerType(wins, wins_as_hunter){
        let wins_as_seeker = wins - wins_as_hunter
        if (wins_as_seeker === wins_as_hunter){
            return "50/50"
        } else if (wins_as_seeker > wins_as_hunter){
            return "Seeker"
        } else if (wins_as_seeker < wins_as_hunter){
            return "Hunter"
        }
    }



    //! DEVELOPMENT ONLY
    useEffect(()=>{
        socket = io("http://localhost:3030/");
        socket.on('connect', () => { 
            console.log(socket.id);
            dispatch(store_socket(socket))
        })
        socket.on('update-room', (players) => {
            dispatch(update_players(players))
        })
    },[])
    //! DEVELOPMENT ONLY

    return (
        <Zoom><div id='dashboardContainer' className='loginContainer nes-container is-centered'>
            <button id='dashlougoutbtn' onClick={handleLogout}>Logout</button>
            <div id='dash1cont' style={{float:"left"}}>
            <div id='dashpart1'>
                <img id='h1dashboard' src={stats.avatar_url} placeholder="Player avatar" />
                <h1>{localStorage.getItem('username')}</h1>
            </div>
            <div id='dashpart2'>
                    <h2 style={{ "marginBottom": "3vh" }}>Stats</h2>
                    <h3>Wins: {stats.wins}</h3>
                    <h3>Win rate: {stats.games_played === 0? 0 : stats.wins / stats.games_played * 100}%</h3>
                    <h3>Played: {stats.games_played}</h3>
                    <h3>Best role: {playerType(stats.wins, stats.wins_as_hunter)}</h3>
                </div>
            </div>
            <div id='dash2cont' style={{float:"right"}}>
            <form onSubmit={handleJoinRoom}>
                <input id='roominput'
                    required
                    type="text"
                    placeholder='Room ID' 
                    value={roomID} 
                    onChange={(e) => setRoomID(e.target.value) } 
                />
                <br />
                <Flip><input className='joingamebtn nes-btn is-success' type="submit" value="Join Game" /></Flip>
            </form>
            <Flip><button className="nes-btn is-primary" onClick={() => setCreateGameModel(true)}>Create Game</button></Flip>
            </div>
            { createGameModel? <CreateGame  setCreateGameModel={setCreateGameModel}/> : null }
        </div></Zoom>
    )
}
