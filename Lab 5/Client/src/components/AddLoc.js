import React, { useState } from "react";
import { useMutation } from "@apollo/client";

const Form = ({ query }) => {
  const [imgUrl, setImgUrl] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validURL(imgUrl)) {
      alert("Invalid Image url");
      return;
    }
    createPost({
      variables: {
        image: imgUrl,
        address: address,
        name: name,
      },
    });
    setImgUrl("");
    setAddress("");
    setName("");
    window.location.reload();
  };

  function validURL(str) {
    var pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  }

  const [createPost] = useMutation(query);

  return (
    <form onSubmit={handleSubmit}>
      <label>
        <br />
        <br />
        URL of Image:
        <input
          type="text"
          value={imgUrl}
          onChange={(event) => setImgUrl(event.target.value)}
        />
      </label>
      <br />
      <br />
      <br />
      <label>
        Address:
        <input
          type="text"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />
      </label>
      <br />
      <br />
      <br />
      <label>
        Location Name:
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Form;
