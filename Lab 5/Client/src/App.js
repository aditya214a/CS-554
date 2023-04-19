import "./App.css";
import React from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
// import LikedList from "./components/LikedList";
import Home from "./components/Home";
// import MyLocation from "./components/MyLocation";
import AddLoc from "./components/AddLoc";
import logo from "./img/tm-developer-logo.svg";
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
            <img src={logo} className="App-logo" alt="logo" />
            <h5> </h5>
            <Link className="showlink" to="/">
              Home
            </Link>
            <Link className="showlink" to="/my-likes">
              My Likes
            </Link>
            <Link className="showlink" to="/my-location">
              My Location
            </Link>
            <Link className="showlink" to="/new-location">
              Add Location
            </Link>
          </header>

          <Routes>
            <Route
              path="/"
              element={<Home query={queries.GET_API_LOCATIONS} page={1} />}
            />
            <Route
              path="/my-likes"
              element={<Home query={queries.GET_LIKED_LOCATIONS} />}
            />
            <Route
              path="/my-location"
              element={<Home query={queries.GET_USER_LOCATIONS} del={true} />}
            />
            <Route
              path="/new-location"
              element={<AddLoc query={queries.ADD_LOCATION} />}
            />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
