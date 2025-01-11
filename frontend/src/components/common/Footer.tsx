import React from "react";

export default function Footer() {
  const now = new Date();

  return (
    <div className="flex items-center border-1 border-t-2 border-t-slate-200 p-4 w-3/4 mx-auto">
      <img
        src={`${process.env.PUBLIC_URL}/logo.svg`}
        alt="logo"
        className="w-6 aspect-square mx-4"
      />
      <p className="text-slate-400">
        {now.getFullYear()} &copy; Student Scheduler
      </p>
    </div>
  );
}
