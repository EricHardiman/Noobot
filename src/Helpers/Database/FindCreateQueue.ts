import Queue, { IQueue } from '../../Database/Queue';

const FindCreateQueue = async (guildId: string): Promise<IQueue> => {
  const queue = await Queue.findOne({ guildId }).then(
    (existingQueue) => existingQueue || Queue.create({ guildId }),
  );

  return queue;
};

export default FindCreateQueue;
