/*
* Imports
*/
const puppeteer = require('puppeteer-extra');
const instaHelper = require('./insta-helper');

/*
* Setup
*/
puppeteer.use(require('puppeteer-extra-plugin-repl')());
const stealth = require('puppeteer-extra-plugin-stealth')();
stealth.onBrowser = () => { };
puppeteer.use(stealth);

const fs = require('fs');
const cookiesPath = "cookies.txt";


/*
* launch
*/

module.exports = {

  /*
    url: url of the post
    postType: 'image' | 'video',

    // only for private post
    isAuthRequired: if the url is of a private account,
    username: username of the insta account from which you are following the private page
    password:password
  */
  scrapInsta: async (url, postType, username = null, password = null) => {
    return new Promise(async (resolve) => {
      puppeteer.launch({ userDataDir: "./user_data", headless: false })
        .then(async browser => {
          let itemUrl;


          const page = await browser.newPage()
          // If the cookies file exists, read the cookies.
          const previousSession = fs.existsSync(cookiesPath)
          if (previousSession) {
            const content = fs.readFileSync(cookiesPath);
            const cookiesArr = JSON.parse(content);
            if (cookiesArr.length !== 0) {
              for (let cookie of cookiesArr) {
                await page.setCookie(cookie)
              }
              console.log('Session has been loaded in the browser')
            }
          }

          await page.goto('https://www.instagram.com/', {
            waitUntil: 'networkidle2',
            timeout: 0
          });

          let isLoggedIn;
          try {
            await page.waitForSelector('[name="password"]', { timeout: 5000 })
            isLoggedIn = false;
          } catch (error) {
            isLoggedIn = true;
          }
          if (!isLoggedIn) {
            // then login
            await page.type('[name="username"]', username);
            await page.type('[name="password"]', password);
            await page.click('[type="submit"]');
            await page.waitForNavigation({ waitUntil: 'networkidle0' });
          }

          // Write Cookies
          const cookiesObject = await page.cookies()
          fs.writeFileSync(cookiesPath, JSON.stringify(cookiesObject));
          console.log('Session has been saved to ' + cookiesPath);

          await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 0
          });
          if (postType === 'image') {
            itemUrl = await instaHelper.getElementByXpath(page, '*//main//article/div/*//img/@src');
          } else if (postType === 'video') {
            itemUrl = await instaHelper.getElementByXpath(page, '*//main//article/div/*//video/@src');
          }
          console.log(itemUrl);
          const result = {
            "url": itemUrl,
            "itemType": postType
          }
          await page.close();
          await browser.close();
          resolve(result);
        })
    });
  }
}
