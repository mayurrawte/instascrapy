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
  scrapInsta: async (url, postType, isAuthRequired=false, username=null, password=null) => {
    return new Promise(async (resolve) => {
      puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
      .then(async browser => {
        let itemUrl;
        const page = await browser.newPage()
        await page.screenshot({path: 'before-load.png'});
        await page.goto(url,{
                waitUntil: 'networkidle0',
                timeout: 0
        });
        await page.screenshot({path: 'after-load.png'});
        if (postType === 'image') {
          itemUrl = await instaHelper.getElementByXpath(page, '*//main//article/div/*//img/@src');
        } else if (postType === 'video') {
          itemUrl = await instaHelper.getElementByXpath(page, '*//main//article/div/*//video/@src');
        }
        await page.screenshot({path: 'before-load1.png'});
        console.log(itemUrl);
        const result = {
          "url": itemUrl,
          "itemType": postType
        }
        await browser.close();
        resolve(result);
      })
    });
  }
}
