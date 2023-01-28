import React, { useEffect, useState } from "react";
import { Stack, Box } from "@mui/system";
import {
  Button,
  Input,
  TextField,
  Alert,
  Snackbar,
  getImageListItemBarUtilityClass,
  IconButton,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import "./index.css";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

// import CircularProgress from '@material-ui/core/CircularProgress';

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [EditingId, setEditingId] = useState("");
  const [data, setData] = useState([]);
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [getData, setGetData] = useState(false);
  const [opens, setOpens] = useState(false);
  const [loader, setLoader] = useState(false);
  const [newLoader, setNewLoader] = useState(false);
  const [mtype, setMtype] = useState("");
  const [messages, setMessages] = useState("");
  const [preview, setPreview] = useState("");
  const [EditPreview, setEditPreview] = useState("");

  let baseUrl = "";
  if (window.location.href.split(":")[0] === "http") {
    baseUrl = "http://localhost:5001";
  }
  useEffect(() => {
    getAllUsers();
  }, [getData]);
  // const NewLoginData = async (e) => {
  //   e.preventDefault();
  //   try {
  //     let response = await axios.post(`${baseUrl}/send-credentials`, {
  //       email: email,
  //       password: password,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }

  //     let fileInput = document.getElementById("picture");
  //     console.log("fileInput", fileInput.files[0]);
  //     let formData = new FormData();
  //     formData.append("myFiles", fileInput.files[0]);
  //     formData.append("email", email);
  //     formData.append("password", password);
  //     formData.append("imageUrl", preview);
  //     console.log("imageUrl", preview);
  //     setLoader(true);

  //     axios({
  //       method: "post",
  //       url: `${baseUrl}/send-credentails`,
  //       data: formData,
  //       headers: { "Content-Type": "multipart/form-data" },
  //     }).then((res) => {
  //       console.log("response Success", res.data);

  //       // console.log(response);
  //       setGetData(!getData);
  //       setOpens(true);
  //       setMtype("success");
  //       setMessages(res.data.message);
  //       setLoader(false);
  //       console.log(preview);
  //       setTimeout(() => {
  //         setEmail("");
  //         setPassword("");
  //         setPreview("");
  //       }, "1000");

  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setOpens(true);
  //       setMtype("error");
  //       setLoader(false);

  //       if (
  //         err.response.data.message ===
  //         "TypeError: Cannot read properties of undefined (reading 'originalname')"
  //       ) {
  //         setMessages("please select an Image");
  //       } else {
  //         setMessages(err.response.data.message);
  //       }
  //     });
  //   // } catch (error) {}
  // };
  const LoginData = async (e) => {
    e.preventDefault();

    let fileInput = document.getElementById("picture");
    console.log("fileInput", fileInput.files[0]);
    let formData = new FormData();
    formData.append("myFiles", fileInput.files[0]);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("imageUrl", preview);
    console.log("imageUrl", preview);
    setLoader(true);

    axios({
      method: "post",
      url: `${baseUrl}/send-credentails`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        console.log("response Success", res.data);

        // console.log(response);
        setGetData(!getData);
        setOpens(true);
        setMtype("success");
        setMessages(res.data.message);
        setLoader(false);
        console.log(preview);
        setTimeout(() => {
          setEmail("");
          setPassword("");
          setPreview("");
        }, "1000");
        //
      })
      .catch((err) => {
        console.log(err);
        setOpens(true);
        setMtype("error");
        setLoader(false);

        if (
          err.response.data.message ===
          "TypeError: Cannot read properties of undefined (reading 'originalname')"
        ) {
          setMessages("please select an Image");
        } else {
          setMessages(err.response.data.message);
        }
      });
  };
  const getAllUsers = async () => {
    try {
      let response = await axios.get(`${baseUrl}/users`);
      console.log("allData", response.data.data);
      setData(response.data.data.reverse());
    } catch (error) {
      console.log("error", error);
      setOpens(true);
      setMtype("error");
      setMessages(error.response.data.message);
    }
  };
  const dataDelete = async (dataId) => {
    try {
      let response = await axios.delete(`${baseUrl}/user/${dataId}`);
      console.log("deleted", response);
      setGetData(!getData);
      setOpens(true);
      setMtype("success");
      setMessages(response.data.message);
    } catch (error) {
      console.log("error", error);
      setOpens(true);
      setMtype("error");
      setMessages(error.response.data.message);
    }
  };
  const Update = async (e) => {
    e.preventDefault();
    let fileInput = document.getElementById("pictures");
    console.log("fileInput", fileInput.files[0]);
    let formData = new FormData();
    formData.append("myFiles", fileInput.files[0]);
    formData.append("email", editEmail);
    formData.append("password", editPassword);
    console.log("imageUrl", EditPreview);
    setNewLoader(true);
    axios({
      method: "put",
      url: `${baseUrl}/user/${EditingId}`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        console.log("response Success", res.data);

        // console.log(response);
        setGetData(!getData);
        setEditingId("");
        setOpens(true);
        setMtype("success");
        setMessages(res.data.message);
        setNewLoader(false);
        console.log(preview);
      })
      .catch((err) => {
        console.log(err);
        setOpens(true);
        setMtype("error");
        setLoader(false);
        setNewLoader(false);

        if (
          err.response.data.message ===
          "TypeError: Cannot read properties of undefined (reading 'path')"
        ) {
          setMessages("please select an Image");
        } else {
          setMessages(err.response.data.message);
        }
      });
  };
  const Updated = async (e) => {
    e.preventDefault();
    let fileInput = document.getElementById("pictures");
    console.log("fileInput", fileInput.files[0]);
    let formData = new FormData();
    formData.append("myFiles", fileInput.files[0]);
    formData.append("email", editEmail);
    formData.append("password", editPassword);
    console.log("imageUrl", EditPreview);
    setNewLoader(true);
    axios({
      method: "put",
      url: `${baseUrl}/user/${EditingId}`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        console.log("response Success", res.data);

        // console.log(response);
        setGetData(!getData);
        setEditingId("");
        setOpens(true);
        setMtype("success");
        setMessages(res.data.message);
        setNewLoader(false);
        console.log(preview);
      })
      .catch((err) => {
        console.log(err);
        setOpens(true);
        setMtype("error");
        setLoader(false);
        setNewLoader(false);

        if (
          err.response.data.message ===
          "TypeError: Cannot read properties of undefined (reading 'originalname')"
        ) {
          setMessages("please select an Image");
        } else {
          setMessages(err.response.data.message);
        }
      });
  };

  const handleClose = (event, reason) => {
    // e.preventDefault();
    if (reason === "clickaway") {
      return;
    }

    setOpens(false);
  };
  return (
    <Box>
      {/* login Data */}

      <Box className="dataBoxContainer">
        <Box className="giveBorder">
          <h1 className="heading">Login Details</h1>
          {/* Email */}
          <form onSubmit={LoginData}>
            <Box className="emailInput">
              <TextField
                sx={{
                  width: "300px",
                }}
                type="email"
                value={email}
                id="filled-basic2"
                label="Email"
                variant="filled"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </Box>
            {/* Password */}
            <Box className="passwordInput">
              <TextField
                sx={{
                  width: "300px",
                }}
                type="Password"
                id="filled-basic"
                label="Password"
                value={password}
                variant="filled"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </Box>
            {/* upload */}
            <IconButton
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
              color="primary"
              aria-label="upload picture"
              component="label"
            >
              <input
                hidden
                accept="image/*"
                type="file"
                // required
                // value='blob:http://localhost:3000/e4b3814a-526b-40c2-9081-e5886b321179'
                id="picture"
                onChange={(e) => {
                  let url = URL.createObjectURL(e.currentTarget.files[0]);
                  setPreview(url);
                }}
              />
              <PhotoCamera />
            </IconButton>
            <Box className="SubmitButton">
              <Button type="submit" variant="contained">
                Submit
              </Button>
            </Box>
          </form>
        </Box>
      </Box>

      {/* {/* Loader */}
      {loader === true ? (
        <Box className="loader">
          <CircularProgress />
        </Box>
      ) : null}

      {/* Show Lohin Data */}
      {data.map((eachData, i) => (
        <Box key={i} className="showData">
          <Box className="showDataBorder">
            {/* buttons */}
            <Box className="buttons">
              {eachData?._id === EditingId ? (
                null
              ) : (
                <Box className="SPButtons">
                  <Button
                    variant="contained"
                    onClick={() => {
                      setEditingId(eachData?._id);
                      setEditEmail(eachData?.email);
                      setEditPassword(eachData?.password);
                      setEditPreview(eachData?.imageUrl);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    color="error"
                    variant="contained"
                    onClick={(e) => {
                      dataDelete(eachData?._id);
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </Box>
            {/* email */}
            <Box>
              {eachData?._id === EditingId ? (
                <form className="heading2" onSubmit={Update}>
                  <TextField
                    type="email"
                    id="standard-basic"
                    label="Enter Your New Email"
                    value={editEmail}
                    onChange={(e) => {
                      setEditEmail(e.target.value);
                    }}
                  />
                  <Box className="Update">
                    <Button type="submit" color="success" variant="contained">
                      Update
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="warning"
                      onClick={() => {
                        setEditingId("");
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </form>
              ) : (
                <h4 className="heading">Email: {eachData?.email}</h4>
              )}
            </Box>
            {/* password */}
            <Box>
              {eachData?._id === EditingId ? (
                <form className="heading3" onSubmit={Update}>
                  <TextField
                    id="standard-basics"
                    label="Enter Your New Password"
                    value={editPassword}
                    // type="password"
                    // minRows="5"
                    onChange={(e) => setEditPassword(e.target.value)}
                  />
                  <IconButton
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                    color="primary"
                    aria-label="upload picture"
                    component="label"
                  >
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      // required
                      // value={EditPreview}
                      id="pictures"
                      onChange={(e) => {
                        let url = URL.createObjectURL(e.currentTarget.files[0]);
                        setEditPreview(url);
                      }}
                    />
                    <PhotoCamera />
                  </IconButton>
                  {newLoader === true ? <CircularProgress /> : null}
                </form>
              ) : (
                <h4 className="heading">Password: {eachData?.password}</h4>
              )}
            </Box>
            {/* image */}
            <Box className="image">
              <img src={eachData?.imageUrl} />
            </Box>
          </Box>
        </Box>
      ))}

      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar open={opens} autoHideDuration={2000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={mtype} sx={{ width: "100%" }}>
            {messages}
          </Alert>
        </Snackbar>
      </Stack>
    </Box>
  );
};

export default Index;
