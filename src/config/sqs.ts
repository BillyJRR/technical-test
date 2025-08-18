import { SQSClient } from "@aws-sdk/client-sqs";

export const sqsClient = (): SQSClient => {
    return new SQSClient({ region: process.env.USER_AWS_REGION });
};
