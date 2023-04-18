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

const Venues = (props) => {
  const [venuesData, setVenuesData] = useState(undefined);
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
        const venue = await axiosID("venues", id);
        setVenuesData(venue);
        setLoading(false);
        // console.log(venue);
      } catch (e) {
        setErrorCode("404");
        setErrorMsg("Venue Not Found");
        setError(true);
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  let url = null;
  const regex = /(<([^>]+)>)/gi;
  if (venuesData && venuesData.url) {
    url = venuesData && venuesData.url.replace(regex, "");
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
    // console.log(venuesData.dates.status);
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
          //   title={venuesData.name}
          sx={{
            borderBottom: "1px solid #024ddf",
            fontWeight: "bold",
          }}
        />
        <CardMedia
          component="img"
          image={
            venuesData.images && venuesData.images[0].url
              ? venuesData.images[0].url
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
                {venuesData && venuesData.name ? (
                  <dd>{venuesData.name}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Offical Site:</dt>
                {venuesData && venuesData.url ? (
                  <dd>
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href={venuesData.url}
                    >
                      {venuesData.name} Offical Site
                    </a>
                  </dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Upcoming Events:</dt>
                {venuesData && venuesData.upcomingEvents ? (
                  <dd>{venuesData.upcomingEvents.ticketmaster}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Address:</dt>
                {venuesData && venuesData.address ? (
                  <dd>{venuesData.address.line1}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">City:</dt>
                {venuesData && venuesData.city ? (
                  <dd>{venuesData.city.name}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">State:</dt>
                {venuesData && venuesData.state ? (
                  <dd>{venuesData.state.name}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>

              <p>
                <dt className="title">Country:</dt>
                {venuesData && venuesData.country ? (
                  <dd>{venuesData.country.name}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Coordinates:</dt>
                {venuesData && venuesData.location ? (
                  <dd>
                    {venuesData.location.longitude},
                    {venuesData.location.latitude}
                  </dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Open Hours:</dt>
                {venuesData && venuesData.boxOfficeInfo ? (
                  <dd>{venuesData.boxOfficeInfo.openHoursDetail}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Phone Details:</dt>
                {venuesData && venuesData.boxOfficeInfo ? (
                  <dd>{venuesData.boxOfficeInfo.phoneNumberDetail}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Payment Methods:</dt>
                {venuesData && venuesData.boxOfficeInfo ? (
                  <dd>{venuesData.boxOfficeInfo.acceptedPaymentDetail}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Parking Accomodations:</dt>
                {venuesData && venuesData.parkingDetail ? (
                  <dd>{venuesData.parkingDetail}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Important Rules:</dt>
                {venuesData && venuesData.generalInfo ? (
                  <dd>{venuesData.generalInfo.generalRule}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Disability Emergency Contact:</dt>
                {venuesData && venuesData.ada ? (
                  <dd>{venuesData.ada.adaPhones}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>
              <p>
                <dt className="title">Disability Service Hours:</dt>
                {venuesData && venuesData.ada ? (
                  <dd>{venuesData.ada.adaHours}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </p>

              <p>
                <dt className="title">Summary:</dt>
                <dd>{url}</dd>
              </p>
            </dl>
            <Link to="/venues/pages/1">Back to all shows...</Link>
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default Venues;
