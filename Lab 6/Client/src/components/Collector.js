import React, { useState } from "react";
import { Button, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CollectorsList from "./CollectorsList";
import actions from "../actions";

function Collector() {
  const allCollector = useSelector((state) => state.collectors);
  // const allCharacter = useSelector((state) => state.characters);
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  console.log({ allCollector123: allCollector });
  return (
    <div className="container">
      <br />
      <h1>Add Collector</h1>
      <div className="container">
        <div>
          <br></br>
          <label>
            Collector:
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              required
              id="collector"
              name="collector"
              placeholder="Collector"
            />
          </label>
        </div>
        <Button
          variant="contained"
          className="button"
          onClick={(e) => {
            e.preventDefault();
            if (name === undefined || name === "") {
              alert("Please enter a name");
            } else {
              dispatch(actions.addCollector(name));
              document.getElementById("collector").value = "";
              setName({ name: "" });
            }
          }}
        >
          Add
        </Button>
      </div>
      <br></br>
      {allCollector.length > 0 ? <h1>Collector</h1> : null}
      {allCollector.map((collector, index) => {
        return (
          <Grid
            container
            sx={{
              flexGrow: 1,
              flexDirection: "row",
            }}
            key={index}
            spacing={1}
          >
            <CollectorsList collector={collector} />
          </Grid>
        );
      })}
    </div>
  );
}

export default Collector;
