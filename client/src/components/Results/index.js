import React from "react";
import { motion } from "framer-motion";
import Backdrop from "../Backdrop";
import './style.css'
import { useNavigate } from "react-router-dom";

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

export default function Results({ handleClose, results }) {
    const navigate = useNavigate();
return (
    <Backdrop onClick={handleClose}>
        <motion.div
            onClick={(e) => e.stopPropagation()}
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="resultscontainer"
        >
            <button className="closebtn" onClick={handleClose} style={{alignSelf:"center"}}>x</button>
            <h1>Results</h1>
            <h3>{results} Side Win!</h3>
            <button onClick={()=>{ navigate('/dashboard') }}>Back to Home</button>
        </motion.div>
    </Backdrop>
);
}
