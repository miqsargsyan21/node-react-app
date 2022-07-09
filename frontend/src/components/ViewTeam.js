import React, { useEffect, useState } from "react";
import Close from "../images/close.png";
import Loading from "./Loading";

function ViewTeam({ view, setView, currentId }) {
  const [data, setData] = useState({});
  const [loader, setLoader] = useState(true);

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
        setTimeout(() => {
          setLoader(false);
        }, 1000);
      } catch (e) {
        console.error({ message: e.message });
      }
    };
    await getData();
  }, []);

  return (
    <section className={view ? "view-modal" : "view-modal-close"}>
      {loader ? (
        <Loading />
      ) : (
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
          <h1>{data.teamName}</h1>
          <div className="view-subtitle">
            <h3>Members count is {data.membersCount}</h3>
            <h3>Max members count is {data.maxMembersCount}</h3>
          </div>
        </div>
      )}
    </section>
  );
}

export default ViewTeam;
