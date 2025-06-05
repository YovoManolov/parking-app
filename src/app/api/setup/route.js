import { DynamoDBClient, BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";

// AWS DynamoDB Client Setup (v3)
const dynamoDB = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

export async function POST() {
  const parkingSpots = [
    { id: { S: "P1" }, status: { S: "free" } },
    { id: { S: "P2" }, status: { S: "free" } },
    { id: { S: "P3" }, status: { S: "free" } },
    { id: { S: "P4" }, status: { S: "free" } },
    { id: { S: "P5" }, status: { S: "free" } },
    { id: { S: "P6" }, status: { S: "free" } },
    { id: { S: "P7" }, status: { S: "free" } },
    { id: { S: "P8" }, status: { S: "free" } },
  ];

  const params = {
    RequestItems: {
      ParkingSpots: parkingSpots.map(item => ({ PutRequest: { Item: item } }))
    }
  };

  try {
    const command = new BatchWriteItemCommand(params);
    await dynamoDB.send(command);
    return Response.json({ message: "Parking spots initialized!" });
  } catch (error) {
    console.error("DynamoDB Batch Write Error:", error);
    console.log("AWS_ACCESS_KEY_ID:", process.env.AWS_ACCESS_KEY_ID);
    console.log("AWS_SECRET_ACCESS_KEY:", process.env.AWS_SECRET_ACCESS_KEY);
    console.log("AWS_REGION:", process.env.AWS_REGION);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
