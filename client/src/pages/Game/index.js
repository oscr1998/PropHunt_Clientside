import React, { useEffect, useState } from 'react'
import { config } from '../../game/index'
import { IonPhaser } from '@ion-phaser/react'
import { Bounce } from 'react-reveal'
import './style.css'

import { useSelector } from 'react-redux'
import { Results } from '../../components'

export default function Game() {

    const socket = useSelector(state => state.socket.socket)
    const [resultsModal, setResultsModal] = useState(false)
    const [results, setResults] = useState("KKKKKKKKKKKKKKKK")

    useEffect(() => {
        socket.on("results", results => {
            setResultsModal(true)
            setResults(results)
            console.log(results);
            //todo send results to backend
        })
    }, [])

    return (
        <div>
            <div id='gameContainer'>
                <Bounce top> <IonPhaser game={config} initialize={true} /> </Bounce>
            </div>
            {resultsModal? <Results handleClose={setResultsModal} results={results}/> : null}
        </div>

    )
}
