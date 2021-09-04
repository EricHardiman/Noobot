import { model, Schema, Model, Document } from 'mongoose';
import { VolcanoTrack } from '../global';

export interface IQueue extends Document {
  guildId: String;
  current: VolcanoTrack;
  tracks: Array<VolcanoTrack>;
}

const QueueSchema: Schema = new Schema({
  guildId: { type: String, required: true, unique: true },
  current: { type: Object, required: false },
  tracks: { type: Array, required: false },
});

const Queue: Model<IQueue> = model('Queue', QueueSchema);

export default Queue;
