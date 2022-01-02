import { Message } from 'discord.js';

const DeleteMessage = async ({
  message,
  messages,
  timeout,
}: DeleteMessageProps): Promise<void> => {
  // If only a single message is passed
  if (message) {
    // Timeout number is passed
    if (typeof timeout === 'number') {
      setTimeout(async () => {
        await message.delete().catch(() => {});
      }, timeout);
      // Timeout number is not passed
    } else {
      await message.delete().catch(() => {});
    }
  }

  // If multiple messages are passed
  if (messages) {
    // Timeout number is passed
    if (typeof timeout === 'number') {
      setTimeout(async () => {
        for (const message of messages) {
          await message.delete().catch(() => {});
        }
      }, timeout);
      // Timeout number is not passed
    } else {
      for (const message of messages) {
        await message.delete().catch(() => {});
      }
    }
  }
  return;
};

interface DeleteMessageProps {
  message?: Message;
  messages?: Message[];
  timeout?: number;
}

export default DeleteMessage;
