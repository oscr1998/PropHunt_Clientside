import Phaser from 'phaser';

import ghost from '../components/images/ghost.png'

import TilesetFloor from './assets/level/TilesetFloor.png'
import TilesetWater from './assets/level/TilesetWater.png'
// import TilesetFloorDetail from './assets/level/TilesetFloorDetail.png'
import TilesetNature from './assets/level/TilesetNature.png'
import TilesetHouse from './assets/level/TilesetHouse.png'
// import TilesetReliefDetail from './assets/level/TilesetReliefDetail.png'
import jsonMap from './assets/level/level_map.json'

import { socket, room } from '../pages/Dashboard/index'
import { default as controls } from './controls';

const players = {
    // id1: { id: "", username: "", character: "", sprite: "", moved: false },
    // id2: { id: "", username: "", character: "", sprite: "", moved: false },
}

let seeker = [];
let hider = [];

export const propListSmall =[176, 149, 132]
export const propListLarge =[0, 1, 33, 50]

let listOfPlayers;
const gameState = {
    cursors: "",
}

export let props = ["basket", "branch", "flower", "loghouse", "rocks", "smallstump", "stump", "tree", "tree2"]


class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene')
    }
    init() {
        this.scaleSize = 2;
        this.Timer = 10;
        console.log("init file", this.scaleSize)
    }

    preload() {
        // Assets
        this.load.image('codey', 'https://content.codecademy.com/courses/learn-phaser/physics/codey.png');
        this.load.image('bug', 'https://content.codecademy.com/courses/learn-phaser/physics/bug_1.png');
        this.load.image('ghost', ghost)


        this.load.spritesheet('natureSheet', TilesetNature, { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('natureSheetLarge', TilesetNature, { frameWidth: 32, frameHeight: 32 });
        // props.forEach(p => {
        //     this.load.image(`${p}_prop`, `${p}.png`)
        // })
        // this.load.spritesheet('characters', TilesetNature, { frameWidth: 32, frameHeight: 32 } )


        //************background layer*********** //
        this.load.image('background', TilesetFloor)
        this.load.image('water', TilesetWater)

        //************decoration layer*********** //
        // this.load.image('floor', TilesetFloorDetail)


        //************blocked layer*********** //
        this.load.image('nature', TilesetNature)
        this.load.image('house', TilesetHouse)
        // this.load.image('mine', TilesetReliefDetail)
        this.load.tilemapTiledJSON('map', jsonMap);


        console.log("preload: ", players);

        socket.on('update-client', players_server => {

            Object.keys(players_server).forEach(id => {

                // If sprite is not created locally
                if (!players[id]) {
                    console.log("init");
                    // copy the list
                    players[id] = players_server[id]

                } else if (id !== socket.id) {
                    // console.log("player_Server", players_server[id]);
                    // update player coords
                    players[id].sprite.x = players_server[id].x
                    players[id].sprite.y = players_server[id].y
                    players[id].isAlive = players_server[id].isAlive
                    players[id].propIndices = players_server[id].propIndices
                    
                    // players[id] = players_server[id]
                } else if (id !== socket.id) {
                    // update whatever you want

                }
            })
        })
        socket.emit("in-game", room)

    }

    create() {
        console.log("ACCESSED #################")
        this.createMap();
        listOfPlayers = Object.keys(players) //["id1", "id2"]



        this.timeMessage = this.add.text(800, 0, "Timer: " + this.Timer, { fontSize: "32px", align: 'right' }).setScrollFactor(0);



        this.countdown = this.time.addEvent({
            delay: 1000, //calls reduceTime every 1 second
            callback: this.reduceTime,
            callbackScope: this,
            repeat: -1,
        });

        listOfPlayers.forEach(id => {
            if (players[id].character === "seeker") {
                players[id] = { ...players[id], sprite: this.physics.add.sprite(players[id].x, players[id].y, 'bug') }
                // players[id].sprite.setScale(this.scaleSize)
            } else {
                players[id] = { ...players[id], sprite: this.physics.add.sprite(players[id].x, players[id].y, 'codey') }

            }

            players[id].sprite.setCollideWorldBounds(true);
            players[id].sprite.body.immovable = true
            this.physics.add.collider(this.blockedLayer, players[id].sprite)
        })


        listOfPlayers.forEach(id => {
            if (!players[id].character === "seeker") {
                players[id] = { ...players[id], isAlive: true }
            }
        })

        this.cameras.main.startFollow(players[socket.id].sprite);

        const listOfHiders = Object.values(players).filter(p => p.character !== "seeker")
        const listOfSeekers = Object.values(players).filter(p => p.character !== "hider")
        console.log("listOfHiders", listOfHiders)
        console.log("listOfSeekers", listOfSeekers)
        listOfHiders.forEach(id => {
            this.physics.add.collider(listOfSeekers[0].sprite, id.sprite, function () {
                console.log("Collision detected")
                id.isAlive = false
            })
        })

        // console.log("hider", hider)
        // console.log("seeker", seeker)

        // Debugging
        this.debug("create")
        // Initialsed Controls
        gameState.cursors = this.input.keyboard.createCursorKeys();
    }

    reduceTime() {
        this.Timer -= 1;
        this.timeMessage.setText("Timer: " + this.Timer);
        console.log(this.Timer)
        if (this.Timer <= 0) {
            //stop game and move to next scene
            this.countdown.destroy();

        }
    }


    update(time, delta) {
        // Controls



        controls(gameState.cursors, players[socket.id], 350, players[socket.id].character, players[socket.id].isAlive)


        if (players[socket.id].moved) {
            socket.emit('moved', {
                x: players[socket.id].sprite.x,
                y: players[socket.id].sprite.y
            }, room)
        }

        if (players[socket.id].isAlive === false) {
            console.log("you are dead")
            socket.emit('killed', room)
        }

        listOfPlayers.forEach(id => {
            if (players[id].isAlive === false) {
                players[id].sprite.setTexture('ghost').setScale(0.1).setOrigin(0.5)
            }
            
            if(players[id].propIndices !== null){
                if(players[id].propIndices[0] === 1){
                    players[id].sprite.setTexture("natureSheetLarge", propListLarge[players[id].propIndices[1]]).setScale(2).setSize(32, 32)
                }else{
                    players[id].sprite.setTexture("natureSheet", propListSmall[players[id].propIndices[1]]).setScale(2).setSize(16, 16)
                }
            }
            
        })


        // console.log("character", players[socket.id].character)

        // if( players[socket.id].character === "seeker"){

        // }


        this.debug("update", delta, players[socket.id].sprite.body.speed)
    }

    debug(mode, delta = 0.1, velocity = 0) {
        switch (mode) {
            case "create":
                this.FPS = this.add.text(0, 0, "FPS", { fontSize: '15px' })
                this.speed = this.add.text(0, 20, "speed", { fontSize: '15px' })
                break;
            case "update":
                this.FPS.setText(`FPS: ${Math.floor(1000 / delta)}`)
                this.speed.setText(`${velocity}`)
                break;
            default: return false
        }
    }

    createMap() {

        //create tile map 
        // this.add.image(0, 0, "background")
        this.levelMap = this.make.tilemap({ key: 'map' });

        /**
         * add tileset image to map 
         * first arg name in json. 2nd arg name in this.load.image
        **/

        //adding tileset for background layer
        this.tiles = this.levelMap.addTilesetImage('TilesetFloor', 'background')
        this.waterTiles = this.levelMap.addTilesetImage('TilesetWater', 'water')

        //adding tileset for blocked layer
        // this.blockedTiles = this.map.addTilesetImage('TilesetFloor', 'borders')
        this.nature = this.levelMap.addTilesetImage('TilesetNature', 'nature')
        this.house = this.levelMap.addTilesetImage('TilesetHouse', 'house')
        this.mine = this.levelMap.addTilesetImage('TilesetReliefDetail', 'mine')

        //adding tileset for decoration layer
        this.floorDetailTiles = this.levelMap.addTilesetImage('TilesetFloorDetail', 'floor')
        //this.seaTiles = this.map.addTilesetImage('TilesetWater', 'water')


        //first arg = layer name on tiled 
        this.backgroundLayer = this.levelMap.createLayer('background', [this.waterTiles, this.tiles])
        this.blockedLayer = this.levelMap.createLayer('blocked', [this.nature, this.house, this.mine, this.waterTiles])
        this.decorationLayer = this.levelMap.createLayer('background_decorations', [this.floorDetailTiles, this.seaTiles, this.house, this.waterTiles, this.nature])

        //add collisions for blocked layer
        this.blockedLayer.setCollisionByExclusion([-1]);

        //scaling map 

        this.backgroundLayer.setScale(this.scaleSize)
        this.decorationLayer.setScale(this.scaleSize)
        this.blockedLayer.setScale(this.scaleSize)


        //update world bounds
        this.physics.world.bounds.width = this.levelMap.widthInPixels * this.scaleSize;
        this.physics.world.bounds.height = this.levelMap.heightInPixels * this.scaleSize;

        // limit the camera to the size of our map
        this.cameras.main.setBounds(0, 0,
            this.levelMap.widthInPixels * this.scaleSize,
            this.levelMap.heightInPixels * this.scaleSize
        );
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
            debug: true
        }
    },
    pixelArt: true,
    roundPixels: true,
    scene: [GameScene]
}
