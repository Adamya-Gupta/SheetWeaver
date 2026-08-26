<div align="center">
<img src='./App_Logo.png' width="200">
</div>

<p align="center">
Turning scattered broker data into clean, organized, and live-updating spreadsheets.
</p>

<div align="center">

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](./LICENSE)
[![Google Sheets](https://img.shields.io/badge/Google%20Sheets-%2334A853.svg?style=flat-square&logo=googlesheets&logoColor=white)](#)
[![Tauri](https://img.shields.io/badge/tauri-%2324C8DB.svg?style=flat-square&logo=tauri&logoColor=%23FFFFFF)](https://v2.tauri.app/)
[![Groww](https://img.shields.io/badge/Groww-brightgreen?style=flat-square)](https://groww.in/)


</div>

## SheetWeaver
SheetWeaver converts bloated, static portfolio exports from brokers into clean, live-updating, and organized spreadsheets.

<table align="center">
    <tr>
        <td align="center" width=50%>
            <img src="https://res.cloudinary.com/daylxkzkt/image/upload/v1787110568/App_UI_zb06jh.png">
            <br>
            <i><b>SheetWeaver</b> preview</i>
        </td>
    </tr>
    <tr>
        <td align="center">
            <img src="https://res.cloudinary.com/daylxkzkt/image/upload/v1784527299/sheetspf_demo_mvygb7.png">
            <br>
            <i>Generated <b>Output</b></i>
        </td>
    </tr>
</table>

## Features
- **📈 Live Updates:** Injects `GOOGLEFINANCE` formulas so your portfolio always reflects real-time market data.
- **🔒 Privacy-Focused:** SheetWeaver does not use a database or cloud backend. Portfolio files are processed locally on your device.
- **⚡ Lightweight & Fast:** Built on Tauri, utilizing system native webviews for a minimal footprint.
- **🆓 Free & Open Source:** Free forever. No subscriptions, and community-driven.

## Supported Brokers
Currently, SheetWeaver supports Groww stock-holding exports. Mutual funds and additional brokers are planned.

<img src="https://res.cloudinary.com/daylxkzkt/image/upload/v1787184807/Sp_2_hvzret.png" >

## Requirements
- Windows 10 or later
- Google account for Google Sheets
- A supported broker portfolio export

## ⬇️ Download
Download the latest Windows release from the project's **[GitHub Releases](https://github.com/Adamya-Gupta/SheetWeaver/releases)** page and run the installer.

## How to Use

### 1. Log in to your Groww portal and download the report

Groww : https://groww.in/

<table align="center">
    <tr>
        <td align="center" >
            <img src="https://res.cloudinary.com/daylxkzkt/image/upload/v1786912701/Dashboard_opvged.png" />
            <i>Click the profile picture (at top right) and then click on <b>Reports</b></i>
        </td>
    </tr>
    <tr>
        <td align="center" >
            <img src="https://res.cloudinary.com/daylxkzkt/image/upload/v1786912701/RepDownload_y3cjho.png" />
            <i>Select the Stocks-Holding and then click <b>Download</b></i>
        </td>
    </tr>
</table>


### 2. Open SheetWeaver then upload the downloaded report

<img src="https://res.cloudinary.com/daylxkzkt/image/upload/v1787715162/DragDrop_xmzv3c.gif">

### 3. Upload the generated Excel file to Google Drive and open it with Google Sheets

<img src="https://res.cloudinary.com/daylxkzkt/image/upload/v1787715163/SheetView_punhc9.gif">

>[!TIP] 
>You can convert the generated data into a table and sort or filter it by metrics such as maximum amount invested, highest profit, and more.
>
>You can also export the spreadsheet as a [![PDF](https://img.shields.io/badge/PDF-red?style=flat-square)](#)

## Limitations
- Broker report formats may change without notice.
- Not every security may be supported by `GOOGLEFINANCE`.
- Market data may be delayed, unavailable, or incomplete.
- Generated formulas may behave differently depending on the spreadsheet application being used.

## ⚠️ **Warning & Disclaimer**

>[!IMPORTANT]
>
>SheetWeaver is provided as an open-source utility for organizing and transforming portfolio data. It is not financial, investment, tax, accounting, or legal advice.
>
>While reasonable care is taken when developing and testing the application, SheetWeaver may contain bugs, incorrect calculations, unsupported securities, parsing errors, or compatibility issues caused by changes to broker reports, spreadsheet software, external services, or market-data providers.
>
>Always verify generated values against your broker's original records before using them for financial, tax, investment, or other consequential decisions.
>
>The maintainers of SheetWeaver are not responsible for financial losses, data loss, incorrect calculations, missed transactions, incorrect portfolio values, or any other direct or indirect consequences resulting from the use of this software, to the extent permitted by applicable law.

## ❔ FAQ

**Q: Why should I use this when I can directly download the excel file from the platform ?**

**A:** Two main reasons!
First, you only need to use this tool once. After that, your Excel file will automatically sync with live market data without any extra effort on your end. <br>
Second, the default files provided by brokers are typically bloated, colorless, disorganized, and completely static.

<div align="center">
See the difference for yourself
<table align="center">
  <tr>
    <td align="center" width="50%">
      <img src="https://res.cloudinary.com/daylxkzkt/image/upload/v1787242017/raw_excel_fqwslz.png" alt="Groww dashboard">
      <br>
      <i>Static, raw export</i>
    </td>
    <td align="center" width="50%">
      <img src="https://res.cloudinary.com/daylxkzkt/image/upload/v1784527299/sheetspf_demo_mvygb7.png" alt="Groww reports page">
      <br>
      <i>Well-formatted, color-coded, and live-updated</i>
    </td>
  </tr>
</table>
</div>

**Q: Where is the user data stored, and what about privacy?**

**A:** No database is used as no data is stored to make things fast and you can download the desktop app which is fully offline so your data stays on your device only.

**Q: Why is no data showing in Microsoft Excel?**

**A:** The `GOOGLEFINANCE` function is supported by Google Sheets and is not natively supported by Microsoft Excel. As a result, Excel cannot evaluate `=GOOGLEFINANCE()` formulas and may return an error such as `#NAME?`.

If you want the generated spreadsheet to update automatically using `GOOGLEFINANCE`, open it in **Google Sheets**.

**Q: Why are some stocks highlighted in red and marked "Update Manually"?**

**A:**  This means that SheetWeaver was unable to find a supported ticker symbol for that stock, or that the stock is not supported by `GOOGLEFINANCE`.

If you want the market price to update automatically, you can manually find the correct ticker symbol and add it to the spreadsheet. Otherwise, SheetWeaver will use the current value from the original broker report as a fallback. Keep in mind that this value may not reflect the latest market price.

>[!TIP]
>You can check whether a stock or security is supported by searching for it on [GOOGLE FINANCE](https://www.google.com/finance/beta)

**Q: Is the market data real-time?**

**A:** Not necessarily. `GOOGLEFINANCE` determines the availability and update behavior of market data. Some prices may be delayed, unsupported, or temporarily unavailable.


## 💬 Technical Decisions & Rationale

**1. Why use the `Buy Price` as a fallback value for `Live Price` instead of the `Closing Price` provided in the broker report?**

**The Google Sheets Caching Quirk:** If you are importing this .xlsx file into Google Sheets, Google often evaluates bulk finance functions as `#N/A` for a brief second while the data fetches. If your fallback is a hardcoded string literal (e.g., injecting 135.52 directly into the formula), Sheets sometimes caches the fallback evaluation and stops trying to poll the live API.


```typescript
livePriceCell.value = { 
    formula: `IFERROR(GOOGLEFINANCE("${ticker}", "price"), C${rowIndex})` 
} as ExcelJS.CellValue;
```

For example, if we used a hardcoded value instead of a cell reference, Sheets would just return the hardcoded value and skip fetching the live stock price:

```bash
=IFERROR(GOOGLEFINANCE("GOOG:NASDAQ", "price"), C3) # ✔️ Will fetch the price first
=IFERROR(GOOGLEFINANCE("GOOG:NASDAQ", "price"), 0) # ❌ Skips calling API and returns 0
```

**2. Why GOOGLEFINANCE?**

We chose `GOOGLEFINANCE` because it was the simplest option to integrate with SheetWeaver and provides broad compatibility across devices through Google Sheets, without requiring SheetWeaver to maintain its own market-data infrastructure.

An alternative was to use Microsoft Excel's financial functions, but some of these features require a **Microsoft 365 subscription**.

For users who prefer Excel and only want to use it for documentation, Microsoft 365 provides functions such as `STOCKHISTORY`:

```text
=STOCKHISTORY("AAPL", start_date, end_date)
``` 
For a practical example, see this [Reference video](https://www.youtube.com/watch?v=7CqWwbcOxk4)


**3. Why Tauri over Electron ?** 

The project currently favors Tauri because of its smaller runtime footprint and its suitability for a lightweight desktop application.

<div align="center">

|Parameter|![Electron.js](https://img.shields.io/badge/Electron-%23191970.svg?style=for-the-badge&logo=Electron&logoColor=white)|![Tauri](https://img.shields.io/badge/tauri-%2324C8DB.svg?style=for-the-badge&logo=tauri&logoColor=%23FFFFFF)|
|---------|--------|-----|
|SheetWeaver size after installation| ~700 MB | ~15 MB|
|Performance| Resource-heavy | Native & Fast |

</div>

>[!NOTE]
>The size figures above are project-specific observations and can change across versions and build configurations. They should not be treated as universal Electron-vs-Tauri benchmarks.

## 🗺️ Roadmap
- [x] Groww stock portfolio support
- [ ] Mutual fund support
- [ ] Integrate additional broker platforms
- [ ] Manual ticker symbol entry
- [ ] Developer mode/API key support
- [ ] Automatic ISIN lookup
- [ ] Monthly portfolio reports
- [ ] Linux Support

## Development

### TECHSTACK

<div align="center">

[![Next JS](https://img.shields.io/badge/Next-%23000.svg?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NodeJS](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/en)
[![Tauri](https://img.shields.io/badge/tauri-%2324C8DB.svg?style=for-the-badge&logo=tauri&logoColor=%23FFFFFF)](https://v2.tauri.app/)
[![EXCELJS](https://img.shields.io/badge/EXCELJS-red?style=for-the-badge)](https://github.com/exceljs/exceljs)
</div>

Run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Run the Tauri app:

```bash
npx tauri dev
```

Build the application yourself:

```bash
npx tauri build
```

## 🤝 Contributing
Contributions, bug reports, feature suggestions, and improvements are welcome.

Before submitting a pull request, please consider opening an issue for larger changes so the proposed approach can be discussed first.

## 📜 License
This project is licensed under a **MIT License with Attribution Requirements**. 

While you are free to use, modify, and distribute the software, you must provide clear and prominent attribution to Adamya Gupta in any derivative works, tutorials, or distributions. You may not claim this software as your own original creation. 

See the [LICENSE](LICENSE) file for the full legal text and enforcement details.

## ⭐️ Show Your Support
If you found SheetWeaver helpful in organizing your investments, please consider giving the repository a star! It helps the project grow and makes it more visible to others who might benefit from it.
