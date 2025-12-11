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

const generateHTML = (project, properties, district, formattedStreetName, streetNumber) => { 
  const projectAcronym = properties[0]?.projectAcronym || 'defaultAcronym';
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
      .page-break {
        page-break-before: always;
      }
      .layout-image {
        width: 100%;
        height: 100vh; 
        object-fit: contain; 
        display: block;
        margin: 0 auto;
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
          let subtitle = "Garázs árlista";

          if (project === "erzherzog_74") {
            title = "1220 Erzherzog-Karl-Strasse 74";
            subtitle = "Garázs árlista";
          } else if (project === "ludwig_reindl_gasse_1") {
            title = "1220 Ludwig-Reindl-Gasse 1";
            subtitle = "Garázs árlista";
          } else if (project === "peak_homes") {
            title = "1220 Elizabeth-T.-Spira-Promenade 4";
            subtitle = "Garázs árlista";
          } else if (project === "park_homes") {
            title = "1030 Leo-Perutz-Promenade 2-4";
            subtitle = "Garázs árlista";
          } else if (project === "breitenfurterstrasse_434") {
            title = "1230 Breitenfurter Straße 434";
            subtitle = "Garázs árlista";
          } else if (project === "laaer_berg_strasse_100") {
            title = "1100 Laaer-Berg-Strasse 100";
            subtitle = "Garázs árlista";
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
          <th>Parkolóhely</th>
          <th>Eladási ár (befektetés)</th>
          <th>Eladási ár (saját használat)</th>
          <th>Státusz</th>
        </tr>
      </thead>
      <tbody>
        ${properties.map(unit => `
          <tr>
            <td>${unit.houseNumber}</td>
            <td>KFZ ${unit.parkingNumber}</td>                                                            
            <td>${unit.listingPriceForInvestors}</td>
            <td>${unit.listingPriceForPersonalUse}</td>
            <td class="${unit.status === "Elérhető" ? "active-status" : "inactive-status" }">${unit.status}</td>
          </tr>`).join('')}
      </tbody>
    </table>
    <footer>
      <p>Dátum:<strong> ${formattedDate}</strong></p>
    </footer>
    ${(() => {
      if (project === "krottenbachstrasse_182") {
        return `
          <div class="page-break"></div>
          <img class="layout-image" src="https://becsingatlan.com/pages/wp-content/garage/${projectAcronym}/${projectAcronym}_Garagenplan_1.png" alt="Garage layout 1"/>
          <div class="page-break"></div>
          <img class="layout-image" src="https://becsingatlan.com/pages/wp-content/garage/${projectAcronym}/${projectAcronym}_Garagenplan_2.png" alt="Garage layout 2"/>
        `;
      } else {
        return `
          <div class="page-break"></div>
          <img class="layout-image" src="https://becsingatlan.com/pages/wp-content/garage/${projectAcronym}/${projectAcronym}_Garagenplan.png" alt="Garage layout"/>
        `;
      }
    })()}
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

    if (!district || !project) {
        return res.status(400).send('Missing required query parameters: district or project.');
    }

    const [streetName, streetNumber] = project.split('_') || [];
    if (!streetName || !streetNumber) {
      return res.status(400).send('Invalid project format. Expected format: "streetName_streetNumber".');
    }

    const formattedStreetName = streetName.charAt(0).toUpperCase() + streetName.slice(1);
    const JSON_URL = `https://nagyimmobilien.github.io/properties/garage/${project}.json`;

    const result = await fetch(JSON_URL);
    if (!result.ok) {
      return res.status(404).send('Property data not found.');
    }

    const properties = await result.json();
    const HTMLcontent = generateHTML(project, properties, district, formattedStreetName, streetNumber);
    
    console.log("Chromium executable path:", await chromium.executablePath());
    
    const browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: true,
        ignoreHTTPSErrors: true
      });    
      
    console.log("Chromium executable path:", await chromium.executablePath());

  
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
      res.setHeader('Content-Disposition', `attachment; filename="${project}_garazs_arlista.pdf"`);
      res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
}


    