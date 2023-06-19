import {
  AttachmentBuilder,
  ChannelType,
  EmbedBuilder,
  WebhookClient,
} from 'discord.js';
import { Command } from '../../Interfaces';
import { OWNERS, WEBHOOK_ID, WEBHOOK_TOKEN } from '../../config.json';
import puppeteer from 'puppeteer';
import { existsSync, unlinkSync } from 'fs';
import { DeleteMessage } from '../../Helpers';

export const command: Command = {
  name: 'helltide',
  description: 'Get remaining Helltide time."',
  run: async (_client, message) => {
    if (message.channel.type === ChannelType.DM) return;
    if (!OWNERS.includes(message.author.id)) return;

    const mapPath = './map.png';
    const avatarURL =
      'https://cdn.discordapp.com/avatars/580897003278565376/978ebe84c6e2b5088a97114c820bc0d8?size=1024';

    const browser = await puppeteer.launch({
      headless: 'new',
      executablePath: '/usr/bin/chromium',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    await Promise.all([
      page.goto('https://helltides.com', { waitUntil: 'domcontentloaded' }),
      page.waitForNetworkIdle({ idleTime: 3000 }),
      page.setViewport({ width: 1280, height: 900 }),
    ]);

    const { remainingTime, nextHelltide } = await page.evaluate(() => {
      const remainingTime = (
        document.querySelector('div.text-2xl') as HTMLElement
      ).innerText;
      const nextHelltide = (
        document.querySelector('div.text-4xl') as HTMLElement
      ).innerText;

      return { remainingTime, nextHelltide };
    });

    if (!remainingTime || !nextHelltide) {
      return await browser.close();
    }

    let title;
    let fields = [] as Array<{ name: string; value: string }>;

    if (nextHelltide === 'Next Helltide') {
      title = nextHelltide;
      fields.push({ name: '', value: `Starts in ${remainingTime}!` });

      if (existsSync(mapPath)) {
        unlinkSync(mapPath);
      }
    } else {
      const chestSelector = 'div[style*="background-image"]';

      const { locations, activeArea } = await page.evaluate((sele) => {
        const elements = Array.from(document.querySelectorAll(sele));
        const activeArea = (
          document.querySelector('button.ring-2') as HTMLElement
        ).innerText;
        const half = Math.ceil(elements.length / 2);
        const chests = elements.slice(half);
        const locations = [] as Array<{
          name: string;
          likes: number;
          dislikes: number;
        }>;

        for (const chest of chests) {
          const parent = chest.closest('div[style*="display: none"]');

          if (parent) {
            const locationName =
              parent.querySelector('.text-base')?.innerHTML || '';
            const [likes, dislikes] = Array.from(
              parent.querySelectorAll('.text-lg'),
            );
            locations.push({
              name: locationName,
              likes: parseInt(likes.innerHTML),
              dislikes: parseInt(dislikes.innerHTML),
            });
          } else {
            break;
          }
        }

        return { locations, activeArea };
      }, chestSelector);

      title = `Helltide is Active in ${activeArea}!`;

      const sortedLocations = locations.sort((a, b) => b.likes - a.likes);
      fields.push({ name: '', value: `${remainingTime} remaining!` });

      for (const location of sortedLocations) {
        fields?.push({
          name: location.name,
          value: `**${location.likes} Likes** _........................_ ${location.dislikes} Dislikes`,
        });
      }
    }

    if (nextHelltide !== 'Next Helltide' && !existsSync(mapPath)) {
      const map = await page.waitForSelector('#map');
      await map?.screenshot({ path: 'map.png' });
    }

    const embed = new EmbedBuilder({
      title,
      fields,
      url: 'https://helltides.com',
    }).setColor('Red');

    const webhookClient = new WebhookClient({
      id: WEBHOOK_ID,
      token: WEBHOOK_TOKEN,
    });

    webhookClient.send({
      embeds: [embed],
      avatarURL,
      username: 'Noobot',
      ...(existsSync(mapPath) && { files: [new AttachmentBuilder(mapPath)] }),
    });

    await DeleteMessage({ message }).then(async () => {
      await browser.close();
    });
  },
};
