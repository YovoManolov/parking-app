'use client';

import React, { useState, useEffect } from "react";

export default function ParkingApp() {

  const [parkingStatus, setParkingStatus] = useState({});

    // Fetch parking status from DynamoDB when the component mounts
    useEffect(() => {
      fetch("/api/parking")
        .then((res) => res.json())
        .then((data) => setParkingStatus(data));
    }, []);

  const toggleStatus = (slot) => {
    const newStatus = parkingStatus[slot] === "free" ? "used" : "free";

    setParkingStatus((prev) => ({
      ...prev,
      [slot]: newStatus,
    }));

    // Call API to update database
    updateParkingStatus(slot, newStatus);
  };

  const updateParkingStatus = async (slotId) => {
    const newStatus = parkingStatus[slotId] === "free" ? "used" : "free";
  
    await fetch("/api/parking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: slotId, newStatus }),
    });
  
    setParkingStatus({ ...parkingStatus, [slotId]: newStatus });
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
    
    <h1 className="title">Infosys Parking</h1>
    
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gridTemplateRows: "auto auto auto",
      gap: "10px",
      width: "300px",
      margin: "auto",
      padding: "20px",
    }}>
      
      {/* First Row */}
      <div style={{ ...slotStyle(parkingStatus["P1"]), marginBottom: "28px" }} onClick={() => toggleStatus("P1")}>3.063 ({parkingStatus["P1"]})</div>
      <div style={{ ...slotStyle(parkingStatus["P2"]), marginBottom: "28px" }} onClick={() => toggleStatus("P2")}>3.062 ({parkingStatus["P2"]})</div>
      <div style={{ ...slotStyle(parkingStatus["P3"]), marginBottom: "28px" }} onClick={() => toggleStatus("P3")}>3.061 ({parkingStatus["P3"]})</div>


      {/* Second Row */}
      <div style={slotStyle(parkingStatus["P4"])} onClick={() => toggleStatus("P4")}>3.051 ({parkingStatus["P4"]})</div>
      <div style={slotStyle(parkingStatus["P5"])} onClick={() => toggleStatus("P5")}>3.050 ({parkingStatus["P5"]})</div>
      <div style={slotStyle(parkingStatus["P6"])} onClick={() => toggleStatus("P6")}>3.049 ({parkingStatus["P6"]})</div>

      {/* Third Row - Larger Blocks */}
      <div style={{ ...slotStyle(parkingStatus["P8"]), gridColumn: "span 2" }} onClick={() => toggleStatus("P8")}>
        3.052 ({parkingStatus["P8"]})
      </div>
      <div style={{ ...slotStyle(parkingStatus["P7"]), gridRow: "span 2" }} onClick={() => toggleStatus("P7")}>
        3.049A ({parkingStatus["P7"]})
      </div>
      <div style={{ ...slotStyle(parkingStatus["P9"]), gridColumn: "span 2" }} onClick={() => toggleStatus("P9")}>
        3.053 ({parkingStatus["P9"]})
      </div>
    </div>
  </div>
  );
}

const slotStyle = (status) => ({
  background: status === "free" ? "green" : "red",
  color: "white",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
  borderRadius: "5px",
});



