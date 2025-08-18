import { EventBridgeClient } from "@aws-sdk/client-eventbridge";

export const eventBridgeClient = (): EventBridgeClient => {
    return new EventBridgeClient({ region: process.env.USER_AWS_REGION });
};
