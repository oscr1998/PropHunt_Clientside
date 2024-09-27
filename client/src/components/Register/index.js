import { React, useState } from "react";
import { motion } from "framer-motion";
import Backdrop from "../Backdrop";
import "./style.css";
import axios from "axios";
import { useSelector } from "react-redux";

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

export default function Register({ handleClose }) {
  const Flask_URI = useSelector((state) => state.flask.URI);

  const [regInfo, setRegInfo] = useState({
    username: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
  });

  const [regErrMsg, setRegErrMsg] = useState(null);

  function handelRegister(e) {
    e.preventDefault();
    if (regInfo.email !== regInfo.confirmEmail) {
      setRegErrMsg("Email does not match");
    } else if (regInfo.password !== regInfo.confirmPassword) {
      setRegErrMsg("Password does not match");
    } else {
      // kyl1g16.ecs@gmail.com
      setRegErrMsg("Processing with your data...");
      axios
        .post(`${Flask_URI}/register`, {
          username: regInfo.username,
          password: regInfo.password,
          email: regInfo.email,
        })
        .then((res) => {
          if (res.status === 201) {
            setRegErrMsg("Register successful! \nRedirect to login in 3");
            let counter = 3;
            setInterval(() => {
              setRegErrMsg(
                `Register successful! \nRedirecting to login in ${counter}`
              );
              counter--;
              if (counter === 0) {
                handleClose(false);
              }
            }, 1000);
          } else {
            console.warn("Something wired at register");
          }
        })
        .catch((err) => {
          setRegErrMsg(err.response.data.message);
        });
    }
  }

  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="motiondiv"
      >
        <form id="registerForm" onSubmit={handelRegister}>
          <button className="closebtn" onClick={handleClose}>x</button>

          <h1 id="registerh1">Register</h1>

          <label>
            <input
              className="registerinputs"
              required
              type="text"
              placeholder="Username"
              value={regInfo.username}
              onChange={(e) => {
                setRegInfo({ ...regInfo, username: e.target.value });
              }}
            />
            <br />
          </label>

          <label>
            <input
            className="registerinputs"
              required
              type="email"
              placeholder="Email"
              value={regInfo.email}
              onChange={(e) => {
                setRegInfo({ ...regInfo, email: e.target.value });
              }}
            />
            <br />
          </label>

          <label>
            <input
            className="registerinputs"
              required
              type="email"
              placeholder="Confirm Email"
              value={regInfo.confirmEmail}
              onChange={(e) => {
                setRegInfo({ ...regInfo, confirmEmail: e.target.value });
              }}
            />
            <br />
          </label>

          <label>
            <input
            className="registerinputs"
              required
              type="password"
              minLength="8"
              placeholder="Password (min 8 characters)"
              value={regInfo.password}
              onChange={(e) => {
                setRegInfo({ ...regInfo, password: e.target.value });
              }}
            />
            <br />
          </label>

          <label>
            <input
            className="registerinputs"
              required
              type="password"
              minLength="8"
              placeholder="Confirm Password"
              value={regInfo.confirmPassword}
              onChange={(e) => {
                setRegInfo({ ...regInfo, confirmPassword: e.target.value });
              }}
            />
            <br />
          </label>

          <input type="submit" value="Submit" className="registersubmitbtn" />
        </form>
      </motion.div>
    </Backdrop>
  );
}
