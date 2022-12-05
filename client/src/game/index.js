import Phaser from 'phaser';

// import { useSelector, useDispatch } from "react-redux";
// const socket = useSelector(state => state.socket.socket)

import { socket } from '../pages/Dashboard/index'

const players = {
    // id1: { id: "", username: "", character: "", sprite: "", moved: false },
    // id2: { id: "", username: "", character: "", sprite: "", moved: false },
}


const gameState = {
    cursors: "",
}

class GameScene extends Phaser.Scene {
    constructor(){
        super('GameScene')
    }

    preload(){
        // Assets
        this.load.image('codey', 'https://content.codecademy.com/courses/learn-phaser/physics/codey.png');
        this.load.image('bug', 'https://content.codecademy.com/courses/learn-phaser/physics/bug_1.png');

        console.log("preload: ", players);

        socket.on('update-client', players_server => {

            Object.keys(players_server).forEach(id => {

                // If sprite is not created locally
                if(!players[id]){
                    console.log("init");
                    // copy the list
                    players[id] = players_server[id]
                } else if (id !== socket.id){
                    console.log("moving");
                    // update player coords
                    players[id].sprite.x = players_server[id].x
                    players[id].sprite.y = players_server[id].y
                }
            })
        })
        socket.emit("in-game")
    }

    create(){

        const listOfPlayers = Object.keys(players) //["id1", "id2"]

        listOfPlayers.forEach(id => {
            if(players[id].character === "seeker" ){
                players[id] = { ...players[id], sprite: this.physics.add.sprite(players[id].x, players[id].y, 'bug') }
            } else {
                players[id] = { ...players[id], sprite: this.physics.add.sprite(players[id].x, players[id].y, 'codey') }
            }
            players[id].sprite.setCollideWorldBounds(true);
        })

        // Initialsed Controls
        gameState.cursors = this.input.keyboard.createCursorKeys();

        // Debugging
        this.debug("create")
    }

    update(time, delta){
        // Controls
        if (gameState.cursors.right.isDown) {
            players[socket.id].sprite.setVelocity(350, 0);
            players[socket.id].moved = true;
        } 
        if (gameState.cursors.left.isDown) {
            players[socket.id].sprite.setVelocity(-350, 0);
            players[socket.id].moved = true;
        } 
        if (gameState.cursors.up.isDown) {
            players[socket.id].sprite.setVelocity(0, -350);
            players[socket.id].moved = true;
        } 
        if (gameState.cursors.down.isDown) {
            players[socket.id].sprite.setVelocity(0, 350);
            players[socket.id].moved = true;
        } 

        if (gameState.cursors.right.isDown && gameState.cursors.up.isDown) {
            players[socket.id].sprite.setVelocity(Math.sqrt((350**2)/2), -Math.sqrt((350**2)/2));
            players[socket.id].moved = true;
        } 
        if (gameState.cursors.right.isDown && gameState.cursors.down.isDown) {
            players[socket.id].sprite.setVelocity(Math.sqrt((350**2)/2), Math.sqrt((350**2)/2));
            players[socket.id].moved = true;
        } 
        if (gameState.cursors.left.isDown && gameState.cursors.up.isDown) {
            players[socket.id].sprite.setVelocity(-Math.sqrt((350**2)/2), -Math.sqrt((350**2)/2));
            players[socket.id].moved = true;
        } 
        if (gameState.cursors.left.isDown && gameState.cursors.down.isDown) {
            players[socket.id].sprite.setVelocity(-Math.sqrt((350**2)/2), Math.sqrt((350**2)/2));
            players[socket.id].moved = true;
        } 
        if (gameState.cursors.up.isUp && gameState.cursors.down.isUp && gameState.cursors.left.isUp && gameState.cursors.right.isUp){
            players[socket.id].sprite.setVelocity(0, 0);
            players[socket.id].moved = false;
        }
        if (gameState.cursors.space.isDown) {
            players[socket.id].sprite.x = 500;
            players[socket.id].sprite.y = 400;
            players[socket.id].moved = true;
        }

        if (players[socket.id].moved){
            socket.emit('moved', {
                x: players[socket.id].sprite.x,
                y: players[socket.id].sprite.y 
            })
        }

        this.debug("update", delta, players[socket.id].sprite.body.speed)
    }

    debug(mode, delta = 0.1, velocity=0){
        switch(mode){
            case "create":
                this.FPS = this.add.text(0, 0, "FPS", { fontSize: '15px' })
                this.speed = this.add.text(0, 20, "speed", { fontSize: '15px' })
                break;
            case "update":
                this.FPS.setText(`FPS: ${Math.floor(1000/delta)}`)
                this.speed.setText(`${velocity}`)
                break;
        }
    }

}

export const config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 800,
    backgroundColor: "131313",
    physics: {
        default: 'arcade',
        arcade: {
        gravity: { y: 0 },
        enableBody: true,
        }
    },
    scene: [GameScene]
}
