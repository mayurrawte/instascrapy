const instaScrapper = require('./index');

const url = 'https://www.instagram.com/p/CB9tWPyF9he/';
const postType = 'image';
// const url = 'https://www.instagram.com/p/CBqb9aylR_4/'
// const postType = 'video';


instaScrapper.scrapInsta(url, postType)
.then((data) => {
    console.log(data);
});
