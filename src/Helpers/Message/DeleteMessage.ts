import { Message } from 'discord.js';

const DeleteMessage = ({
  message,
  messages,
  timeout,
}: DeleteMessageProps): void => {
  // If only a single message is passed
  if (message) {
    try {
      // Timeout number is passed
      if (typeof timeout === 'number') {
        setTimeout(() => {
          message.delete();
        }, timeout);
        // Timeout number is not passed
      } else {
        message.delete();
      }
    } catch {}
  }

  // If multiple messages are passed
  if (messages) {
    try {
      // Timeout number is passed
      if (typeof timeout === 'number') {
        setTimeout(() => {
          for (const message of messages) {
            message.delete();
          }
        }, timeout);
        // Timeout number is not passed
      } else {
        for (const message of messages) {
          message.delete();
        }
      }
    } catch {}
  }
  return;
};

interface DeleteMessageProps {
  message?: Message;
  messages?: Message[];
  timeout?: number;
}

export default DeleteMessage;
