const chromium = require('@sparticuz/chromium');
const fetch = require('node-fetch');
const puppeteer = require('puppeteer-core');

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}.`;
};

const date = new Date();
const formattedDate = formatDate(date);

const generateHTML = (properties, project, district, formattedStreetName, streetNumber) => { 
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Pricelist</title>
    <style>
      body { 
        font-family: 'Averta', 'Verdana', sans-serif; 
        margin: 0px; 
        padding: 0px;
      }
      h1 { color: #191E23; }
      table { 
        width: 100%; 
        margin-left: auto; 
        margin-right: auto; 
        border-collapse: collapse;
      }

      table td, table th {
        border: 1px solid #191E23; 
      }

      table td:last-child, table th:last-child {
        border-right: 1px solid #191E23; 
      }
      th, td {
        font-size: 14px; 
        border: 1px solid #191E23; 
        padding: 4px; 
        text-align: left; 
        white-space: nowrap;
      }
      table td a {
        color: #191E23;
      }
      th { 
        background-color: #EFE8DC; 
      }
      header, footer {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        width: 100%;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 10px;
      }
      header .center-info h1, header .center-info p{
        text-transform: uppercase;
        text-align: center;
        margin: 0px;
        padding: 0px;
      }
      header .center-info h1 {
        font-size: 28px;
      }
      header .center-info p {
        font-size: 20px;
      }
      header .right-info p {
        margin: 0px;
        padding: 0px;
        font-size: 14px;
        text-align: right;
      }
      footer p {
        font-size: 14px;
      }
      .active-status {
        background-color: lightgreen;
      }
      .inactive-status {
        background-color: gray;
      }
      /* Ensure everything stays on one page */
      @media print {
        body {
          page-break-before: always;
          page-break-after: avoid;
          margin: 0;
        }
        table {
          width: 100%;
        }
      }
    </style>
  </head>
  <body>
    <header>
      <div>
        <img src="https://www.becsingatlan.com/images/bi_logo_4.png" width="250px"/>
      </div>
      <div class="center-info">
        ${(() => {
          let title = `${district} ${formattedStreetName} ${streetNumber}.`;
          let subtitle = "Lakás árlista";

          if (project === "favoritenstrasse_58") {
            title = "1040 Favoritenstrasse 58.";
            subtitle = "Lakás árlista";
          } else if (project === "favoritenstrasse_office_58") {
            title = "1040 Favoritenstrasse 58.";
            subtitle = "Üzlethelyiségek";
          } else if (project === "erzherzog_74") {
            title = "1220 Erzherzog-Karl-Strasse 74";
            subtitle = "Lakás árlista";
          } else if (project === "wagramer_113") {
            title = "1220 Wagramer Strasse 113";
            subtitle = "Lakás árlista";
          } else if (project === "gumpendorferstrasse_60") {
            title = "1060 Gumpendorferstrasse 60.";
            subtitle = "Lakás árlista";
          } else if (project === "ludwig_reindl_gasse_1") {
            title = "1220 Ludwig-Reindl-Gasse-1.";
            subtitle = "Lakás árlista";
          } else if (project === "peak_homes") {
            title = "1030 Elizabeth-T.-Spira-Promenade 4";
            subtitle = "Lakás árlista";
          }

          return `<h1>${title}</h1><p>${subtitle}</p>`;
        })()}
      </div>
      <div class="right-info">
        <p>A-1040 Wien</p>
        <p>Brahmsplatz 7/3.OG/Top 12A</p>
        <p>Tel: +43 664 401 6308</p>
        <p>E-mail: office@becsingatlan.com</p>
        <p>www.becsingatlan.com</p>
      </div>
    </header>
    <table>
      <thead>
        <tr>
          <th>Lh.</th>
          <th>Lakás*</th>
          <th>Emelet</th>
          <th>Szobák</th>
          <th>Alapterület (m²)</th>
          <th>Loggia (m²)</th>
          <th>Erkély (m²)</th>
          <th>Terasz (m²)</th>
          <th>Tetőterasz (m²)</th>
          <th>Kerti terasz (m²)</th>
          <th>Kert (m²)</th>
          <th>Teljes külső (m²)</th>
          <th>Összterület (m²)</th>
          <th>Eladási ár (befektetés)</th>
          ${project === "wagramer_113" || project === "gumpendorferstrasse_60" ? `<th>Éves bérleti díj</th>` : `<th> Eladási ár (saját használat)`}
          
          <th>Státusz</th>
        </tr>
      </thead>
      <tbody>
        ${properties.map(unit => {
          const blueprintLink = unit.status === "Elérhető"
            ? `https://becsingatlan.com/pages/wp-content/blueprints/${unit.projectAcronym}/${unit.projectAcronym}_${unit.houseNumber}_TOP-${unit.apartmentNumber}.pdf`
            : '#';

          return `
            <tr>
              <td>${unit.houseNumber}</td>
              <td>
                <a target="_blank" href="${blueprintLink}">TOP ${unit.apartmentNumber}</a>
              </td>
              <td>${unit.floorNumber}</td>
              <td>${unit.roomNumber}</td>
              <td>${unit.livingArea}</td>
              <td>${unit.loggiaArea}</td>
              <td>${unit.balconyArea}</td>
              <td>${unit.terraceArea}</td>
              <td>${unit.roofTerraceArea}</td>
              <td>${unit.gardenTerraceArea}</td>                                 
              <td>${unit.gardenArea}</td>                                 
              <td>${unit.sumOfOutsideAreas}</td>                                 
              <td>${unit.sumOfAllAreas}</td>                                                              
              <td>${unit.listingPriceForInvestors}</td>
              <td>${unit.listingPriceForPersonalUse}</td>
              <td class="${unit.status === "Elérhető" ? "active-status" : "inactive-status"}">${unit.status}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
    <footer>
      <p class="text-hint">
      *A lakás számára kattintva megtekinthető az alaprajz.</br>
      **A jelen árlista adatai tájékoztató jellegűek, a változtatások és eltérések jogát fenntartjuk.
      </p>
      <p>Dátum:<strong> ${formattedDate}</strong> </p>
    </footer>
  </body>
  </html>
  `;
};

export default async function handler(req, res) {

  res.setHeader('Access-Control-Allow-Origin', 'https://becsingatlan.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const { district, project } = req.query;
    console.log(req.query)
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
    const HTMLcontent = generateHTML(properties, project, district, formattedStreetName, streetNumber);

    const browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: true,
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
        scale: 0.75,  
        width: '210mm',  
        height: '297mm',  
      });
  
      await browser.close();
  
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${project}_arlista.pdf"`);
      res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
}


    