import "./App.css";
import React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";

import Attractions from "./components/Attractions";
import Events from "./components/Events";
import EventsList from "./components/EventsList";
import Venues from "./components/Venues";
import Home from "./components/Home";
import logo from "./img/tm-developer-logo.svg";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title"> Welcome to TicketMaster API</h1>
          <Link className="showlink" to="/events">
            Events
          </Link>
        </header>
        <p>Welcome to a New World!</p>
        <Routes>
          <Route exact path="/events" Component={EventsList} />
          <Route exact path="/events/:id" Component={Events} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
