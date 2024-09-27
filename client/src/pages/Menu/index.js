import { React, useState, useEffect } from "react";
import { Login, Register, ForgotPwd, ResetPwd } from "../../components";
import { Link, useNavigate } from "react-router-dom";
import "./style.css";
import { Zoom, Flip } from "react-reveal";
// import Modal from '../../components/Modal';
import { AnimatePresence } from "framer-motion";

export default function Menu() {
  const [regOpen, setRegOpen] = useState(false);
  const closereg = () => setRegOpen(false);
  const openreg = () => setRegOpen(true);
  const [fpwdOpen, setfPwdOpen] = useState(false);
  const closefpwd = () => setfPwdOpen(false);
  const openfpwd = () => setfPwdOpen(true);
  const [rpwdOpen, setrPwdOpen] = useState(false);
  const closerpwd = () => setrPwdOpen(false);
  const openrpwd = () => setrPwdOpen(true);

  const navigate = useNavigate();
  const isLogin = localStorage.getItem("isLogin")

  useEffect(() => {
    if(isLogin){
      navigate('/dashboard')
    }
  },[isLogin])

  return (
    <div id="menuContainer">
      {/* <h1 id="h1menu">{"\"Revelio\""}</h1> */}
      <h1 id="h1menu">Revelio</h1>
      <Zoom>
        <div className="loginContainer nes-container is-centered">
          <Login />

          <Flip>
            <button
              id="registerbtn"
              onClick={() => (regOpen ? closereg() : openreg())}
              className="regbtn nes-btn is-primary"
            >
              Register
            </button>
          </Flip>

          <AnimatePresence
            initial={false}
            exitBeforeEnter={true}
            onExitComplete={() => null}
          >
            {regOpen && <Register regOpen={regOpen} handleClose={closereg} />}
          </AnimatePresence>

          <Flip>
            <Link id="leaderboardlink" to="/leaderboard">
              <button className="leaderboardbtn nes-btn">Leaderboard</button>
            </Link>
          </Flip>

          <div className="pwdcontainer">
            <Link
              className="pwdlink"
              onClick={() => (fpwdOpen ? closefpwd() : openfpwd())}
            >
              Forgot Password
            </Link>

            <AnimatePresence
              initial={false}
              exitBeforeEnter={true}
              onExitComplete={() => null}
            >
              {fpwdOpen && (
                <ForgotPwd fpwdOpen={fpwdOpen} handleClose={closefpwd} redirect={openrpwd}/>
              )}
            </AnimatePresence>

            <Link
              className="pwdlink"
              onClick={() => (rpwdOpen ? closerpwd() : openrpwd())}
            >
              Reset Password
            </Link>

            <AnimatePresence
              initial={false}
              exitBeforeEnter={true}
              onExitComplete={() => null}
            >
              {rpwdOpen && (
                <ResetPwd rpwdOpen={rpwdOpen} handleClose={closerpwd}/>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Zoom>
    </div>
  );
}
