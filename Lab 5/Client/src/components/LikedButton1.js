import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import queries from "../queries";

const LikedButton1 = ({ address, id, image, liked, name, userPosted }) => {
  const [button, toggleButton] = useState(liked);
  const [editLocation] = useMutation(queries.EDIT_LOCATION);
  const handleSubmit = () => {
    editLocation({
      variables: {
        id: id,
        image: image,
        name: name,
        address: address,
        userPosted: userPosted,
        liked: !button,
      },
    });
    toggleButton(!button);
    window.location.reload();
  };
  // console.log(!button);
  // console.log(address + " " + id + " " + name + " " + liked);
  return (
    <div>
      <button onClick={() => handleSubmit()}>
        {!button ? `Like` : `Unlike`}
      </button>
    </div>
  );
};

export default LikedButton1;
