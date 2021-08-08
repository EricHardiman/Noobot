const processes = {
  Refresher: {
    script: 'refresh.js',
    name: 'Refresher',
    watch: false,
    cron: '0 3 * * *',
  },
  Lavalink: {
    script: 'java',
    name: 'Lavalink',
    watch: false,
    args: ['-jar', './Lavalink/Lavalink.jar'],
  },
};

module.exports = processes;
