import React, { useCallback, useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import Close from "../images/close.png";
import Loading from "./Loading";

const EditTeam = ({ edit, setEdit, currentId, setDidChangeData }) => {
  const [team, setTeam] = useState("");
  const [teamError, setTeamError] = useState(false);
  const [teamHasError, setTeamHasError] = useState(true);

  const [members, setMembers] = useState("");
  const [membersError, setMembersError] = useState(false);
  const [membersHasError, setMembersHasError] = useState(true);

  const [data, setData] = useState({});

  useEffect(async () => {
    const getData = async () => {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamId: currentId,
        }),
      };

      try {
        const res = await fetch("/api/user/infoTeam", options);
        const data = await res.json();

        setData(data[0]);
        setTeam(data[0].teamName);
        setMembers(data[0].maxMembersCount);
      } catch (e) {
        console.error({ message: e.message });
      }
    };
    await getData();
  }, []);

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

    if (e.target.value.length === 0 || e.target.value == 0) {
      setMembersError(true);
      setMembersError(true);
    } else {
      setMembersError(false);
      setMembersHasError(false);
    }
  };

  const saveData = async () => {
    if (teamHasError && membersHasError) {
      console.log("Error");
    } else {
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": localStorage["Token"],
        },
        body: JSON.stringify({
          teamName: team,
          membersCount: members,
          teamId: currentId,
        }),
      };

      try {
        const res = await fetch("/api/admin/editTeam", options);
        const data = await res.json();

        if (data.isOk) {
          setDidChangeData(true);
        }
      } catch (e) {
        console.error(e);
      }

      setEdit(!edit);
    }
  };

  return (
    <section className={edit ? "view-modal" : "view-modal-close"}>
      {Object.keys(data).length === 0 && <Loading />}
      {Object.keys(data).length !== 0 && (
        <div
          className="view-modal-wrapper"
          style={{ width: "400px", height: "auto" }}
        >
          <div className="close-container">
            <img
              src={Close}
              alt="Close"
              onClick={() => {
                setEdit(false);
              }}
            />
          </div>
          <h1 style={{ color: "black" }}>Edit Team</h1>
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
            <TextField
              label="Team"
              variant="standard"
              defaultValue={data.teamName}
              onChange={teamChange}
            />
            <Box component="span" sx={{ color: "red", margin: "20px 0" }}>
              {teamError ? "Team name can't be empty" : ""}
            </Box>
            <TextField
              label="Maximum Members"
              type={"number"}
              variant="standard"
              defaultValue={data.maxMembersCount}
              onChange={membersChange}
            />
            <Box component="span" sx={{ color: "red", margin: "20px 0" }}>
              {membersError ? "Members number is invalid" : ""}
            </Box>
            <Button
              color="primary"
              variant="contained"
              style={{ marginTop: "30px" }}
              onClick={saveData}
            >
              Save
            </Button>
          </Box>
        </div>
      )}
    </section>
  );
};

export default EditTeam;
