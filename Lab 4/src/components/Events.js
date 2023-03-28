import React, { useState, useEffect } from "react";
import axios from "axios";
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
        console.log(e);
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
  } else {
    return (
      <Card
        variant="outlined"
        sx={{
          maxWidth: 550,
          height: "auto",
          marginLeft: "auto",
          marginRight: "auto",
          borderRadius: 5,
          border: "1px solid #1e8678",
          boxShadow:
            "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
        }}
      >
        <CardHeader
          //   title={eventsData.name}
          sx={{
            borderBottom: "1px solid #1e8678",
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
              borderBottom: "1px solid #1e8678",
              fontWeight: "bold",
            }}
          >
            <dl>
              <p>
                <dt className="title">Average Rating:</dt>
                {eventsData && eventsData.rating.average ? (
                  <dd>{eventsData.rating.average}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Offical Site:</dt>
                {eventsData && eventsData.officialSite ? (
                  <dd>
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href={eventsData.officialSite}
                    >
                      {eventsData.name} Offical Site
                    </a>
                  </dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Network:</dt>
                {eventsData && eventsData.network ? (
                  <dd>{eventsData.network && eventsData.network.name}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Language:</dt>
                {eventsData && eventsData.language ? (
                  <dd>{eventsData.language}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Runtime:</dt>
                {eventsData && eventsData.runtime ? (
                  <dd>{eventsData.runtime + " Min"}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Premiered:</dt>
                {eventsData && eventsData.premiered ? (
                  <dd>{formatDate(eventsData.premiered)}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Country:</dt>
                {eventsData &&
                eventsData.network &&
                eventsData.network.country.name ? (
                  <dd>{eventsData.network.country.name}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Time Zone:</dt>
                {eventsData &&
                eventsData.network &&
                eventsData.network.country.timezone ? (
                  <dd>{eventsData.network.country.timezone}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Airtime:</dt>
                {eventsData && eventsData.schedule.time ? (
                  <dd>{tConvert(eventsData.schedule.time)}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Days Aired:</dt>
                {eventsData &&
                eventsData.schedule.days &&
                eventsData.schedule.days.length >= 1 ? (
                  <span>
                    {eventsData.schedule.days.map((day) => {
                      if (eventsData.schedule.days.length > 1)
                        return <dd key={day}>{day}s,</dd>;
                      return <dd key={day}>{day}s</dd>;
                    })}
                  </span>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Status:</dt>
                {eventsData && eventsData.status ? (
                  <dd>{eventsData.status}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>

              <p>
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
              </p>
              <p>
                <dt className="title">Summary:</dt>
                <dd>{url}</dd>
              </p>
            </dl>
            <Link to="/shows">Back to all shows...</Link>
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default Events;

// import React, { Component } from "react";
// import { useState, useEffect } from "react";
// import noImage from "../img/download.jpeg";
// import { Link, useParams } from "react-router-dom";
// import { axiosID } from "../AxiosLinks";

// const Events = () => {
//   let { id } = useParams();
//   const [eventsData, setEventsData] = useState(undefined);
//   const [loading, setLoading] = useState(true);
//   const regex = /(<([^>]+)>)/gi;

//   useEffect(() => {
//     console.log("SHOW useEffect fired");
//     async function fetchData() {
//       try {
//         const { data: event } = await axiosID("events", id);
//         setEventsData(event);
//         setLoading(false);
//         console.log(event);
//       } catch (e) {
//         console.log(e);
//       }
//     }
//     fetchData();
//   }, [id]);
//   //   render() {
//   //     const regex = /(<([^>]+)>)/gi;
//   //     return (
//   //       <div className="event-body">
//   //         <h1 className="cap-first-letter">{"lloll" || "No Event Name"}</h1>
//   //       </div>
//   //     );
//   //   }
// };
// export default Events;
