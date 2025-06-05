import AWS from "aws-sdk";

// AWS DynamoDB Setup
const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: "eu-central-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Fetch Parking Statuses
export async function GET() {
  const params = {
    TableName: "ParkingSpots",
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    return Response.json({ parkingSpots: data.Items });
  } catch (error) {
    return Response.json({ error: "Failed to fetch parking spots" }, { status: 500 });
  }
}

// Update Parking Status
export async function POST(req) {
  const { id, newStatus } = await req.json();
  
  const params = {
    TableName: "ParkingSpots",
    Key: { id },
    UpdateExpression: "set #status = :s, updatedAt = :u",
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: {
      ":s": newStatus,
      ":u": new Date().toISOString(),
    },
  };

  try {
    await dynamoDB.update(params).promise();
    return Response.json({ message: "Parking spot updated" });
  } catch (error) {
    return Response.json({ error: "Failed to update parking spot" }, { status: 500 });
  }
}
