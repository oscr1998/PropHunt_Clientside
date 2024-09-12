import { React, useState } from 'react'

// TODO: Make a CSS for this model:
//TODO     - position fixed (overlay the whole page)
//TODO     - grey background
//TODO     - white model in the middle of the page


export default function CreateGame({setCreateGameModel={setCreateGameModel}}) {

    const [createGameInfo, setCreateGameInfo] = useState({
        gameMode: "normal",
        roomSize: 2,
    })

    function handelCreateGame(e){
        e.preventDefault();
        //todo Send create game detail to backend
        //todo upon successful post request: 
        //todo      - render a msg: created
        //todo      - setCreateGameModel(false)
        //todo      - navigate('/lobby')
        //todo if failed:
        //todo      - render an error msg
    }
    
    return (
        <form onSubmit={handelCreateGame}>
            <div className='loginContainer nes-container is-centered'>
                <h1>Create Game</h1>
                <button 
                    onClick={() => {
                        setCreateGameModel(false)
                        return false
                    }}
                >x</button>
                
                {/* gamemode, roomsize, submitBtn */}
                <label>Game Mode: "this should be a select/option element"
                    <input 
                        required
                        type="text" 
                        placeholder='Game Mode' 
                        value={createGameInfo.gameMode} 
                        onChange={(e) => { setCreateGameInfo({...createGameInfo, gameMode: e.target.value }) }} 
                    />
                    <br />
                </label>

                <label>Room Size:
                    <input 
                        required
                        type="number" 
                        min={2}
                        max={5}
                        value={createGameInfo.roomSize} 
                        onChange={(e) => { setCreateGameInfo({...createGameInfo, roomSize: e.target.value }) }} 
                    />
                    <br />
                </label>

        </div>
        </form>
    )
}
