import Queue from '../../Database/Queue';

const ClearQueue = async (guildId: string) => {
  return await Queue.updateOne(
    { guildId },
    { $unset: { current: {} }, tracks: [] },
  );
};

export default ClearQueue;
