import React, { useCallback, useContext, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@mui/material/Box";
import { Link, useHistory } from "react-router-dom";
import { HomeContext } from "../App";

function Login() {
  const { setUserData, setShowUserImg } = useContext(HomeContext);

  const [messageState, setMessageState] = useState("");

  const history = useHistory();

  const { handleSetToken } = useContext(HomeContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [userError, setUserError] = useState(false);
  const [passError, setPassError] = useState(false);

  const [userHasError, setUserHasError] = useState(true);
  const [passHasError, setPassHasError] = useState(true);

  const userChange = (e) => {
    setMessageState("");
    setUsername(e.target.value);
    let sample = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/;
    if (!sample.test(e.target.value)) {
      setUserError(true);
      setUserHasError(true);
    } else {
      setUserError(false);
      setUserHasError(false);
    }
  };

  const passChange = (e) => {
    setMessageState("");
    setPassword(e.target.value);
    let passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{6,20}$/);
    if (!passwordRegex.test(e.target.value)) {
      setPassError(true);
      setPassHasError(true);
    } else {
      setPassError(false);
      setPassHasError(false);
    }
  };

  let isDisabled = !userHasError && !passHasError ? false : true;

  const onValidate = async () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    };

    try {
      const res = await fetch("/api/user/login", options);
      const data = await res.json();
      setUserData(data.dataUser);
      setShowUserImg(true);

      if (!data.isOk) {
        setMessageState(data.message);
      } else {
        handleSetToken(data.accessToken);
        history.push("/");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "400px",
          height: "100vh",
          margin: "0 auto",
        }}
      >
        <TextField
          label="Username"
          variant="standard"
          error={userError}
          value={username}
          onChange={userChange}
        />
        <Box component="span" sx={{ color: "red", marginTop: "10px" }}>
          {userError ? "Username must be more than 3" : ""}
        </Box>
        <TextField
          label="Password"
          type="password"
          variant="standard"
          error={passError}
          style={{ marginTop: "30px" }}
          value={password}
          onChange={passChange}
        />
        <Box component="span" sx={{ color: "red", marginTop: "10px" }}>
          {passError ? "Password is invalid" : ""}
        </Box>
        <Box component="span" sx={{ color: "orange", marginTop: "10px" }}>
          {messageState}
        </Box>
        <Button
          color="primary"
          variant="contained"
          style={{ marginTop: "30px" }}
          disabled={isDisabled}
          onClick={onValidate}
        >
          Login
        </Button>
        <Link to="/register" style={{ textDecoration: "none" }}>
          <Button
            variant="outlined"
            style={{ marginTop: "30px", width: "100%" }}
          >
            Register
          </Button>
        </Link>
      </Box>
    </div>
  );
}

export default Login;
