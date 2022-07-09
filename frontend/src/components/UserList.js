import React, { createContext, useContext, useState, useEffect } from "react";
import "./UserList.css";
import View from "../images/list.png";
import Delete from "../images/bin.png";
import Edit from "../images/editing.png";
import EditUser from "./EditUser";
import { HomeContext } from "../App";
import Loading from "./Loading";
import { Button } from "@mui/material";
import Hat from "../images/party-hat.png"
import ViewModal from "./ViewModal";
import AddUser from "./AddUser";

const isBirthday = (month, day) => {
  const date = new Date();

  const currentMonth = date.getMonth() + 1;

  const currentDay = date.getDate();

  if (currentMonth === month && day >= currentDay) {
    return true;
  }
  if (((currentMonth <= month && month <= currentMonth + 1) || (currentMonth === 12 && month === 1)) && currentDay >= day) {
    return true;
  }
  return false;
}

function UserList() {
  const { userData } = useContext(HomeContext);

  const [didChangeData, setDidChangeData] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [loader, setLoader] = useState(true);
  const [view, setView] = useState(false);
  const [edit, setEdit] = useState(false);
  const [add, setAdd] = useState(false);
  const [currentTeamId, setCurrentTeamId] = useState(null);

  const viewAdd = () => {
    setAdd(!add);
  };

  const viewModal = (id, item) => () => {
    setView(!view);
    setCurrentId(id);
  };

  const viewEdit = (id, teamId) => () => {
    setCurrentTeamId(teamId);
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
        id: id,
      }),
    };

    try {
      const res = await fetch("/api/admin/delete", options);
      const data = await res.json();

      if (data.isOk) {
        setUsersData(data.data);
      }
    } catch (e) {
      console.error({ message: e.message });
    }
  };

  const [usersData, setUsersData] = useState({});

  useEffect(async () => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage["Token"],
      },
    };

    const getUserBirth = async () => {
      const userMonth = parseInt(userData.dateOfBirth.slice(5,7));

      console.log("User Month",userMonth)

      const userDay = parseInt(userData.dateOfBirth.slice(8,10));

      console.log("User Day",userDay);

      const date = new Date();

      const currentMonth = date.getMonth() + 1;

      const currentDay = date.getDate();

      console.log("Current Month",currentMonth)

      console.log("Current Day",currentDay)

      console.log( typeof  currentMonth)
      if (currentMonth <= userMonth && userMonth <= currentMonth + 1 && currentDay >= userDay) {
        console.log("Yess")
      } else {
        console.log("NO")
      }
    };

    if (Object.keys(userData).length) {
      getUserBirth();
    }

    try {
      const res = await fetch("/api/home/users", options);
      const data = await res.json();

      setUsersData(data);
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
              <Button onClick={viewAdd}>Add +</Button>
            </section>
          </div>
        ) : null}
        <section className="user-list">
          <table>
            <thead>
              <tr className="title-list">
                <th>User Name</th>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Gender</th>
                <th>Date</th>
                {userData.isAdmin ? <th>Team</th> : ""}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersData.map((item, index) => (
                <tr key={index}>
                  <td><img className={isBirthday(parseInt(item.dateOfBirth.slice(5,7)), parseInt(item.dateOfBirth.slice(8,10))) ? 'hat' : 'noneHat'} src={ isBirthday(parseInt(item.dateOfBirth.slice(5,7)), parseInt(item.dateOfBirth.slice(8,10))) ? Hat : ''} /> {item.username}</td>
                  <td>{item.email}</td>
                  <td>{item.firstName}</td>
                  <td>{item.lastName}</td>
                  <td>{item.gender}</td>
                  <td>{item.dateOfBirth}</td>
                  {userData.isAdmin ? <td>{item.teamName}</td> : ""}
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
                          onClick={viewEdit(item.id, item.teamId)}
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
          {usersData.length ? (
            ""
          ) : (
            <h1 className={"no-users"}>No users yet ...</h1>
          )}
        </section>
      </div>

      {add && (
        <AddUser
          add={add}
          setAdd={setAdd}
          setDidChangeData={setDidChangeData}
        />
      )}

      {view && (
        <ViewModal view={view} setView={setView} currentId={currentId} />
      )}

      {edit && (
        <EditUser
          teamCurrentId={currentTeamId}
          edit={edit}
          setEdit={setEdit}
          currentId={currentId}
          setDidChangeData={setDidChangeData}
        />
      )}
    </main>
  );
}

export default UserList;
