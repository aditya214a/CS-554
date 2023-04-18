import React, { useState, useEffect } from "react";
import "../App.css";
import { useQuery } from "@apollo/client";
import LikedButton1 from "./LikedButton1";
import noImage from "../img/download.jpeg";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
const LikeLocation = ({ query }) => {
  const [locData, setLocData] = useState([]);

  const { loading, error, data } = useQuery(query);
  useEffect(() => {
    if (data) {
      // console.log(data);
      // console.log(data.likedLocations);
      if (data.likedLocations) setLocData(data.likedLocations);
    }
    // console.log(locData);
  }, [data, locData]);

  if (data) {
    return (
      <Grid item xs={12} sm={7} md={5} lg={4} xl={3}>
        <h2>My Liked</h2>
        {locData.map((loc) => {
          return (
            <li className="post" key={loc.id}>
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
                  <CardMedia
                    sx={{
                      height: "100%",
                      width: "100%",
                    }}
                    component="img"
                    image={loc.image ? loc.image : noImage}
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
                      {loc.name}
                    </Typography>
                    <Typography
                      sx={{
                        borderBottom: "1px solid #1e8678",
                        fontWeight: "bold",
                      }}
                      gutterBottom
                      variant="h6"
                      component="h3"
                    >
                      {loc.address}
                    </Typography>
                    <Typography
                      sx={{
                        borderBottom: "1px solid #1e8678",
                        fontWeight: "bold",
                      }}
                      gutterBottom
                      variant="h6"
                      component="h3"
                    >
                      <LikedButton1 {...loc} />
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </li>
          );
        })}
      </Grid>
    );
  } else if (loading) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <h2>{error.message}</h2>
      </div>
    );
  }
};

export default LikeLocation;
