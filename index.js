import express from 'express';
import axios from 'axios';
import {load} from 'cheerio';
import {writeFile, createWriteStream, link, writeFileSync} from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const PORT = 8000;
const app = express();
let searchFor = '';

// workaround for type module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function writeToFile(data) {
  const dataArray= JSON.stringify(data, null, 2)
  writeFile((__dirname + '/products.json'), dataArray, (err) => {
    if (err) throw err;
    console.log('Data written to file');
  });
}

async function getProductInfo(url) {
  const res = axios
    .get(url)
    .then((response) => {
      const html = response.data;
      const $ = load(html);
      const productInfo = {};

      $('div').each(async (i, el) => {
        const roleAttribute = el.attribs.role;

        if (roleAttribute != undefined) {
          if (roleAttribute.includes('listitem')) {
            const leftColumn = el.children[0].children[0].children[0];
            const rightColumn = el.children[1].children[0].children[0];

            if (rightColumn != undefined) {
              if (rightColumn.type == 'tag') {
                const brandname =
                  el.children[1].children[0].children[0].children[0].data;
                productInfo[leftColumn.data] = brandname;
              } else {
                productInfo[leftColumn.data] = rightColumn.data;
              }
            }
          }
        }
      });
      return productInfo;
    })
    .catch((err) => console.log(err));
  return res;
}

app.get('/search/:word', async (req, res) => {
  searchFor = req.params.word;

  await axios
    .get('https://pricespy.co.nz/search?search=' + searchFor)
    .then(async (response) => {
      const html = response.data;
      const $ = load(html);
      const listLength = $('a').length;
      let number = 0;
      let links = [];

      if (listLength > 25) {
        console.log('This can take time.....');
      }

      for (const el of $('a')) {
        if (el.attribs.href) {
          const link = el.attribs.href;
        number += 1;

        if (link.includes('product.')) {
          const name = el.children[1].children[0].children[0].data;
          const price =
            el.children[2].children[0].children[0].children[0].children[0]
              .children[2].children[0].data;

          links.push({
            Name: name,
            Price: price,
            Link: `https://pricespy.co.nz${link}`,
            Stats: await getProductInfo(`https://pricespy.co.nz${link}`),
          });
        }
        console.log(`on ${number} / ${listLength}`);
        }
      }
      console.log('done!');
      res.json(links);
      writeToFile(links)
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
