import React, { useState, useEffect } from "react";
import "../App.css";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Button,
} from "@mui/material";
// import { makeStyles } from "@mui/styles";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import store from "../store";
import actions from "../actions";
import { useSelector, useDispatch } from "react-redux";

const CharacterList = () => {
  const dispatch = useDispatch();

  let { pagenum } = useParams();

  const [pageNum, setPageNum] = useState(Number(pagenum));

  const [errorPage, setErrorPage] = useState(false);
  const allCharacter = useSelector((state) => state.characters);
  const allCollectors = useSelector((state) => state.collectors);
  let selectedCollector = allCollectors.find((x) => x.selected);

  store.subscribe(() => {
    //
    console.log({ selectedCollector: selectedCollector });
    selectedCollector = allCollectors.find((x) => x.selected);
  });

  
  let card = null;
  const { loading, error, data } = useQuery(queries.GET_CHARACTER_LIST, {
    variables: { pageNum: pageNum },
  });

  useEffect(() => {
    setErrorPage(false);
    if (isNaN(pageNum) || pageNum < 1) {
      setErrorPage(true);
    }
  }, []);

  useEffect(() => {
    console.log("pagenum: " + pagenum);
    setPageNum(Number(pagenum));
    setErrorPage(false);
    if (isNaN(pageNum)) {
      setErrorPage(true);
    }
  }, [pagenum]);

  useEffect(() => {
    if (data) {
      console.log("after Data useEffect");
    }
  }, [data]);

  const pagination = () => {
    console.log("@@@@@@@@" + pageNum);
    if (pageNum < 1) {
      setErrorPage(true);
    } else if (pageNum > 79) {
      setErrorPage(true);
    } else {
      return (
        <div id="paginationBtns">
          {Number(pagenum) < 2 ? null : (
            <Link
              className="links"
              to={`/marvel-characters/page/${Number(pagenum) - 1}`}
            >
              <Button className="button" variant="contained">
                Previous
              </Button>
            </Link>
          )}
          {pageNum}
          {Number(pagenum) > 78 ? null : (
            <Link
              className="links"
              to={`/marvel-characters/page/${Number(pagenum) + 1}`}
            >
              <Button className="button" variant="contained">
                Next
              </Button>
            </Link>
          )}
        </div>
      );
    }
  };

  const buildCard = (character) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={character.id}>
        <Card
          sx={{
            maxWidth: 250,
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
              to={`/marvel-characters/${character.id}`}
              style={{ textDecoration: "none" }}
            >
              <CardMedia
                sx={{
                  height: "100%",
                  width: "100%",
                }}
                component="img"
                image={character.image}
                title={character.name}
              />
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
            {selectedCollector && selectedCollector.collection.length >= 10 ? (
              <Button sx={{ backgroundColor: "#ffff" }} variant="disabled">
                Collection Full
              </Button>
            ) : null}
            {!(selectedCollector.collection.find((x) => x.id === character.id)
              ? true
              : false) &&
              selectedCollector.collection.length < 10 &&
              (selectedCollector ? true : false) && (
                <Button
                  variant="primary"
                  onClick={() =>
                    dispatch(
                      actions.addCharacter({
                        id: character.id,
                        name: character.name,
                      })
                    )
                  }
                >
                  Collect
                </Button>
              )}
            {(selectedCollector.collection.find((x) => x.id === character.id)
              ? true
              : false) &&
              (selectedCollector ? true : false) && (
                <Button
                  variant="danger"
                  onClick={() => dispatch(actions.givUpChar(character.id))}
                >
                  Give Up
                </Button>
              )}
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  if (errorPage || error) {
    return <div>{error ? error.message : <div>Page Not Found</div>}</div>;
  } else if (loading) {
    return <div>Loading...</div>;
  } else if (data) {
    // console.log(data);

    card =
      data.characters.result &&
      data.characters.result.map((character) => {
        return buildCard(character);
      });
    return (
      <div>
        <h1>Characters</h1>
        <br />
        {pagination()}
        <br />
        <Grid
          container
          spacing={3}
          sx={{
            flexGrow: 1,
            flexDirection: "row",
          }}
        >
          {data.characters.result.length > 0 ? card : setErrorPage(true)}
        </Grid>
      </div>
    );
  }
};

export default CharacterList;
