import Mongoose from 'mongoose';
import { MONGOOSE_URL } from '../../config.json';
import Queue from '../../Database/Queue';
import { VolcanoTrack } from '../../global';

const ClearQueue = async (guildId: string) => {
  const mongoose = await Mongoose.connect(MONGOOSE_URL);

  await Queue.updateOne({ guildId }, { $unset: { current: {} }, tracks: [] });

  return await mongoose.connection.close();
};

export default ClearQueue;
