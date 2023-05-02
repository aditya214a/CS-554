import React, { useState, useEffect } from "react";
import "../App.css";
import { useParams } from "react-router-dom";
import { Card, CardMedia, Typography, Button } from "@mui/material";
// import { makeStyles } from "@mui/styles";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import { useSelector, useDispatch } from "react-redux";
import actions from "../actions";
import store from "../store";

const Characters = () => {
  const dispatch = useDispatch();
  let { id } = useParams();
  const [characterID, setCharacterID] = useState(parseInt(id));
  const [errorPage, setErrorPage] = useState(false);
  const allCharacter = useSelector((state) => state.characters);
  const allCollectors = useSelector((state) => state.collectors);
  let selectedCollector = allCollectors.find((x) => x.selected);

  store.subscribe(() => {
    //
    console.log({ selectedCollector: selectedCollector });
    selectedCollector = allCollectors.find((x) => x.selected);
  });

  let page = null;
  const { loading, error, data } = useQuery(queries.GET_CHARACTER, {
    variables: { id: characterID },
    fetchPolicy: "cache-and-network",
  });

  // console.log(data.getCharacter);
  // Using callback
  useEffect(() => {
    console.log("on load useeffect for character by ID");
    setCharacterID(Number(id));
  }, [characterID, id]);

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <h2>404: Page not Found</h2>
      </div>
    );
  } else if (errorPage) {
    return <div>404: Page Not Found</div>;
  } else {
    console.log(data);
    return (
      <div>
        <br />
        {page}
        <br />
        <br />
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
        >
          <CardMedia
            component="img"
            sx={{
              borderBottom: "1px solid #024ddf",
              fontWeight: "bold",
            }}
            image={data.getCharacter.image}
            alt={data.getCharacter.name}
          />
        </Card>
        <Typography
          gutterBottom
          variant="h3"
          component="div"
          textAlign="center"
        >
          <dl>
            <p>
              <dt className="title">Character Name:</dt>
              {data.getCharacter && data.getCharacter.name ? (
                <dd>{data.getCharacter.name}</dd>
              ) : (
                <dd>N/A</dd>
              )}
            </p>
            <p>
              <dt className="title">Offical Website:</dt>
              {data.getCharacter && data.getCharacter.resourceURI ? (
                <dd>
                  <a
                    rel="noopener noreferrer"
                    target="_blank"
                    href={data.getCharacter.resourceURI}
                  >
                    {data.getCharacter.name}
                  </a>
                </dd>
              ) : (
                <dd>N/A</dd>
              )}
            </p>
            <p>
              <dt className="title">Description:</dt>
              {data.getCharacter && data.getCharacter.description ? (
                <dd>{data.getCharacter.description}</dd>
              ) : (
                <dd>N/A</dd>
              )}
            </p>
          </dl>
        </Typography>

        {selectedCollector && selectedCollector.collection.length >= 10 ? (
          <Button sx={{ backgroundColor: "#ffff" }} variant="disabled">
            Collection Full
          </Button>
        ) : null}
        {!(selectedCollector.collection.find(
          (x) => x.id === data.getCharacter.id
        )
          ? true
          : false) &&
          selectedCollector.collection.length < 10 &&
          (selectedCollector ? true : false) && (
            <Button
              variant="primary"
              onClick={() =>
                dispatch(
                  actions.addCharacter({
                    id: data.getCharacter.id,
                    name: data.getCharacter.name,
                  })
                )
              }
            >
              Collect
            </Button>
          )}
        {(selectedCollector.collection.find(
          (x) => x.id === data.getCharacter.id
        )
          ? true
          : false) &&
          (selectedCollector ? true : false) && (
            <Button
              variant="danger"
              onClick={() => dispatch(actions.givUpChar(data.getCharacter.id))}
            >
              Give Up
            </Button>
          )}
        {/* <Typography
          gutterBottom
          variant="h4"
          component="div"
          textAlign="center"
        >
          {data.getCharacter.name}
        </Typography>
        <hr />
        {data.getCharacter.map((x, index) => {
          return (
            <Typography
              key={index}
              gutterBottom
              variant="h4"
              component="div"
              textAlign="center"
            >
              {x.name}: {x.value}
            </Typography>
          );
        })} */}
      </div>
    );
  }
};

export default Characters;
