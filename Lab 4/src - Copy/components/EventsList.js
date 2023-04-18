// import React, { Component } from "react";
import { Link, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import noImage from "../img/download.jpeg";
import Search from "./Search";
import { axiosLists, axiosSearch } from "../AxiosLinks";
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

const EventsList = (props) => {
  // const regex = /(<([^>]+)>)/gi;
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState(undefined);
  const [eventsData, setEventsData] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [hideNext, setHideNext] = useState(false);
  const [error, setError] = useState(false);
  const [errorCode, setErrorCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [hidePrev, setHidePrev] = useState(true);
  let card = null;
  let { page } = useParams();
  // checkPageData();
  useEffect(() => {
    console.log("on load useeffect");
    async function fetchData() {
      try {
        const data = await axiosLists("events", parseInt(page));

        if (parseInt(page) > 1) {
          setHidePrev(false);
        } else setHidePrev(true);
        if (page > 49) {
          setHideNext(true);
        } else setHideNext(false);

        // setHideNext(false);
        setEventsData(data.events);
        setLoading(false);
      } catch (e) {
        console.log(e);
        // setErrorCode("404");
        // setErrorMsg("Page Not Found");
        // setError(true);
        // setLoading(false);
      }

      try {
        if (page > 50) {
          //2558
          throw new Error("No Next Page");
        }
      } catch (e) {
        // setHideNext(true);
        setErrorCode("404");
        setErrorMsg("Page Not Found");
        setError(true);
        setLoading(false);
      }
    }
    fetchData();
  }, [page]);

  useEffect(() => {
    console.log("search useEffect fired");
    async function fetchData() {
      try {
        console.log(`in fetch searchTerm: ${searchTerm}`);
        const data = await axiosSearch("events", searchTerm);
        // console.log(data);
        setSearchData(data._embedded.events);
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
    console.log(value);
    setSearchTerm(value);
  };
  const buildCard = (event) => {
    // console.log(event.classifications[0].genre.name);
    return (
      // <Grid container spacing={24}>
      <Grid
        item
        xs={12}
        sm={7}
        md={5}
        lg={4}
        xl={3}
        sx={{
          padding: 3,
        }}
        key={event.id}
      >
        <Card
          variant="outlined"
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
        >
          <CardActionArea>
            <Link to={`/events/${event.id}`}>
              <CardMedia
                sx={{
                  height: "100%",
                  width: "100%",
                }}
                component="img"
                image={
                  event.images && event.images[2].url
                    ? event.images[2].url
                    : noImage
                }
                title="event image"
              />

              <CardContent>
                <Typography
                  sx={{
                    borderBottom: "1px solid #024ddf",
                    fontWeight: "bold",
                  }}
                  gutterBottom
                  variant="h6"
                  component="h3"
                >
                  {event.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {event.classifications[0]
                    ? event.classifications[0].segment.name +
                      " | " +
                      event.classifications[0].genre.name
                    : "No Genre"}
                </Typography>
              </CardContent>
            </Link>
          </CardActionArea>
        </Card>
      </Grid>
      // </Grid>
    );
  };

  if (searchTerm) {
    card =
      searchData &&
      searchData.map((events) => {
        let event = events;
        return buildCard(event);
      });
  } else {
    // console.log(eventsData);
    card =
      eventsData &&
      eventsData.map((event) => {
        return buildCard(event);
      });
  }

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <h1>
          {errorCode}: {errorMsg}
        </h1>
      </div>
    );
  } else {
    return (
      <div>
        <Search searchValue={searchValue} />
        <br />
        <br />
        <div>
          {hidePrev ? null : (
            <Link to={`/events/pages/${parseInt(page) - 1}`}>
              <Button>Previous</Button>
            </Link>
          )}
          <span>{page}</span>
          {hideNext ? null : (
            <Link to={`/events/pages/${parseInt(page) + 1}`}>
              <Button>Next</Button>
            </Link>
          )}
          <Grid
            container
            spacing={3}
            sx={{
              flexGrow: 1,
              flexDirection: "row",
            }}
          >
            {card}
          </Grid>
        </div>
        <br />
        <br />
      </div>
    );
  }
};

export default EventsList;
