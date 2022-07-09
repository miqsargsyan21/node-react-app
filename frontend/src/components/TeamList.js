import React, { useContext, useEffect, useState } from "react";
import Loading from "../components/Loading";
import View from "../images/list.png";
import Delete from "../images/bin.png";
import Edit from "../images/editing.png";
import { Button } from "@mui/material";
import { HomeContext } from "../App";
import "./TeamList.css";
import AddTeam from "./AddTeam";
import EditTeam from "./EditTeam";
import ViewTeam from "./ViewTeam";

function TeamList() {
  const { userData } = useContext(HomeContext);

  const [currentId, setCurrentId] = useState(null);

  const [didChangeData, setDidChangeData] = useState(false);

  const [loader, setLoader] = useState(true);

  const [edit, setEdit] = useState(false);

  const [teamData, setTeamData] = useState({});

  const [view, setView] = useState(false);

  const [add, setAdd] = useState(false);

  const viewModal = (id) => () => {
    setCurrentId(id);
    setView(!view);
  };

  const viewEdit = (id) => () => {
    setEdit(!edit);
    setCurrentId(id);
  };

  const viewDelete = (id) => async () => {
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage["Token"],
      },
      body: JSON.stringify({
        teamId: id,
      }),
    };

    try {
      const res = await fetch("/api/admin/deleteTeam", options);
      const data = await res.json();
      if (data.isOk) {
        setDidChangeData(true);
      }
    } catch (e) {
      console.error({ message: e.message });
    }
  };

  const handleTeam = () => {
    setAdd(true);
  };

  useEffect(async () => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage["Token"],
      },
    };

    try {
      const res = await fetch("/api/home/teams", options);
      const data = await res.json();

      setTeamData(data);
      setDidChangeData(false);
      setTimeout(() => {
        setLoader(false);
      }, 1000);
    } catch (e) {
      console.error(e);
    }
  }, [didChangeData]);

  if (loader) {
    return <Loading />;
  }
  return (
    <main>
      <div>
        {userData.isAdmin ? (
          <div className="add">
            <section className="add-team-section">
              <Button
                onClick={handleTeam}
                style={{ width: "200px" }}
                className={"add-team-button"}
              >
                Create Team
              </Button>
            </section>
          </div>
        ) : null}
        <section className="team-list">
          <table>
            <thead>
              <tr className="team-list-title">
                {userData.isAdmin ? <th>ID</th> : null}
                <th>Name</th>
                <th>Members</th>
                {userData.isAdmin ? <th>Max Count</th> : null}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamData.map((item, index) => (
                <tr key={index}>
                  {userData.isAdmin ? <td>{item.id}</td> : null}
                  <td>{item.teamName}</td>
                  <td>{item.membersCount}</td>
                  {userData.isAdmin ? <td>{item.maxMembersCount}</td> : null}
                  <td className="image-td">
                    {userData.isAdmin ? (
                      <>
                        <img
                          src={View}
                          alt="view"
                          onClick={viewModal(item.id)}
                        />
                        <img
                          src={Edit}
                          alt="edit"
                          onClick={viewEdit(item.id)}
                        />
                        <img
                          src={Delete}
                          alt="delete"
                          onClick={viewDelete(item.id)}
                        />
                      </>
                    ) : (
                      <img src={View} alt="view" onClick={viewModal(item.id)} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {teamData.length === 0 && (
            <h1 className="no-users">You are not included in the team</h1>
          )}
        </section>
      </div>
      {add && (
        <AddTeam
          add={add}
          setAdd={setAdd}
          setDidChangeData={setDidChangeData}
        />
      )}

      {view && <ViewTeam view={view} setView={setView} currentId={currentId} />}

      {edit && (
        <EditTeam
          edit={edit}
          setEdit={setEdit}
          currentId={currentId}
          setDidChangeData={setDidChangeData}
        />
      )}
    </main>
  );
}
export default TeamList;
