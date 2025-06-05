import { DynamoDBClient, BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";

// AWS DynamoDB Client Setup (v3)
const dynamoDB = new DynamoDBClient({
  region: process.env.DYNAMO_REGION,
  credentials: {
    accessKeyId: process.env.DYNAMO_ACCESS_KEY,
    secretAccessKey: process.env.DYNAMO_SECRET_KEY,
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
    return Response.json({ error: error.message }, { status: 500 });
  }
}
