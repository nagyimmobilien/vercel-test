const chromium = require('chrome-aws-lambda')
const fetch = require('node-fetch')
const puppeteer = require('puppeteer-core')


const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

const generateHTML = (properties, district, formattedStreetName, streetNumber) => {
    const formattedDate = formatDate(new Date());
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Pricelist</title>
        <style>
        /* Add necessary styles here */
        </style>
    </head>
    <body>
        <header>
        <h1>${district} ${formattedStreetName} ${streetNumber}</h1>
        </header>
        <table>
        <thead>
            <tr>
            <th>Lh.</th>
            <th>Lakás*</th>
            <th>Emelet</th>
            <th>Szobák</th>
            <th>Státusz</th>
            </tr>
        </thead>
        <tbody>
            ${properties.map(unit => `
            <tr>
                <td>${unit.houseNumber}</td>
                <td>${unit.apartmentNumber}</td>
                <td>${unit.floorNumber}</td>
                <td>${unit.roomNumber}</td>
                <td>${unit.status}</td>
            </tr>`).join('')}
        </tbody>
        </table>
        <footer>
        <p>Aktualitás: ${formattedDate}</p>
        </footer>
    </body>
    </html>`;
};

export default async function handler(req, res) {
  try {
    const { district, project } = req.query;

    if (!district || !project) {
        return res.status(400).send('Missing required query parameters: district or project.');
    }

    const [streetName, streetNumber] = project.split('_') || [];
    if (!streetName || !streetNumber) {
      return res.status(400).send('Invalid project format. Expected format: "streetName_streetNumber".');
    }

    const formattedStreetName = streetName.charAt(0).toUpperCase() + streetName.slice(1);
    const JSON_URL = `https://nagyimmobilien.github.io/properties/${project}.json`;

    const result = await fetch(JSON_URL);
    if (!result.ok) {
      return res.status(404).send('Property data not found.');
    }

    const properties = await result.json();
    const HTMLcontent = generateHTML(properties, district, formattedStreetName, streetNumber);

    const browser = await puppeteer.launch({
        args: chrome.args,
        defaultViewport: chrome.defaultViewport,
        executablePath: await chrome.executablePath(),
        headless: 'new',
        ignoreHTTPSErrors: true
      });
  
      const page = await browser.newPage();
      await page.setContent(HTMLcontent, { waitUntil: 'networkidle0' });
  
      const pdfBuffer = await page.pdf({
        format: 'A4',
        landscape: true,
        printBackground: true,
        margin: {
          top: '20mm',
          bottom: '20mm',
          left: '20mm',
          right: '20mm',
        },
      });
  
      await browser.close();
  
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="pricelist.pdf"`);
      res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
}

  