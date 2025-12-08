// snsClient.js
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import dotenv from "dotenv";
dotenv.config();

const REGION = process.env.AWS_REGION || "us-east-1";
export const snsClient = new SNSClient({ region: REGION });

export async function sendSms(phone, message) {
  const params = {
    PhoneNumber: phone,
    Message: message,
    MessageAttributes: {
      'AWS.SNS.SMS.SMSType': { DataType: 'String', StringValue: 'Transactional' }
      // Optionally: 'AWS.SNS.SMS.SenderID': { DataType: 'String', StringValue: 'MyApp' }
    }
  };
  const cmd = new PublishCommand(params);
  return await snsClient.send(cmd);
}

