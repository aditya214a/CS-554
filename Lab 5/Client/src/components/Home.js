import React, { useState, useEffect } from "react";
import "../App.css";
import { useQuery, useMutation } from "@apollo/client";
import LikedButton from "./LikedButton";
import LikedButton1 from "./LikedButton1";
import queries from "../queries";
import noImage from "../img/download.jpeg";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
const Home = ({ query, page, del }) => {
  const [pageNum, setPageNum] = useState(1);
  const [locData, setLocData] = useState([]);
  const [like, setLike] = useState(false);
  const [deleteLocation] = useMutation(queries.DELETE_LOCATION);
  // if (page) {
  //   setPageNum(page);
  // }
  const { loading, error, data } = useQuery(query, {
    variables: { pageNum: pageNum },
  });

  useEffect(() => {
    if (data) {
      console.log(data);
      if (data.locationPosts) setLocData(data.locationPosts);
      else if (data.likedLocations) {
        setLocData(data.likedLocations);
        setLike(true);
      } else if (data.userPostedLocations) setLocData(data.userPostedLocations);
    }
    // console.log(locData);
  }, [data, locData]);

  const deleteCard = (location) => {
    console.log(location);
    deleteLocation({
      variables: {
        id: location.id,
      },
    });
    window.location.reload();
  };
  const loadLoc = () => setPageNum(pageNum + 1);
  if (data) {
    return (
      <div>
        <h2>Home</h2>
        <Grid
          container
          spacing={3}
          sx={{
            flexGrow: 1,
            flexDirection: "row",
          }}
        >
          {locData.map((loc) => {
            return (
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
                key={loc.id}
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
                    <CardMedia
                      sx={{
                        height: "100%",
                        width: "100%",
                      }}
                      component="img"
                      image={loc.image ? loc.image : noImage}
                      // title="Location image"
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
                        {loc.name}
                      </Typography>
                      <Typography
                        sx={{
                          borderBottom: "1px solid #024ddf",
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
                          borderBottom: "1px solid #024ddf",
                          fontWeight: "bold",
                        }}
                        gutterBottom
                        variant="h6"
                        component="h3"
                      >
                        {like === true ? (
                          <LikedButton1 {...loc} />
                        ) : (
                          <LikedButton {...loc} />
                        )}
                        {del && (
                          <button onClick={() => deleteCard(loc)}>
                            Delete
                          </button>
                        )}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
        <button className="getMore" onClick={loadLoc}>
          Get More
        </button>
      </div>
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

export default Home;
