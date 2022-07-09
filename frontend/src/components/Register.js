import React, { useState, useCallback } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@mui/material/Box";
import { Link, useHistory } from "react-router-dom";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("male");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [date, setDate] = useState("03-03-2003");

  const [emailError, setEmailError] = useState(false);
  const [userError, setUserError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [passError, setPassError] = useState(false);
  const [confirmError, setConfirmError] = useState(false);

  const [emailHasError, setEmailHasError] = useState(true);
  const [userHasError, setUserHasError] = useState(true);
  const [firstNameHasError, setFirstNameHasError] = useState(true);
  const [lastNameHasError, setLastNameHasError] = useState(true);
  const [passHasError, setPassHasError] = useState(true);
  const [confirmHasError, setConfirmHasError] = useState(true);

  const [messageState, setMessageState] = useState("");

  const history = useHistory();

  const emailChange = (e) => {
    setMessageState("");
    setEmail(e.target.value);
    let emailRegex = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    if (!emailRegex.test(e.target.value)) {
      setEmailError(true);
      setEmailHasError(true);
    } else {
      setEmailError(false);
      setEmailHasError(false);
    }
  };

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

  const firstNameChange = (e) => {
    setFirstName(e.target.value);
    if (e.target.value.length < 1) {
      setFirstNameError(true);
      setFirstNameHasError(true);
    } else {
      setFirstNameError(false);
      setFirstNameHasError(false);
    }
  };

  const lastNameChange = (e) => {
    setLastName(e.target.value);
    if (e.target.value.length < 1) {
      setLastNameError(true);
      setLastNameHasError(true);
    } else {
      setLastNameError(false);
      setLastNameHasError(false);
    }
  };

  const passChange = (e) => {
    setPassword(e.target.value);
    let passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{6,}$/);
    if (!passwordRegex.test(e.target.value)) {
      setPassError(true);
      setPassHasError(true);
    } else {
      setPassError(false);
      setPassHasError(false);
    }
  };

  const confirmChange = (e) => {
    setConfirmPassword(e.target.value);
    if (password !== e.target.value) {
      setConfirmError(true);
      setConfirmHasError(true);
    } else {
      setConfirmError(false);
      setConfirmHasError(false);
    }
  };

  let isDisabled =
    !userHasError &&
    !passHasError &&
    !emailHasError &&
    !firstNameHasError &&
    !lastNameHasError &&
    !confirmHasError
      ? false
      : true;

  const onRegister = async () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        username,
        password,
        secondPassword: confirmPassword,
        gender: gender,
        dateOfBirth: date,
      }),
    };

    try {
      const res = await fetch("/api/user/register", options);
      const data = await res.json();

      if (data.message) {
        history.push("/login");
      } else {
        if (data.failedFields.length === 1) {
          setMessageState(
            `${data.failedFields[0]} is already exists. Please change it.`
          );
        } else if (data.failedFields.length === 2) {
          setMessageState(
            `${data.failedFields[0]} and ${data.failedFields[1]} are already exists. Please change it.`
          );
        }
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
          margin: "0 auto",
          padding: "30px 0",
        }}
      >
        <TextField
          label="Email"
          variant="standard"
          value={email}
          onChange={emailChange}
        />
        <Box component="span" sx={{ color: "red", marginTop: "10px" }}>
          {emailError ? "Email is invalid" : ""}
        </Box>
        <TextField
          label="Username"
          variant="standard"
          style={{ marginTop: "30px" }}
          value={username}
          onChange={userChange}
        />
        <Box component="span" sx={{ color: "red", marginTop: "10px" }}>
          {userError
            ? "Username must contain uppercase, lowercase, number, from 6 to 20 characters "
            : ""}
        </Box>
        <TextField
          label="First Name"
          variant="standard"
          style={{ marginTop: "30px" }}
          onChange={firstNameChange}
        />
        <Box component="span" sx={{ color: "red", marginTop: "10px" }}>
          {firstNameError ? "First name cannot be empty" : ""}
        </Box>
        <TextField
          label="Last Name"
          variant="standard"
          style={{ marginTop: "30px" }}
          onChange={lastNameChange}
        />
        <Box component="span" sx={{ color: "red", marginTop: "10px" }}>
          {lastNameError ? "Last name cannot be empty" : ""}
        </Box>
        <input
          style={{ marginTop: "40px", height: "50px", fontSize: "20px" }}
          type="date"
          id="start"
          name="trip-start"
          defaultValue={"2003-03-03"}
          // value={date}
          max="2020-12-31"
          onChange={(e) => setDate(e.target.value)}
        />
        {/*Gender*/}
        <FormControl component="fieldset" style={{ marginTop: "50px" }}>
          <FormLabel component="legend">Gender</FormLabel>
          <RadioGroup
            aria-label="gender"
            defaultValue="male"
            name="radio-buttons-group"
            onChange={(e) => {
              setGender(e.target.value);
            }}
          >
            <FormControlLabel
              style={{ marginTop: "10px", marginLeft: 0 }}
              value="male"
              control={<Radio />}
              label="Male"
            />
            <FormControlLabel
              style={{ marginTop: "10px", marginLeft: 0, marginRight: "20px" }}
              value="female"
              control={<Radio />}
              label="Female"
            />
          </RadioGroup>
        </FormControl>

        <TextField
          label="Password"
          type="password"
          variant="standard"
          style={{ marginTop: "30px" }}
          value={password}
          onChange={passChange}
        />
        <Box component="span" sx={{ color: "red", marginTop: "10px" }}>
          {passError
            ? "Password must contain uppercase, lowercase, number, from 6 to 20 characters"
            : ""}
        </Box>
        <TextField
          label="Confirm Password"
          type="password"
          variant="standard"
          style={{ marginTop: "30px" }}
          onChange={confirmChange}
        />
        <Box component="span" sx={{ color: "red", marginTop: "10px" }}>
          {confirmError ? "Passwords do not match" : ""}
        </Box>
        <Box component="span" sx={{ color: "orange", marginTop: "10px" }}>
          {messageState}
        </Box>
        <Button
          color="primary"
          variant="contained"
          style={{ marginTop: "30px" }}
          disabled={isDisabled}
          onClick={onRegister}
        >
          Register
        </Button>
        <Link to="/login" style={{ textDecoration: "none" }}>
          <Button
            variant="outlined"
            style={{ marginTop: "30px", width: "100%" }}
          >
            Back To Login
          </Button>
        </Link>
      </Box>
    </div>
  );
}

export default Register;
