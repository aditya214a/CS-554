import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import noImage from "../img/download.jpeg";
import { axiosID } from "../AxiosLinks";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardHeader,
} from "@mui/material";
import "../App.css";

const Attractions = (props) => {
  const [attractionsData, setAttractionsData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorCode, setErrorCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  // const classes = useStyles();
  let { id } = useParams();

  // const tConvert = (time) => {
  //   // Check correct time format and split into components
  //   time = time
  //     .toString()
  //     .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  //   if (time.length > 1) {
  //     // If time format correct
  //     time = time.slice(1); // Remove full string match value
  //     time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
  //     time[0] = +time[0] % 12 || 12; // Adjust hours
  //   }
  //   return time.join(""); // return adjusted time or original string
  // };
  // const formatDate = (venuedate) => {
  //   var year = venuedate.substring(0, 4);
  //   var month = venuedate.substring(5, 7);
  //   var day = venuedate.substring(8, 10);
  //   return month + "/" + day + "/" + year;
  // };
  useEffect(() => {
    console.log("SHOW useEffect fired");
    async function fetchData() {
      try {
        const venue = await axiosID("attractions", id);
        setAttractionsData(venue);
        setLoading(false);
        // console.log(venue);
      } catch (e) {
        setErrorCode("404");
        setErrorMsg("Attraction Not Found");
        setError(true);
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  let url = null;
  const regex = /(<([^>]+)>)/gi;
  if (attractionsData && attractionsData.url) {
    url = attractionsData && attractionsData.url.replace(regex, "");
  } else {
    url = "No Summary";
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
    // console.log(attractionsData.dates.status);
    return (
      <Card
        variant="outlined"
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
        <CardHeader
          //   title={attractionsData.name}
          sx={{
            borderBottom: "1px solid #024ddf",
            fontWeight: "bold",
          }}
        />
        <CardMedia
          component="img"
          image={
            attractionsData.images && attractionsData.images[0].url
              ? attractionsData.images[0].url
              : noImage
          }
          title="venue image"
        />

        <CardContent>
          <Typography
            variant="body2"
            color="textSecondary"
            component="span"
            sx={{
              borderBottom: "1px solid #024ddf",
              fontWeight: "bold",
            }}
          >
            <dl>
              <p>
                <dt className="title">Title:</dt>
                {attractionsData && attractionsData.name ? (
                  <dd>{attractionsData.name}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Offical Ticket Website:</dt>
                {attractionsData && attractionsData.url ? (
                  <dd>
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href={attractionsData.url}
                    >
                      {attractionsData.name} Offical Ticket Website
                    </a>
                  </dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Segment:</dt>
                {attractionsData &&
                attractionsData.classifications &&
                attractionsData.classifications[0].segment ? (
                  <dd>{attractionsData.classifications[0].segment.name}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Genre:</dt>
                {attractionsData &&
                attractionsData.classifications &&
                attractionsData.classifications[0].genre ? (
                  <dd>{attractionsData.classifications[0].genre.name}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Official Website:</dt>
                {attractionsData.externalLinks &&
                attractionsData.externalLinks.homepage ? (
                  <dd>
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href={attractionsData.externalLinks.homepage[0].url}
                    >
                      {attractionsData.name} Official Website
                    </a>
                  </dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">YouTube:</dt>
                {attractionsData.externalLinks &&
                attractionsData.externalLinks.youtube ? (
                  <dd>
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href={attractionsData.externalLinks.youtube[0].url}
                    >
                      {attractionsData.name} YouTube
                    </a>
                  </dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Twitter:</dt>
                {attractionsData.externalLinks &&
                attractionsData.externalLinks.twitter ? (
                  <dd>
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href={attractionsData.externalLinks.twitter[0].url}
                    >
                      {attractionsData.name} Twitter
                    </a>
                  </dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">iTunes:</dt>
                {attractionsData.externalLinks &&
                attractionsData.externalLinks.itunes ? (
                  <dd>
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href={attractionsData.externalLinks.itunes[0].url}
                    >
                      {attractionsData.name} iTunes
                    </a>
                  </dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">LastFM:</dt>
                {attractionsData.externalLinks &&
                attractionsData.externalLinks.lastfm ? (
                  <dd>
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href={attractionsData.externalLinks.lastfm[0].url}
                    >
                      {attractionsData.name} LastFM
                    </a>
                  </dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Wikipedia:</dt>
                {attractionsData.externalLinks &&
                attractionsData.externalLinks.wiki ? (
                  <dd>
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href={attractionsData.externalLinks.wiki[0].url}
                    >
                      {attractionsData.name} Wikipedia
                    </a>
                  </dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Facebook:</dt>
                {attractionsData.externalLinks &&
                attractionsData.externalLinks.facebook ? (
                  <dd>
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href={attractionsData.externalLinks.facebook[0].url}
                    >
                      {attractionsData.name} Facebook
                    </a>
                  </dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Spotify:</dt>
                {attractionsData.externalLinks &&
                attractionsData.externalLinks.spotify ? (
                  <dd>
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href={attractionsData.externalLinks.spotify[0].url}
                    >
                      {attractionsData.name} Spotify
                    </a>
                  </dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Instagram:</dt>
                {attractionsData.externalLinks &&
                attractionsData.externalLinks.instagram ? (
                  <dd>
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href={attractionsData.externalLinks.instagram[0].url}
                    >
                      {attractionsData.name} Instagram
                    </a>
                  </dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>

              <p>
                <dt className="title">Payment Methods:</dt>
                {attractionsData && attractionsData.boxOfficeInfo ? (
                  <dd>
                    {attractionsData.boxOfficeInfo.acceptedPaymentDetail},
                  </dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Summary:</dt>
                <dd>{url}</dd>
              </p>
            </dl>
            <Link to="/attractions/pages/1">Back to all shows...</Link>
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default Attractions;
