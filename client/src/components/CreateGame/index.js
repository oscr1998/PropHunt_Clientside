import { React, useState } from "react";
import { motion } from "framer-motion";
import Backdrop from "../Backdrop";
import "./style.css";

const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
  },
};

export default function CreateGame({
  handleClose,
  setCreateGameModel = { setCreateGameModel },
}) {
  const [createGameInfo, setCreateGameInfo] = useState({
    gameMode: "normal",
    roomSize: 2,
  });

  function handelCreateGame(e) {
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
    <form id="createForm" onSubmit={handelCreateGame}>
      <Backdrop onClick={handleClose}>
        <motion.div
          onClick={(e) => e.stopPropagation()}
          variants={dropIn}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="loginContainer createpopup nes-container is-centered">
            <button
              onClick={() => {
                setCreateGameModel(false);
                return false;
              }}
            >x</button>
            <br />
            
            <h1>Create Game</h1>

            {/* gamemode, roomsize, submitBtn */}
            <label id="maplabel">
              <div class="nes-select is-dark">
                <select
                  required
                  id="dark_select"
                  value={createGameInfo.gameMode}
                  onChange={(e) => {
                    setCreateGameInfo({
                      ...createGameInfo,
                      gameMode: e.target.value,
                    });
                  }}
                >
                  <option value="0">Select Map</option>
                  <option value="1">Skidrow</option>
                  <option value="2">Skull Island</option>
                </select>

                {/* <input
                  value={createGameInfo.gameMode}
                  onChange={(e) => {
                    setCreateGameInfo({
                      ...createGameInfo,
                      gameMode: e.target.value,
                    });
                  }}
                /> */}
                <br />
              </div>
            </label>

                <label id="gamemodelabel">
            <div class="nes-select is-dark">
                <select
                  required
                  id="dark_select"
                  value={createGameInfo.gameMode}
                  onChange={(e) => {
                    setCreateGameInfo({
                      ...createGameInfo,
                      gameMode: e.target.value,
                    });
                  }}
                >
                  <option value="0">Select Game Mode</option>
                  <option value="1">Game Mode 2</option>
                  <option value="0">Game Mode 3</option>
                </select>

                {/* <input
                  value={createGameInfo.gameMode}
                  onChange={(e) => {
                    setCreateGameInfo({
                      ...createGameInfo,
                      gameMode: e.target.value,
                    });
                  }}
                /> */}
                <br />
              </div>
            </label>

            <label>
              Room Size:
              <input
                className="createroomsize"
                required
                type="number"
                min={2}
                max={5}
                value={createGameInfo.roomSize}
                onChange={(e) => {
                  setCreateGameInfo({
                    ...createGameInfo,
                    roomSize: e.target.value,
                  });
                }}
              />
              <br />
            </label>
          </div>
        </motion.div>
      </Backdrop>
    </form>
  );
}
