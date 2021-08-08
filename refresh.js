const { Noobot, Lavalink } = require('./processes');
const fs = require('fs');
const axios = require('axios').default;
const path = require('path');
const pm2 = require('pm2');

process.stdin.resume();

const downloadLatest = async (LavalinkVersion) => {
  const url = `https://github.com/Cog-Creators/Lavalink-Jars/releases/download/${LavalinkVersion}/Lavalink.jar`;
  const locationToSave = path.resolve(__dirname, 'Lavalink', 'Lavalink.jar');
  const writer = fs.createWriteStream(locationToSave);

  const response = await axios({
    method: 'GET',
    url,
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

const updateTextFile = (filePath, newVersion) => {
  return fs.writeFile(filePath, newVersion, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Lavalink ${newVersion} Downloaded.`);
    }
  });
};

const checkVersion = async () => {
  // Get to Github API to return latest Lavalink version
  const {
    data: [latestLavalink],
  } = await axios({
    url: 'https://api.github.com/repos/Cog-Creators/Lavalink-Jars/releases',
    method: 'GET',
    headers: { Accept: 'application/vnd.github.v3+json' },
  });

  const currentVersion = latestLavalink.name;
  const filePath = path.resolve(__dirname, 'Lavalink', 'version.txt');

  // Check to see if Lavalink is already downloaded.
  fs.readFile(filePath, 'utf-8', async (err, previousVersion) => {
    if (err) {
      // If there's an error, this is first time running Noobot.
      // Downloads latest version of Lavalink.jar.
      await downloadLatest(currentVersion);

      // After download updates text file.
      return updateTextFile(filePath, currentVersion);
    }

    // If version file exists, check previous against current from Github.
    if (previousVersion !== currentVersion) {
      // If it doesn't equal the version from Github, it stops Noobot and Lavalink.
      console.log('Stopping Noobot and Lavalink.');
      // await pm2.stop(Noobot.name);
      await pm2.stop(Lavalink.name);

      // Then downloads the latest version.
      await downloadLatest(currentVersion);
      console.log(
        `Upgraded Lavalink from ${previousVersion} to ${currentVersion}`,
      );

      // Afted download updates text file.
      await pm2.start(Lavalink);
      // await pm2.start(Noobot);
      console.log('Started Noobot and Lavalink.');

      return updateTextFile(filePath, currentVersion);
    } else {
      // Otherwise the Latest version of Lavalink is already in use.
      console.log('Already on Latest Lavalink.');
    }
  });
};

checkVersion();
