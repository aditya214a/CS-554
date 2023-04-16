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

const AttractionsList = (props) => {
  // const regex = /(<([^>]+)>)/gi;
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState(undefined);
  const [attractionsData, setAttractionsData] = useState(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [hideNext, setHideNext] = useState(false);
  const [hidePrev, setHidePrev] = useState(true);
  const [error, setError] = useState(false);
  const [errorCode, setErrorCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  let card = null;
  let { page } = useParams();
  // checkPageData();
  useEffect(() => {
    console.log("on load useeffect");
    async function fetchData() {
      try {
        const data = await axiosLists("attractions", parseInt(page));

        if (parseInt(page) > 1) {
          setHidePrev(false);
        } else setHidePrev(true);
        if (page > 49) {
          setHideNext(true);
        } else setHideNext(false);

        // setHideNext(false);
        setAttractionsData(data.attractions);
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
        const data = await axiosSearch("attractions", searchTerm);

        setSearchData(data._embedded.attractions);
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
  // async function checkPageData() {
  //   try {
  //     const data = await axiosLists("attractions", parseInt(page) + 1);
  //     // console.log(data);
  //     if (!data) {
  //       setHideNext(true);
  //     } else {
  //       setHideNext(false);
  //     }
  //   } catch (e) {
  //     setHideNext(true);
  //     console.log(e);
  //   }
  // }
  const buildCard = (attraction) => {
    // console.log(attraction.images[0].url);
    return (
      <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={attraction.id}>
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
            <Link to={`/attractions/${attraction.id}`}>
              <CardMedia
                sx={{
                  height: "100%",
                  width: "100%",
                }}
                component="img"
                image={
                  attraction.images && attraction.images[0].url
                    ? attraction.images[0].url
                    : noImage
                }
                title="attraction image"
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
                  {attraction.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {attraction.classifications[0].segment &&
                  attraction.classifications[0].genre
                    ? (attraction.classifications[0].segment.name !==
                      "Undefined"
                        ? attraction.classifications[0].segment.name
                        : "N/A") +
                      " | " +
                      (attraction.classifications[0].genre.name !== "Undefined"
                        ? attraction.classifications[0].genre.name
                        : "N/A")
                    : "No Genre"}
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
      searchData.map((attractions) => {
        let attraction = attractions;
        return buildCard(attraction);
      });
  } else {
    // console.log(attractionsData.images);
    card =
      attractionsData &&
      attractionsData.map((attraction) => {
        return buildCard(attraction);
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
            <Link to={`/attractions/pages/${parseInt(page) - 1}`}>
              <Button>Previous</Button>
            </Link>
          )}
          <span>{page}</span>
          {hideNext ? null : (
            <Link to={`/attractions/pages/${parseInt(page) + 1}`}>
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

export default AttractionsList;
