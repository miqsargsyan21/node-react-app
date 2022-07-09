import React, { useState, useCallback, useEffect } from "react";
import Close from "../images/close.png";
import TextField from "@material-ui/core/TextField";
import Box from "@mui/material/Box";
import Button from "@material-ui/core/Button";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Loading from "./Loading";

const EditUser = ({
  edit,
  setEdit,
  currentId,
  setDidChangeData,
  teamCurrentId,
}) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(
    teamCurrentId ? teamCurrentId : 0
  );
  const [date, setDate] = useState(null);
  const [gender, setGender] = useState("male");

  const [emailError, setEmailError] = useState(false);
  const [userError, setUserError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [confirmError, setConfirmError] = useState(false);

  const [emailHasError, setEmailHasError] = useState(true);
  const [userHasError, setUserHasError] = useState(true);
  const [firstNameHasError, setFirstNameHasError] = useState(true);
  const [lastNameHasError, setLastNameHasError] = useState(true);
  const [confirmHasError, setConfirmHasError] = useState(true);

  const [data, setData] = useState({});

  const [teamData, setTeamData] = useState([]);

  useEffect(async () => {
    const getData = async () => {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: currentId,
        }),
      };

      const optionsTeams = {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage["Token"],
        },
      };

      try {
        const res = await fetch("/api/user/info", options);
        const data = await res.json();

        const resTeams = await fetch("/api/admin/teams", optionsTeams);
        const dataTeams = await resTeams.json();

        setTimeout(() => {
          setData(data[0]);
          setEmail(data[0].email);
          setLastName(data[0].lastName);
          setFirstName(data[0].firstName);
          setUsername(data[0].username);
          setDate(data[0].dateOfBirth);
          setTeamData(dataTeams.result);
          setConfirmPassword(data[0].teamId);
        }, 1000);
      } catch (e) {
        console.error({ message: e.message });
      }
    };
    await getData();
  }, []);

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

  const confirmChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value.length < 1) {
      setConfirmError(true);
      setConfirmHasError(true);
    } else {
      setConfirmError(false);
      setConfirmHasError(false);
    }
  };

  const onSave = async () => {
    if (
      userHasError &&
      emailHasError &&
      firstNameHasError &&
      lastNameHasError &&
      confirmHasError
    ) {
      console.log("Error");
    } else {
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage["Token"],
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          username,
          teamId: confirmPassword ? confirmPassword : null,
          gender: gender,
          dateOfBirth: date,
          id: currentId,
        }),
      };

      try {
        const res = await fetch("/api/admin/edit", options);
        const data = await res.json();

        if (!data.isOk) {
          setMessageState(data.message);
        } else if (data.message) {
          setDidChangeData(true);
          setEdit(!edit);
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
    }
  };
  const [messageState, setMessageState] = useState("");

  return (
    <section className={edit ? "edit-modal" : "edit-modal-close"}>
      {Object.keys(data).length === 0 && <Loading />}
      {Object.keys(data).length !== 0 && (
        <div className="edit-modal-wrapper">
          <div className="close-container">
            <img src={Close} alt="Close" onClick={() => setEdit(!edit)} />
          </div>
          <h1>Edit</h1>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: "400px",
              height: "90vh",
              margin: "0 auto",
            }}
          >
            <TextField
              label="Email"
              variant="standard"
              defaultValue={data.email}
              onChange={emailChange}
            />
            <Box component="span" sx={{ color: "red", marginTop: "10px" }}>
              {emailError ? "Email is invalid" : ""}
            </Box>
            <TextField
              label="Username"
              variant="standard"
              style={{ marginTop: "30px" }}
              defaultValue={data.username}
              onChange={userChange}
            />
            <Box
              component="span"
              sx={{
                color: "red",
                marginTop: "10px",
              }}
            >
              {userError
                ? "Username must contain uppercase, lowercase, number, from 6 to 20 characters "
                : ""}
            </Box>
            <TextField
              label="First Name"
              variant="standard"
              style={{ marginTop: "30px" }}
              defaultValue={data.firstName}
              onChange={firstNameChange}
            />
            <Box
              component="span"
              sx={{
                color: "red",
                marginTop: "10px",
              }}
            >
              {firstNameError ? "First name cannot be empty" : ""}
            </Box>
            <TextField
              label="Last Name"
              variant="standard"
              style={{ marginTop: "30px" }}
              defaultValue={data.lastName}
              onChange={lastNameChange}
            />
            <Box component="span" sx={{ color: "red", marginTop: "10px" }}>
              {lastNameError ? "Last name cannot be empty" : ""}
            </Box>
            <TextField
              type={"date"}
              style={{ marginTop: "40px", height: "50px", fontSize: "20px" }}
              defaultValue={date}
              onChange={(e) => {
                setDate(e.target.value);
              }}
            />
            <FormControl component="fieldset" style={{ marginTop: "10px" }}>
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup
                aria-label="gender"
                defaultValue={data.gender}
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
                  style={{
                    marginTop: "10px",
                    marginLeft: 0,
                    marginRight: "20px",
                  }}
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
              </RadioGroup>
            </FormControl>

            <select style={{ marginTop: "20px" }} onChange={confirmChange}>
              <option value={0}>-</option>
              {teamData.map((item, index) => (
                <option
                  value={item.id}
                  selected={item.id === teamCurrentId ? true : false}
                >
                  {item.teamName}
                </option>
              ))}
            </select>
            <Box component="span" sx={{ color: "red", marginTop: "10px" }}>
              {confirmError ? "Team cannot be empty" : ""}
            </Box>
            <Box component="span" sx={{ color: "orange", marginTop: "10px" }}>
              {messageState}
            </Box>
            <Button
              color="primary"
              variant="contained"
              style={{ marginTop: "30px" }}
              onClick={onSave}
            >
              Save
            </Button>
          </Box>
        </div>
      )}
    </section>
  );
};

export default EditUser;
