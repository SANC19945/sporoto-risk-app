const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", async (req, res) => {
    try {
        const url = "https://www.sportotohedef15.com/sportoto_formulleri_tahminleri_analizleri_yorumlari/spor_toto_yorumlar.php";
const { data } = await axios.get(url, {
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
        "Connection": "keep-alive"
    }
});        const $ = cheerio.load(data);

        let percentages = [];

        $("body").text().match(/\d+%/g)?.forEach(p => {
            percentages.push(parseInt(p.replace("%", "")));
        });

        let matches = [];
        for (let i = 0; i < percentages.length; i += 12) {
            matches.push(percentages.slice(i, i + 12));
        }

        let tableRows = "";

        matches.forEach((match, index) => {
            if (match.length === 12) {
                const avg = arr => arr.reduce((a,b)=>a+b,0)/arr.length;

                let oneAvg = avg(match.slice(0,4)).toFixed(2);
                let drawAvg = avg(match.slice(4,8)).toFixed(2);
                let twoAvg = avg(match.slice(8,12)).toFixed(2);

                let oneRisk = (100/oneAvg).toFixed(2);
                let drawRisk = (100/drawAvg).toFixed(2);
                let twoRisk = (100/twoAvg).toFixed(2);

                tableRows += `
                <tr>
                    <td>${index+1}</td>
                    <td>${oneAvg}</td>
                    <td>${drawAvg}</td>
                    <td>${twoAvg}</td>
                    <td>${oneRisk}</td>
                    <td>${drawRisk}</td>
                    <td>${twoRisk}</td>
                </tr>
                `;
            }
        });

        res.send(`
        <html>
        <head>
            <title>Spor Toto Risk Analizi</title>
            <style>
                body { font-family: Arial; background:#111; color:white; text-align:center; }
                table { margin:auto; border-collapse: collapse; }
                th, td { border:1px solid white; padding:8px; }
                th { background:#333; }
                h1 { color:#00ff99; }
            </style>
        </head>
        <body>
            <h1>Spor Toto Ortalama & Risk</h1>
            <table>
                <tr>
                    <th>Maç</th>
                    <th>1 Ort</th>
                    <th>X Ort</th>
                    <th>2 Ort</th>
                    <th>1 Risk</th>
                    <th>X Risk</th>
                    <th>2 Risk</th>
                </tr>
                ${tableRows}
            </table>
        </body>
        </html>
        `);

    } catch (error) {
        res.send("Hata oluştu: " + error.message);
    }
});

app.listen(PORT, () => console.log("Server çalışıyor"));
