import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import SearchShows from "./SearchShows";
import noImage from "../img/download.jpeg";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Typography,
} from "@mui/material";

import "../App.css";

const ShowList = () => {
  const regex = /(<([^>]+)>)/gi;
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState(undefined);
  const [showsData, setShowsData] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [hideNext, setHideNext] = useState(false);
  const [hidePrev, setHidePrev] = useState(true);
  let card = null;
  let { page } = useParams();
  checkPageData();
  useEffect(() => {
    console.log("on load useeffect");
    async function fetchData() {
      try {
        const { data } = await axios.get(
          "http://api.tvmaze.com/shows?page=" + page
        );
        setShowsData(data);
        setLoading(false);

        if (parseInt(page) > 0) {
          setHidePrev(false);
        }
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [page]);

  useEffect(() => {
    console.log("search useEffect fired");
    async function fetchData() {
      try {
        console.log(`in fetch searchTerm: ${searchTerm}`);
        const { data } = await axios.get(
          "http://api.tvmaze.com/search/shows?q=" + searchTerm
        );
        setSearchData(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    if (searchTerm) {
      console.log("searchTerm is set");
      fetchData();
    }
  }, [searchTerm]);

  const searchValue = async (value) => {
    setSearchTerm(value);
  };
  async function checkPageData() {
    const { data } = await axios.get(
      `http://api.tvmaze.com/shows?page=${parseInt(page) + 1}`
    );
    if (!data) {
      setHideNext(true);
    }
  }
  const buildCard = (show) => {
    return (
      <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={show.id}>
        <Card
          variant="outlined"
          sx={{
            maxWidth: 250,
            height: "auto",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 5,
            border: "1px solid #1e8678",
            boxShadow:
              "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
          }}
        >
          <CardActionArea>
            <Link to={`/shows/${show.id}`}>
              <CardMedia
                sx={{
                  height: "100%",
                  width: "100%",
                }}
                component="img"
                image={
                  show.image && show.image.original
                    ? show.image.original
                    : noImage
                }
                title="show image"
              />

              <CardContent>
                <Typography
                  sx={{
                    borderBottom: "1px solid #1e8678",
                    fontWeight: "bold",
                  }}
                  gutterBottom
                  variant="h6"
                  component="h3"
                >
                  {show.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {show.summary
                    ? show.summary.replace(regex, "").substring(0, 139) + "..."
                    : "No Summary"}
                  <span>More Info</span>
                </Typography>
              </CardContent>
            </Link>
          </CardActionArea>
        </Card>
      </Grid>
    );
  };

  if (searchTerm) {
    card =
      searchData &&
      searchData.map((shows) => {
        let { show } = shows;
        return buildCard(show);
      });
  } else {
    card =
      showsData &&
      showsData.map((show) => {
        return buildCard(show);
      });
  }

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else {
    return (
      <div>
        <SearchShows searchValue={searchValue} />
        <br />
        <br />
        <div>
          {hidePrev ? null : (
            <Link to={`/shows/page/${parseInt(page) - 1}`}>
              <Button>Previous</Button>
            </Link>
          )}
          <span>{page}</span>
          {hideNext ? null : (
            <Link to={`/shows/page/${parseInt(page) + 1}`}>
              <Button>Next</Button>
            </Link>
          )}
          {card}
        </div>
        <br />
        <br />
      </div>
    );
  }
};

export default ShowList;
