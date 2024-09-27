import { React, useState } from "react";
import { motion } from "framer-motion";
import Backdrop from "../Backdrop";
import './style.css'
import { useSelector } from "react-redux";
import axios from 'axios'

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

export default function ForgotPwd({ handleClose, redirect }) {

  const Flask_URI = useSelector(state => state.flask.URI)
  const [errMsg, setErrMsg] = useState(null)

  const [pwdInfo, setPwdInfo] = useState({
    username: "",
    email: "",
  });

  function handleForgotPwd(e) {
    e.preventDefault();
    setErrMsg("Processing with your data...")
    axios.post(`${Flask_URI}/forgot_password`, {
        username: pwdInfo.username,
        email: pwdInfo.email,
    })
    // You dont wait for responds this time or user can perform timing side channel attack
    setErrMsg("Please check your Email inbox for an OTP \nRedirect to reset page in 3")
    let counter = 3;
    setInterval(()=>{
      setErrMsg(`Please check your Email inbox for an OTP \nRedirect to reset page in ${counter}`)
      counter --
      if (counter === 0) {
        handleClose(false)
        redirect(true)
      }
    },1000)
  }

  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="forgotpwdcontainer"
      >
        <form id="forgotpwdForm" onSubmit={handleForgotPwd}>
          <button className="closebtn" onClick={handleClose}>x</button>

          <h1 id="forgoth1">Forgot Password</h1>

          <label>
            <input
              required
              type="text"
              placeholder="Username"
              value={pwdInfo.username}
              onChange={(e) => {
                setPwdInfo({ ...pwdInfo, username: e.target.value });
              }}
              className='fpwdinput'
            />
            <br />
          </label>

          <label>
            <input
              required
              type="email"
              placeholder="Email"
              value={pwdInfo.email}
              onChange={(e) => {
                setPwdInfo({ ...pwdInfo, email: e.target.value });
              }}
              className='fpwdinput'
            />
            <br />
          </label>
          <h3>{errMsg}</h3>
          <input className="fpwdsubmit" type="submit" value="Submit" />
        </form>
      </motion.div>
    </Backdrop>
  );
}
