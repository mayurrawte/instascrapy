const instaScrapper = require('./index');

const url = 'https://www.instagram.com/p/CB9tWPyF9he/';
const postType = 'image';
// const url = 'https://www.instagram.com/p/CBqb9aylR_4/'
// const postType = 'video';
const username = ''; // replace it with your username
const password = '' // replace it with your password

instaScrapper.scrapInsta(url, postType, username, password)
.then((data) => {
    console.log(data);
});
