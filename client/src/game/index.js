import Phaser from 'phaser';
import { socket, room } from '../pages/Dashboard/index'
import { default as controls } from './controls';

//* Assets
import TilesetFloor from './assets/level/TilesetFloor.png'
import TilesetWater from './assets/level/TilesetWater.png'
import TilesetFloorDetail from './assets/level/TilesetFloorDetail.png'
import TilesetNature from './assets/level/TilesetNature.png'
import TilesetHouse from './assets/level/TilesetHouse.png'
import TilesetReliefDetail from './assets/level/TilesetReliefDetail.png'
import jsonMap from './assets/level/level_map.json'

import ghost from '../components/images/ghost.png'
import fire from './assets/characters/fire1.png'
import ninja from './assets/characters/ninja.png'
import jsonMap2 from './assets/level2/level_map.json'

import gameMusic from './assets/audio/game_song.mp3'

export const propListSmall = [175, 176, 149, 132, 215, 202, 199]
export const propListLarge = [0, 1, 5, 6, 48, 49, 50]
// export const propListSmall =[176, 149, 132, 215, 202, 199
// export const propListLarge =[0, 1, 5, 6, 48, 49, 50]
class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene')
        this.cursors = null
        this.players = {
            // id1: { id: "", username: "", character: "", sprite: "", moved: false },
            // id2: { id: "", username: "", character: "", sprite: "", moved: false },
        }
        this.listOfPlayers = null
        this.listOfHiders = null
        this.listOfSeekers = null
        this.scaleSize = 2;
        this.Timer = 60;
    }

    preload() {
        // Assets
        this.load.image('codey', 'https://content.codecademy.com/courses/learn-phaser/physics/codey.png');
        this.load.image('bug', 'https://content.codecademy.com/courses/learn-phaser/physics/bug_1.png');
        this.load.image('ghost', ghost)
        // this.load.image('fire', fireGuy)
        this.textures.addBase64('fire', fire)
        this.textures.addBase64('ninja', ninja)
        this.load.spritesheet('natureSheet', TilesetNature, { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('natureSheetLarge', TilesetNature, { frameWidth: 32, frameHeight: 32 });
        // this.load.spritesheet('characters', TilesetNature, { frameWidth: 32, frameHeight: 32 } )

        //************background layer*********** //
        this.load.image('background', TilesetFloor)
        this.load.image('water', TilesetWater)

        //************decoration layer*********** //
        this.textures.addBase64('floor', TilesetFloorDetail)

        //************blocked layer*********** //
        this.load.image('nature', TilesetNature)
        this.load.image('house', TilesetHouse)
        this.textures.addBase64('mine', TilesetReliefDetail)
        this.load.tilemapTiledJSON('map', jsonMap);
        this.load.tilemapTiledJSON('map2', jsonMap2)

        this.load.audio('gameMusic', gameMusic)

        socket.on('update-client', players_server => {

            Object.keys(players_server).forEach(id => {

                // Initialisation of the local players list
                if (!this.players[id]) {
                    this.players[id] = players_server[id]
                } else {
                    // If the list already exists locally, update players list, expect the sprite
                    this.players[id] = { ...players_server[id], sprite: this.players[id].sprite }
                    if(id !== socket.id) {
                        // Update others player's live coords
                        this.players[id].sprite.x = players_server[id].x
                        this.players[id].sprite.y = players_server[id].y
                    }
                }

            })
        })
        socket.emit("in-game", room)
    }

    create() {
        this.createMap();
        this.gameMusic = this.sound.add('gameMusic')
        this.gameMusic.play({
            mute: false,
            volume: 0.01,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        });
        
        // Initialsed Controls
        this.cursors = this.input.keyboard.createCursorKeys();

        // Grab all players ID in an arrary -> ["id1", "id2"]
        this.listOfPlayers = Object.keys(this.players)

        this.timeMessage = this.add.text(this.cameras.main.height, 0, "Timer: " + this.Timer, { fontSize: "32px", align: 'right' }).setScrollFactor(0);
        this.countdown = this.time.addEvent({
            delay: 1000, //calls reduceTime every 1 second
            callback: this.reduceTime,
            callbackScope: this,
            repeat: -1,
        });

        // Add sprites for every player depends on their character type
        this.listOfPlayers.forEach(id => {
            if (this.players[id].character === "seeker") {
                this.players[id] = { ...this.players[id], sprite: this.physics.add.sprite(this.players[id].x, this.players[id].y, 'fire').setSize(16,24)}
                // players[id].sprite.setScale(this.scaleSize)
            } else {
                this.players[id] = { ...this.players[id], sprite: this.physics.add.sprite(this.players[id].x, this.players[id].y, 'ninja').setScale(1.5)}
            }
            this.players[id].sprite.setCollideWorldBounds(true);
            this.players[id].sprite.body.immovable = true
            //this.physics.add.collider(this.blockedLayer, this.players[id].sprite)
            this.physics.add.collider(this.blockedLayer2, this.players[id].sprite)
        })


        // this.listOfPlayers.forEach(id => {
        //     if (!players[id].character === "seeker") {
        //         players[id] = { ...players[id], isAlive: true }
        //     }
        // })

        this.cameras.main.startFollow(this.players[socket.id].sprite);

        // Set collision for every player
        this.listOfHiders = Object.values(this.players).filter(p => p.character === "hider")
        this.listOfSeekers = Object.values(this.players).filter(p => p.character === "seeker")
        this.listOfSeekers.forEach(S => {
            this.listOfHiders.forEach(H => {
                this.physics.add.collider(S.sprite, H.sprite, () => {
                    if( H.isAlive === true){
                        socket.emit('killed', room, H.id )
                    }
                })
            })
        })


        // Debugging
        this.debug("create")
    }

    reduceTime() {
        this.Timer -= 1;
        this.timeMessage.setText("Timer: " + this.Timer);        
    }

    update(time, delta) {
        // Controls
        controls(this.cursors, this.players[socket.id], this.players[socket.id].velocity, this.players[socket.id].character, this.players[socket.id].isAlive, time)

        // update movement if Moved
        if (this.players[socket.id].moved) {
            socket.emit('moved', {
                x: this.players[socket.id].sprite.x,
                y: this.players[socket.id].sprite.y
            }, room)
        }

        // update Texture if Dead or Space pressed
        this.listOfPlayers.forEach(id => {
            if (this.players[id].isAlive === false) {
                this.players[id].sprite.setTexture('ghost').setScale(0.08).setOrigin(0.5).setAlpha(0.5).setSize(16, 16)
            }
            if (this.players[id].propIndices !== null) {
                if (this.players[id].propIndices[0] === 1) {
                    this.players[id].sprite.setTexture("natureSheetLarge", propListLarge[this.players[id].propIndices[1]]).setScale(2).setSize(32, 32)
                } else {
                    this.players[id].sprite.setTexture("natureSheet", propListSmall[this.players[id].propIndices[1]]).setScale(2).setSize(16, 16)
                }
            }
            
        })

        //* Check end game condition
        // Time's up, zero hiders survivors

        if (this.Timer <= 0 || Object.values(this.players).filter(p => p.character === "hider" && p.isAlive === true).length === 0) {
            let results = this.Timer <= 0 ? "Hider" : "Seeker"
            this.countdown.destroy();
            this.gameMusic.stop();
            this.game.destroy();
            socket.emit("endGame", room, results)

        }
        


        this.debug("update", delta, this.players[socket.id].sprite.body.speed)
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

    // createMap() {

    //     //create tile map 
    //     // this.add.image(0, 0, "background")
    //     this.levelMap = this.make.tilemap({ key: 'map' });

    //     /**
    //      * add tileset image to map 
    //      * first arg name in json. 2nd arg name in this.load.image
    //     **/

    //     //adding tileset for background layer
    //     this.tiles = this.levelMap.addTilesetImage('TilesetFloor', 'background')
    //     this.waterTiles = this.levelMap.addTilesetImage('TilesetWater', 'water')

    //     //adding tileset for blocked layer
    //     // this.blockedTiles = this.map.addTilesetImage('TilesetFloor', 'borders')
    //     this.nature = this.levelMap.addTilesetImage('TilesetNature', 'nature')
    //     this.house = this.levelMap.addTilesetImage('TilesetHouse', 'house')
    //     this.mine = this.levelMap.addTilesetImage('TilesetReliefDetail', 'mine')

    //     //adding tileset for decoration layer
    //     this.floorDetailTiles = this.levelMap.addTilesetImage('TilesetFloorDetail', 'floor')
    //     //this.seaTiles = this.map.addTilesetImage('TilesetWater', 'water')


    //     //first arg = layer name on tiled 
    //     this.backgroundLayer = this.levelMap.createLayer('background', [this.waterTiles, this.tiles])
    //     this.blockedLayer = this.levelMap.createLayer('blocked', [this.nature, this.house, this.mine, this.waterTiles])
    //     this.decorationLayer = this.levelMap.createLayer('background_decorations', [this.floorDetailTiles, this.seaTiles, this.house, this.waterTiles, this.nature])

    //     //add collisions for blocked layer
    //     this.blockedLayer.setCollisionByExclusion([-1]);

    //     //scaling map 
    //     this.backgroundLayer.setScale(this.scaleSize)
    //     this.decorationLayer.setScale(this.scaleSize)
    //     this.blockedLayer.setScale(this.scaleSize)

    //     //update world bounds
    //     this.physics.world.bounds.width = this.levelMap.widthInPixels * this.scaleSize;
    //     this.physics.world.bounds.height = this.levelMap.heightInPixels * this.scaleSize;

    //     // limit the camera to the size of our map
    //     this.cameras.main.setBounds(0, 0,
    //         this.levelMap.widthInPixels * this.scaleSize,
    //         this.levelMap.heightInPixels * this.scaleSize
    //     );
    // }

    createMap() {
        this.levelMap2 = this.make.tilemap({ key: 'map2' });

        this.tiles2 = this.levelMap2.addTilesetImage('TilesetFloor', 'background')
        this.waterTiles2 = this.levelMap2.addTilesetImage('TilesetWater', 'water')
        this.nature2 = this.levelMap2.addTilesetImage('TilesetNature', 'nature')
        this.house2 = this.levelMap2.addTilesetImage('TilesetHouse', 'house')

        //first arg = layer name on tiled 
        this.backgroundLayer2 = this.levelMap2.createLayer('background', [this.tiles2, this.waterTiles2, this.nature2, this.house2])
        this.blockedLayer2 = this.levelMap2.createLayer('blocked', [this.tiles2, this.waterTiles2, this.nature2, this.house2])
        this.decorationLayer2 = this.levelMap2.createLayer('background_decorations', [this.tiles2, this.waterTiles2, this.nature2, this.house2])

        this.blockedLayer2.setCollisionByExclusion([-1]);


         //scaling map 
        this.backgroundLayer2.setScale(this.scaleSize)
        this.decorationLayer2.setScale(this.scaleSize)
        this.blockedLayer2.setScale(this.scaleSize)

        //update world bounds
        this.physics.world.bounds.width = this.levelMap2.widthInPixels * this.scaleSize;
        this.physics.world.bounds.height = this.levelMap2.heightInPixels * this.scaleSize;

        this.cameras.main.setBounds(0, 0,
            this.levelMap2.widthInPixels * this.scaleSize,
            this.levelMap2.heightInPixels * this.scaleSize
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
            debug: false
        }
    },
    pixelArt: true,
    roundPixels: true,
    scene: [GameScene]
}
