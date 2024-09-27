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

export default function ResetPwd({ handleClose }) {

  const Flask_URI = useSelector(state => state.flask.URI)
  const [errMsg, setErrMsg] = useState(null)

  const [pwdInfo, setPwdInfo] = useState({
    username: "",
    otp: "",
    newpwd: "",
  });

  function handleResetPwd(e) {
    e.preventDefault();
    axios.patch(`${Flask_URI}/reset_password`, {
      username: pwdInfo.username,
      OTP: pwdInfo.otp,
      new_password: pwdInfo.newpwd,
    })
    .then((res)=> {
        if(res.status === 200){
          setErrMsg("Successful reset! \nRedirect to login in 3")
          let counter = 3;
          setInterval(()=>{
            setErrMsg(`Successful reset! \nRedirect to login in ${counter}`)
            counter --
            if (counter === 0) {
              handleClose(false)
            }
          },1000)
        } else {
          console.warn("Something wired at register");
        }
    })
    .catch((err) => {
      setErrMsg(err.response.data.message)
    });

  }

  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <form id="resetpwdForm" onSubmit={handleResetPwd}>
          <button className='closebtn' onClick={handleClose}>x</button>

          <h1 id="reseth1">Reset Password</h1>

          <label>
            <input
              required
              type="text"
              placeholder="Username"
              value={pwdInfo.username}
              onChange={(e) => {
                setPwdInfo({ ...pwdInfo, username: e.target.value });
              }}
              className='rpwdinput'
            />
            <br />
          </label>

          <label>
            <input
              required
              type="otp"
              placeholder="OTP"
              value={pwdInfo.otp}
              onChange={(e) => {
                setPwdInfo({ ...pwdInfo, otp: e.target.value });
              }}
              className='rpwdinput'
            />
            <br />
          </label>

          <label>
            <input
              required
              type="password"
              minLength="8"
              placeholder="New Password (min 8 characters)"
              value={pwdInfo.newpwd}
              onChange={(e) => {
                setPwdInfo({ ...pwdInfo, newpwd: e.target.value });
              }}
              className='rpwdinput'
            />
            <br />
          </label>
          <h3>{errMsg}</h3>
          <input type="submit" value="Submit" className='rpwdsubmit' />
        </form>
      </motion.div>
    </Backdrop>
  );
}
