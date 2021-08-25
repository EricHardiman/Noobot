import { model, Schema, Model, Document } from 'mongoose';

export interface ISpotifyLink extends Document {
  discordId: String;
  access_token: String;
  refresh_token: String;
  state: String;
}

const SpotifyLinkSchema: Schema = new Schema({
  discordId: { type: String, required: true },
  access_token: { type: String, required: true },
  refresh_token: { type: String, required: true },
  state: { type: String, required: false },
});

const SpotifyLink: Model<ISpotifyLink> = model(
  'SpotifyLink',
  SpotifyLinkSchema,
);

export default SpotifyLink;
