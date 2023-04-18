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

const Events = (props) => {
  const [eventsData, setEventsData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorCode, setErrorCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  // const classes = useStyles();
  let { id } = useParams();

  const tConvert = (time) => {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
  };
  const formatDate = (eventdate) => {
    var year = eventdate.substring(0, 4);
    var month = eventdate.substring(5, 7);
    var day = eventdate.substring(8, 10);
    return month + "/" + day + "/" + year;
  };
  useEffect(() => {
    console.log("SHOW useEffect fired");
    async function fetchData() {
      try {
        const event = await axiosID("events", id);
        setEventsData(event);
        setLoading(false);
        // console.log(event);
      } catch (e) {
        setErrorCode("404");
        setErrorMsg("Event Not Found");
        setError(true);
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  let url = null;
  const regex = /(<([^>]+)>)/gi;
  if (eventsData && eventsData.url) {
    url = eventsData && eventsData.url.replace(regex, "");
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
    // console.log(eventsData.dates.status);
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
          //   title={eventsData.name}
          sx={{
            borderBottom: "1px solid #024ddf",
            fontWeight: "bold",
          }}
        />
        <CardMedia
          component="img"
          image={
            eventsData.images && eventsData.images[2].url
              ? eventsData.images[2].url
              : noImage
          }
          title="event image"
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
                {eventsData && eventsData.name ? (
                  <dd>{eventsData.name}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Offical Site:</dt>
                {eventsData && eventsData.url ? (
                  <dd>
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href={eventsData.url}
                    >
                      {eventsData.name} Offical Site
                    </a>
                  </dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Ticket Status:</dt>
                {eventsData && eventsData.dates && eventsData.dates ? (
                  <dd>{eventsData.dates.status.code}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Price:</dt>
                {eventsData && eventsData.priceRanges ? (
                  <dd>
                    ${eventsData.priceRanges[0].min} - $
                    {eventsData.priceRanges[0].max}
                  </dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Segment:</dt>
                {eventsData && eventsData.classifications[0].segment ? (
                  <dd>{eventsData.classifications[0].segment.name}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Genre:</dt>
                {eventsData && eventsData.classifications[0].genre ? (
                  <dd>{eventsData.classifications[0].genre.name}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>

              <p>
                <dt className="title">Age Restriction:</dt>
                {eventsData && eventsData.ageRestrictions ? (
                  <dd>
                    {eventsData.ageRestrictions.legalAgeEnforced === false
                      ? "NONE"
                      : "YES"}
                  </dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Date:</dt>
                {eventsData && eventsData.dates && eventsData.dates.start ? (
                  <dd>{formatDate(eventsData.dates.start.localDate)}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Venue:</dt>
                {eventsData && eventsData._embedded.venues[0].address ? (
                  <dd>
                    {eventsData._embedded.venues[0].address.line1},
                    {eventsData._embedded.venues[0].city.name},
                    {eventsData._embedded.venues[0].state.name},{" "}
                    {eventsData._embedded.venues[0].country.countryCode}{" "}
                  </dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Time Zone:</dt>
                {eventsData && eventsData.dates.timezone ? (
                  <dd>{eventsData.dates.timezone}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">StartTime:</dt>
                {eventsData && eventsData.dates.start.localTime ? (
                  <dd>{tConvert(eventsData.dates.start.localTime)}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Seat Map:</dt>
                {eventsData && eventsData.seatmap ? (
                  <dd>{eventsData.seatmap.staticUrl}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Status:</dt>
                {eventsData && eventsData.dates.status ? (
                  <dd>{eventsData.dates.status.code}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Promoter:</dt>
                {eventsData && eventsData.promoter ? (
                  <dd>{eventsData.promoter.name}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Important Information:</dt>
                {eventsData && eventsData.info ? (
                  <dd>{eventsData.info}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Important Note:</dt>
                {eventsData && eventsData.pleaseNote ? (
                  <dd>{eventsData.pleaseNote}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              {/* <p>
                <dt className="title">Genres:</dt>
                {eventsData &&
                eventsData.genres &&
                eventsData.genres.length >= 1 ? (
                  <span>
                    {eventsData.genres.map((genre) => {
                      if (eventsData.genres.length > 1)
                        return <dd key={genre}>{genre},</dd>;
                      return <dd key={genre}>{genre}</dd>;
                    })}
                  </span>
                ) : (
                  <dd>N/A</dd>
                )}
              </p> */}
              <p>
                <dt className="title">Summary:</dt>
                <dd>{url}</dd>
              </p>
            </dl>
            <Link to="/events/pages/1">Back to all shows...</Link>
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default Events;
