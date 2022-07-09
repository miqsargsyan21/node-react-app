import React, { useEffect, useState } from "react";
import Close from "../images/close.png";
import GirlAvatar from "../images/woman.png";
import ManAvatar from "../images/man.png";
import Loading from "./Loading";

const ViewModal = ({ view, setView, currentId }) => {
  const [data, setData] = useState({});

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

      try {
        const res = await fetch("/api/user/info", options);
        const data = await res.json();

        setTimeout(() => {
          if (data) {
            setData(data[0]);
          }
        }, 1000);
      } catch (e) {
        console.error({ message: e.message });
      }
    };
    await getData();
  }, []);

  return (
    <section className={view ? "view-modal" : "view-modal-close"}>
      {data ? Object.keys(data)?.length === 0 && <Loading /> : null}
      {data
        ? Object.keys(data)?.length !== 0 && (
            <div className="view-modal-wrapper">
              <div className="close-container">
                <img
                  src={Close}
                  alt="Close"
                  onClick={() => {
                    setView(!view);
                  }}
                />
              </div>
              <div className="view-admin">
                <img
                  src={data.gender === "male" ? ManAvatar : GirlAvatar}
                  alt="Avatar"
                />
              </div>
              <h1>{data.username}</h1>
              <div className="view-subtitle">
                <h3>{data.firstName}</h3>
                <h3>{data.lastName}</h3>
                <h3>{data.email}</h3>
                <h3>{data.gender}</h3>
                <h3>{data.dateOfBirth}</h3>
                <h3>{data.teamName}</h3>
              </div>
            </div>
          )
        : null}
    </section>
  );
};

export default ViewModal;
