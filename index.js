import playwright from 'playwright';
import { join } from 'path';
import yargs from 'yargs/yargs';

const browser = await playwright.chromium.launch({ headless: true });
const context = await browser.newContext({ acceptDownloads: true });
const page = await context.newPage();
let topicCounter = 0;
let downloadPromises = [];
let downloadsDirectory;

main();

async function main() {
  const { url, directory } = yargs(process.argv.slice(2))
    .usage('Usage: $0 [-u url] [-d directory]')
    .option('url', {
      alias: 'u',
      describe: 'URL of the year to download files from',
      type: 'string',
      default: 'https://www.drfrost.org/courses.php?coid=196',
    })
    .option('directory', {
      alias: 'd',
      describe: 'Directory to save downloads to',
      type: 'string',
      default: './downloads',
    })
    .parse();

  downloadsDirectory = directory;

  await downloadAllTopicsInYear(url);
  await Promise.all(downloadPromises);

  console.log('Downloads have finished');

  await browser.close();
}

async function gotoWithDelay(url, delay = 200) {
  await page.goto(url);
  await page.waitForTimeout(delay);
}

async function downloadAllTopicsInYear(yearUrl) {
  await gotoWithDelay(yearUrl);
  const topicLinks = await page.locator('a[id^=unitlink]');
  let topics = await topicLinks.evaluateAll((links) =>
    links.map((link) => {
      const cuid = link.id.split('-')[1];
      const url = `https://www.drfrost.org/courses.php?cuid=${cuid}`;
      const name = link.textContent;
      return {
        url,
        name,
      };
    })
  );
  for (const topic of topics) {
    console.log('topic', topic.url);
    topicCounter += 1;
    await downloadAllResourcesInTopic(topic);
  }
}

async function downloadAllResourcesInTopic(topic) {
  await gotoWithDelay(topic.url);
  const links = await page.locator('a');
  const resources = await links.evaluateAll((links) =>
    links
      .filter((link) =>
        link.getAttribute('href')?.startsWith('downloadables.php?rid=')
      )
      .map((link) => {
        const url = `https://www.drfrost.org/${link.getAttribute('href')}`;
        const name = link.querySelector('h1').textContent;
        return {
          url,
          name,
        };
      })
  );

  for (const resource of resources) {
    console.log('resource', resource.url);
    await downloadAllFilesInResource(resource, topic);
  }
}

async function downloadAllFilesInResource(resource, topic) {
  await gotoWithDelay(resource.url);
  const downloadLinks = await page
    .locator('li[id^=downloadable-file]')
    .filter({ hasNot: page.locator('.locked') });
  for (const link of await downloadLinks.all()) {
    await link.click();
    const download = await page.waitForEvent('download');
    const location = join(
      downloadsDirectory,
      `${topicCounter.toString().padStart(2, '0')} ${replaceColonsWithDash(
        topic.name
      )}`,
      replaceColonsWithDash(resource.name),
      await download.suggestedFilename()
    );

    downloadPromises.push(
      download.saveAs(location).then(() => download.delete())
    );
  }
}

function replaceColonsWithDash(str) {
  return str.replace(':', ' -');
}
