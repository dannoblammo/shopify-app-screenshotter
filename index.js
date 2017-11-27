const dbConfigToUse = process.argv[2];

// Imports
const Puppeteer = require('puppeteer');
const PG = require('pg');
const Filesystem = require('fs');
const Colors = require('colors');
const ProgressBar = require('progress');
const dbs = require('./databases_cfg.js');


if (!dbConfigToUse){
  console.log("You need to specify which db config you want to use as an argument, for example".red)
  console.log("node index.js mydb".gray);
  process.exit();
}

// Configs
const screenshotRootFolder = './output';
const screenshotWidthPx = 1366;
const screenshotHeightPx = 768;
const networkIdleTimeout = 2000;

// Let's go!
main();

async function main() {
  console.log("Let's get cracking!".rainbow);
  const installations = await getDomainsToCheckFromDatabase();
  const browser = await Puppeteer.launch({headless: true});
  const browserPage = await browser.newPage();
  browserPage.setViewport({width: screenshotWidthPx, height: screenshotHeightPx});
  let installationsWithErrors = [];
  
  console.log('Analyzing ' + installations.length + ' Installations'.gray);
  let bar = new ProgressBar('Processing [:bar :percent complete] :eta seconds remaining', {total: installations.length});
  for (let i = 0; i < installations.length; i++) {
    bar.tick();
    try {
      await processInstallation(browserPage, installations[i]);
    } catch (e) {
      installationsWithErrors.push(installations[i]);
    }
  }
  browser.close();
  handleErrorResults(installationsWithErrors);
}

async function processInstallation(browserPage, installation) {
  const subfolder = `${screenshotRootFolder}/${installation.app_name}`;
  if (!Filesystem.existsSync(subfolder)) {
    Filesystem.mkdirSync(subfolder);
  }
  const response = await browserPage.goto(installation.url, {'waitUntil': 'networkidle', 'networkIdleTimeout': networkIdleTimeout});
  if (response.ok){
    await browserPage.screenshot({path: `${subfolder}/[${installation.id}] ${installation.domain}.png`});
  }
}

async function getDomainsToCheckFromDatabase() {
  const client = new PG.Client(dbs[dbConfigToUse].config);
  client.connect();
  const query = await client.query(dbs[dbConfigToUse].query);
  client.end();
  
  return query.rows;
}

function handleErrorResults(installations) {
  console.error(`These installations couldn't have screenshots taken for some reason:`.red);
  console.log(installations);
}