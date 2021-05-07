import React from "react";

import logo from "../assets/Library.png";

const Hero = () => (
  <div className="text-center hero my-5">
    <img className="mb-3 app-logo" src={logo} alt="BookTracker logo" width="120" />
    <h1 className="mb-4">BookTracker</h1>

    <p className="lead">
      Like to read?  Cannot remember what you've read, or just want to keep track of what books you have?
      Our BookTracker app will let you add all your books to a personal library, that only you have access to
      Your personal library can be arranged by customized Collections and the app also provides an easily searchable database.
      It will even let you mark off the books you have already read.
    </p>
  </div>
);

export default Hero;
