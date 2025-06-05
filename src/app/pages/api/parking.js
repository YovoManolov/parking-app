// Simple in-memory parking store
let parkingSpots = [];

// Initialize a 5 x 4 parking lot (20 spots), initially free
const ROWS = 5;
const COLS = 4;

if (parkingSpots.length === 0) {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      parkingSpots.push({
        id: `${r}-${c}`,
        row: r,
        col: c,
        occupied: false,
      });
    }
  }
}

export default function handler(req, res) {
  if (req.method === "GET") {
    // Return full parking status
    res.status(200).json(parkingSpots);
  } else if (req.method === "POST") {
    // Update one spot status (toggle occupied)
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Missing parking spot id" });
    }
    const spotIndex = parkingSpots.findIndex((s) => s.id === id);
    if (spotIndex === -1) {
      return res.status(404).json({ error: "Spot not found" });
    }
    // Toggle the occupied flag
    parkingSpots[spotIndex].occupied = !parkingSpots[spotIndex].occupied;

    return res.status(200).json(parkingSpots[spotIndex]);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}