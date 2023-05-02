import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import { Link, } from "react-router-dom";
import { useDispatch } from "react-redux";
import actions from "../actions";

function CollectorsList(props) {
  //  const allCollectors = useSelector((state) => state.collectors);
  // const allCharacter = useSelector((state) => state.characters);
  // console.log("allcharacter", allCharacter);
  const dispatch = useDispatch();
  const selectCollector = () => {
    if (props.collector.selected) {
      dispatch(actions.unselectCollector(props.collector.id));
    } else {
      dispatch(actions.selectCollector(props.collector.id));
    }
  };
  const deleteCollector = () => {
    dispatch(actions.deleteCollector(props.collector.id));
  };
  console.log({ props: props });
  const buildCard = (character) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={character.id}>
        <Card
          sx={{
            maxWidth: 550,
            height: "auto",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 5,
            border: "1px solid #024ddf",
            boxShadow:
              "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
          }}
          variant="outlined"
        >
          <CardActionArea>
            <Link
              to={`/character/${character.id}`}
              style={{ textDecoration: "none" }}
            >
              {/* <CardMedia
                sx={{
                  height: "100%",
                  width: "100%",
                }}
                component="img"
                image={character.image}
                title={character.name}
              /> */}
              <CardContent>
                <Typography
                  sx={{
                    borderBottom: "1px solid #024ddf",
                    fontWeight: "bold",
                  }}
                  gutterBottom
                  variant="h6"
                  component="h2"
                >
                  {character.name}
                </Typography>
              </CardContent>
            </Link>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  return (
    <Grid
      container
      sx={{
        flexGrow: 1,
        flexDirection: "row",
        marginBottom: "5rem",
      }}
      spacing={1}
    >
      <Typography
        sx={{
          borderBottom: "1px solid #024ddf",
          fontWeight: "bold",
          padding: "10px",
          marginLeft: "25px",
        }}
        variant="h6"
        component="h2"
      >
        {props.collector.name}
      </Typography>

      {!props.collector.selected && (
        <Button variant="outlined" onClick={deleteCollector}>
          Delete Collector
        </Button>
      )}
      {!props.collector.selected && (
        <Button
          variant="contained"
          className="button"
          onClick={() => selectCollector()}
        >
          Select
        </Button>
      )}
      <br></br>
      <ul>
        {props &&
        props.collector &&
        props.collector.collection &&
        props.collector.collection.length > 0
          ? props.collector.collection.map((character) => (
              <li>
                <Link to={`/marvel-characters/${character.id}`}>
                  {character.name}
                </Link>
                {props.collector.selected && (
                  <Button
                    variant="danger"
                    onClick={() => dispatch(actions.givUpChar(character.id))}
                  >
                    Give Up
                  </Button>
                )}
              </li>
            ))
          : null}
      </ul>
    </Grid>
  );
}

export default CollectorsList;
