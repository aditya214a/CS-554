import "./App.css";
import React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
// import LikedList from "./components/LikedList";
import Home from "./components/Home";
// import MyLocation from "./components/MyLocation";
import CharacterList from "./components/CharacterList";
import Characters from "./components/Characters";
import CollectorsList from "./components/CollectorsList";
import Collector from "./components/Collector";
import logo from "./img/tm-developer-logo.png";
import queries from "./queries";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
// import Form from "./components/Form";
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://localhost:4000",
  }),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <header className="App-header">
            <div className="Navbar">
              <img src={logo} className="App-logo" alt="logo" />
              <br></br>
              <br></br>
              <div className="NavLinks">
                <Link className="showlink" to="/">
                  Home
                </Link>
                <Link className="showlink" to="/marvel-characters/page/1">
                  Characters
                </Link>
                <Link className="showlink" to="/collectors">
                  Collectors
                </Link>
              </div>
            </div>
          </header>
          <br></br>
          <br></br>
          <br></br>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/marvel-characters/page/:pagenum"
              element={<CharacterList />}
            />
            <Route path="/marvel-characters/:id" element={<Characters />} />
            <Route path="/collectors" element={<Collector />} />
            <Route
              path="/*"
              element={
                <div>
                  {" "}
                  <h1>404: Page not Found</h1>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
