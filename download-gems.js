const https = require('https');
const fs = require('fs');

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' } }, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        res.resume();
        reject(new Error(`Request Failed With Status Code: ${res.statusCode}`));
      }
    });
  });
};

const images = [
  { url: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Aquamarine_P1000141.JPG', file: 'public/images/gemstones/aquamarine.jpg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Jadestein.jpg', file: 'public/images/gemstones/jade.jpg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Rose_Quartz_Macro_1.JPG', file: 'public/images/gemstones/rosequartz.jpg' }
];

Promise.all(images.map(img => downloadImage(img.url, img.file)))
  .then(() => console.log('Successfully downloaded all images'))
  .catch(err => console.error('Error downloading images:', err));
