import { SNSClient } from "@aws-sdk/client-sns";

export const snsClient = (): SNSClient => {
    return new SNSClient({ region: process.env.USER_AWS_REGION });
};
