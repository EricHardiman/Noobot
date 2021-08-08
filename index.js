const pm2 = require('pm2');
const { Refresher, Lavalink, Noobot } = require('./processes');

const startNoobot = () => {
  pm2.connect((err) => {
    if (err) return pm2.disconnect();

    pm2.start(Refresher, (err) => {
      if (err) return pm2.disconnect();
    });

    pm2.start(Lavalink, (err) => {
      if (err) return pm2.disconnect();
    });

    pm2.start(Noobot, (err) => {
      if (err) return pm2.disconnect();
    });
  });
};

startNoobot();
