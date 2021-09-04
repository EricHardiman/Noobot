import Mongoose from 'mongoose';
import Queue, { IQueue } from '../../Database/Queue';
import { MONGOOSE_URL } from '../../config.json';

const FindCreateQueue = async (guildId: string): Promise<IQueue> => {
  await Mongoose.connect(MONGOOSE_URL);

  const queue = await Queue.findOne({ guildId }).then(
    (existingQueue) => existingQueue || Queue.create({ guildId }),
  );

  return queue;
};

export default FindCreateQueue;
