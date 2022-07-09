import React, { useCallback, useState } from "react";
import Close from "../images/close.png";
import TextField from "@material-ui/core/TextField";
import Box from "@mui/material/Box";
import Button from "@material-ui/core/Button";

const AddTeam = ({ add, setAdd, setDidChangeData }) => {
  const [team, setTeam] = useState("");
  const [teamError, setTeamError] = useState(false);
  const [teamHasError, setTeamHasError] = useState(true);

  const [members, setMembers] = useState("");
  const [membersError, setMembersError] = useState(false);
  const [membersHasError, setMembersHasError] = useState(true);

  const teamChange = (e) => {
    setTeam(e.target.value);
    if (e.target.value.length === 0) {
      setTeamError(true);
      setTeamHasError(true);
    } else {
      setTeamError(false);
      setTeamHasError(false);
    }
  };

  const membersChange = (e) => {
    setMembers(e.target.value);
    if (
      e.target.value.length === 0 ||
      e.target.value === 0 ||
      e.target.value < 0 ||
      e.target.value === ""
    ) {
      setMembersError(true);
      setMembersError(true);
    } else {
      setMembersError(false);
      setMembersHasError(false);
    }
  };

  let isDisabled =
    !teamHasError && !membersHasError && !membersError ? false : true;

  const createTeam = async () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage["Token"],
      },
      body: JSON.stringify({
        teamName: team,
        membersCount: parseInt(members),
      }),
    };
    try {
      const res = await fetch("/api/admin/addTeam", options);
      const data = await res.json();

      if (data.isOk) {
        setAdd(!add);
        setDidChangeData(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className={add ? "view-modal" : "view-modal-close"}>
      <div
        className="view-modal-wrapper"
        style={{ width: "400px", height: "auto" }}
      >
        <div className="close-container">
          <img
            src={Close}
            alt="Close"
            onClick={() => {
              setAdd(false);
            }}
          />
        </div>
        <h1 style={{ color: "black" }}>Create Team</h1>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "300px",
            margin: "0 auto",
            padding: "30px 0",
          }}
        >
          <TextField label="Team" variant="standard" onChange={teamChange} />
          <Box component="span" sx={{ color: "red", margin: "20px 0" }}>
            {teamError ? "Team name can't be empty" : ""}
          </Box>
          <TextField
            label="Maximum Members"
            type={"number"}
            variant="standard"
            onChange={membersChange}
          />
          <Box component="span" sx={{ color: "red", margin: "20px 0" }}>
            {membersError ? "Members number is invalid" : ""}
          </Box>
          <Button
            color="primary"
            variant="contained"
            style={{ marginTop: "30px" }}
            disabled={isDisabled}
            onClick={createTeam}
          >
            Create Team
          </Button>
        </Box>
      </div>
    </section>
  );
};

export default AddTeam;
