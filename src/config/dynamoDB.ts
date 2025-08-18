import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const dynamoClient = (): DynamoDBDocumentClient => {
    const client = new DynamoDBClient({ region: process.env.USER_AWS_REGION });

    return DynamoDBDocumentClient.from(client);
};