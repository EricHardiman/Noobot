import mongoose from 'mongoose';
import SpotifyLink from './Database/SpotifyLink';
const url = 'mongodb://localhost:27017/Noobot';

async function main() {
  await mongoose.connect(url);

  const newLink = new SpotifyLink({
    discordId: '1210250102501500',
    auth_token: 'lkadslkadskl',
    refresh_token: 'lkadslkads',
    state: 'lkadslkda',
  });

  const foundLink = await SpotifyLink.findOne({
    discordId: newLink.discordId,
  }).then(
    async (discordUser) => discordUser || (await SpotifyLink.create(newLink)),
  );
}

main();
