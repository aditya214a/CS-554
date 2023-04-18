import "./App.css";
import React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";

import Attractions from "./components/Attractions";
import AttractionsList from "./components/AttractionsList";
import Events from "./components/Events";
import EventsList from "./components/EventsList";
import VenuesList from "./components/VenuesList";
import Venues from "./components/Venues";
import Home from "./components/Home";
import logo from "./img/tm-developer-logo.svg";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {/* <h1 className="App-title"> Welcome to TicketMaster API</h1> */}
          <h5> </h5>
          <Link className="showlink" to="/">
            Home
          </Link>
          <Link className="showlink" to="/events/pages/1">
            Events
          </Link>
          <Link className="showlink" to="/venues/pages/1">
            Venues
          </Link>
          <Link className="showlink" to="/attractions/pages/1">
            Attractions
          </Link>
        </header>

        <Routes>
          <Route path="/" Component={Home} />
          <Route exact path="/events/pages/:page" Component={EventsList} />
          <Route exact path="/events/:id" Component={Events} />
          <Route exact path="/venues/pages/:page" Component={VenuesList} />
          <Route exact path="/venues/:id" Component={Venues} />
          <Route
            exact
            path="/attractions/pages/:page"
            Component={AttractionsList}
          />
          <Route exact path="/attractions/:id" Component={Attractions} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
