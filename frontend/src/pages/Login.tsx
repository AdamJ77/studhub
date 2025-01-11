import React from "react";

import LoginCard from "../components/login/LoginCard";

export default function Login() {
  return (
  <div className="w-full h-screen grid grid-cols-2 grid-rows-1">
    <div id="left-panel" className="w-100 h-screen flex justify-center items-center bg-slate-100">
        <LoginCard />
    </div>
    <img id="bg" src={`${process.env.PUBLIC_URL}/slide-2.jpg`} alt="Background" className="w-full h-full object-cover object-center" style={{filter: 'brightness(0.81) contrast(1.72) grayscale(0.37) hue-rotate(-190deg)'}}/>
  </div>
  );
}
