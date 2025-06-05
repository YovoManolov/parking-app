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
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gridTemplateRows: "auto auto auto",
      gap: "10px",
      width: "300px",
    }}>
      {/* First Row */}
      <div style={slotStyle(parkingStatus["P1"])} onClick={() => toggleStatus("P1")}>P1 ({parkingStatus["P1"]})</div>
      <div style={slotStyle(parkingStatus["P2"])} onClick={() => toggleStatus("P2")}>P2 ({parkingStatus["P2"]})</div>
      <div style={slotStyle(parkingStatus["P3"])} onClick={() => toggleStatus("P3")}>P3 ({parkingStatus["P3"]})</div>

      {/* Second Row */}
      <div style={slotStyle(parkingStatus["P4"])} onClick={() => toggleStatus("P4")}>P4 ({parkingStatus["P4"]})</div>
      <div style={slotStyle(parkingStatus["P5"])} onClick={() => toggleStatus("P5")}>P5 ({parkingStatus["P5"]})</div>
      <div style={slotStyle(parkingStatus["P6"])} onClick={() => toggleStatus("P6")}>P6 ({parkingStatus["P6"]})</div>

      {/* Third Row - Larger Blocks */}
      <div style={{ ...slotStyle(parkingStatus["P7"]), gridColumn: "span 2" }} onClick={() => toggleStatus("P7")}>
        P7 ({parkingStatus["P7"]})
      </div>
      <div style={{ ...slotStyle(parkingStatus["P8"]), gridColumn: "span 1" }} onClick={() => toggleStatus("P8")}>
        P8 ({parkingStatus["P8"]})
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



