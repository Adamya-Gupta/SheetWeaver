# <img src="logo.ico" height=25px> Groww Portfolio to Excel Converter (Electron Concept) 

>[!Important] 
> ⚠️**Proof of Concept Only**
>
>This branch is an early-phase demonstration of building the portfolio converter using Electron.js.
>
>**This version is no longer being developed.** 
>
> 👉 **[Go to the `main` branch for the active Tauri version](../../tree/main)** (Lighter,faster and updated).

## Overview

This application extracts data from a Groww app portfolio and converts it into formatted Excel spreadsheets. This specific branch/repository serves solely to demonstrate that the application can be packaged using Electron.js.

<table width="1000" align="center">
<tr><td>App Preview</td></tr>
<tr>
<td><img src="https://res.cloudinary.com/daylxkzkt/image/upload/v1784525850/App_Preview_obenso.png" width="900"> </td>
</tr>
<tr><td>Generated Output</td></tr>
<tr>
<td><img src="https://res.cloudinary.com/daylxkzkt/image/upload/v1784527299/sheetspf_demo_mvygb7.png" width ="900"> </td>
</tr>
</table>


## Limitations

Because this relies on the Chromium engine via Electron, there are a few significant drawbacks compared to our primary build:
* **Massive File Size:** The application takes up approximately 700MB on disk.
* **Performance:** It consumes more memory and runs slower than the lightweight Tauri alternative.

## Getting Started

To run the development server:

```bash
npm install
npm run dev
```

Note: This will likely open an Electron window, but you can also view the frontend by navigating to http://localhost:3000 in your browser.

## Download

To buld the .exe yourself:

```bash
npm run build:exe
```
The compiled executable will be generated in the `dist` folder.