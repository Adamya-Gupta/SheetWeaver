
<div align="center">
<img src='./App_Logo.png' width="200">
</div>

<p align="center">
Taking loose threads (scattered data from different brokers) and weaving them into a neat, organized sheet.
</p>

<div align="center">

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://github.com/Adamya-Gupta/SheetWeaver/blob/main/LICENSE)
![Google Sheets](https://img.shields.io/badge/Google%20Sheets-%2334A853.svg?style=flat-square&logo=googlesheets&logoColor=white)
![Tauri](https://img.shields.io/badge/tauri-%2324C8DB.svg?style=flat-square&logo=tauri&logoColor=%23FFFFFF)
![Groww](https://img.shields.io/badge/Groww-brightgreen?style=flat-square)


</div>

## SheetWeaver
Converts portfolio to sheets

<img src="https://res.cloudinary.com/daylxkzkt/image/upload/v1784527299/sheetspf_demo_mvygb7.png">

---

## How to Use
<details>
<summary> How to Download</summary>

### Login to your Groww portal and download the report

Login to groww portal: https://groww.in/

<img src="https://res.cloudinary.com/daylxkzkt/image/upload/v1786912701/Dashboard_opvged.png">

<img src="https://res.cloudinary.com/daylxkzkt/image/upload/v1786912701/RepDownload_y3cjho.png">

### Then upload the downloaded file to the app

</details>

## Features
- Live updates
- Privacy Focused no data is stored
- Lightweight and Fast
- Open source, secure and community driven
- Free forever , No subscription

## Download
Download .exe file and directly run it to install the app.

## Development

<details>
<summary>Tech Stack used</summary>

- NextJS
- Typescript
- Tailwind CSS
- Tauri
- ExcelJS

</details>

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To run the tauri app:

```bash
npx tauri dev
```

To build the app yourself:

```bash
npx tauri build
```

## Features to be added
- [ ] Add Mutual Funds Option
- [ ] Integrate more platforms 
- [ ] Developer Version (API Key support)
- [ ] Automatic update/fetch ISIN code
- [ ] Automatic monthly report pdf attatched to email
- [ ] Linux Support

## FAQ

Que: Why should I use this when I can directly download the excel file from the platform ?

Ans: First, because you have to use this tool only once and your excel file will always be updated and show live updates without doing anything, and <br>
Second, the excel file provided by these platforms are generally too bloated,colorless, disorganised and value-only/static spreadsheet.

Que: Where is the user data stored and what about privacy ?

Ans: No database is used as no data is stored to make things fast and you can download the desktop app which is fully offline so your data stays on your device only.

Que: Why the fallback value of live price are taken as Average Price instead of the value of provided in the downloaded report incase if google finance is not able to provide data?

Ans: because google finance function prefers to just put the simple text value instead of fetching the complicated data, thats why cell address of corresponding liveprice is used instead of any value.<br>
and also by making the Selling price(SP) equal to the Cost price(CP) the profit or loss = CP - SP becomes 0 , i.e that share has no impact in calculation of total profit/loss , also it prevents the breaking of any other dependent formula or values in the full table.

Que: Why tauri over electron ? 

Ans: 

|Parameter|![Electron.js](https://img.shields.io/badge/Electron-%23191970.svg?style=for-the-badge&logo=Electron&logoColor=white)|![Tauri](https://img.shields.io/badge/tauri-%2324C8DB.svg?style=for-the-badge&logo=tauri&logoColor=%23FFFFFF)|
|---------|--------|-----|
|Size on Disk| ~700 MB | ~11 MB|
|Performance| Slow | Fast |


## Deployment
