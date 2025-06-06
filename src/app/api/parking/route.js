import { DynamoDBClient, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

// AWS DynamoDB Setup
const dynamoDB = new DynamoDBClient({
    region: process.env.DYNAMO_REGION,
    credentials: {
      accessKeyId: process.env.DYNAMO_ACCESS_KEY,
      secretAccessKey: process.env.DYNAMO_SECRET_KEY,
    }
});

export async function GET() {
  const params = { TableName: "ParkingSpots" };

  try {
    console.log(credentials);
    const command = new ScanCommand(params);
    const data = await dynamoDB.send(command);

    const formattedData = data.Items.reduce((acc, item) => {
      acc[item.id.S] = item.status.S;
      return acc;
    }, {});

    return Response.json(formattedData);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// Update Parking Status
export async function POST(req) {
  const { id, newStatus } = await req.json();

  const params = {
    TableName: "ParkingSpots",
    Key: { id: { S: id } },
    UpdateExpression: "SET #status = :s, updatedAt = :u",
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: {
      ":s": { S: newStatus }, 
      ":u": { S: new Date().toISOString() },
    },
  };

  try {
    console.log(credentials);
    const command = new UpdateItemCommand(params);
    await dynamoDB.send(command);
    return Response.json({ message: `Parking spot ${id} updated to ${newStatus}` });
  } catch (error) {
    console.error("DynamoDB Update Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
