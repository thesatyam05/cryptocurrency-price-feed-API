const PORT = process.env.PORT || 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();

async function getPrice() {
  try {
    //https://www.coingecko.com/
    // https://coinmarketcap.com/
    const { data } = await axios({
      method: "GET",
      url: "https://www.coingecko.com/",
    });
    const pricesData = [];

    const $ = cheerio.load(data);
    $("tbody").each((i, element) => {
      $(element)
        .children()
        .each((childIdx, childElem) => {
          const $childElement = $(childElem);

          //getting actual data
          const coinNumber = $childElement
            .find(".table-number")
            .text()
            .replace(/\s/g, "");
          const coinLogo = $childElement
            .find(".coin-name > div > div > img")
            .attr("src");
          const coinSymbol = $childElement
            .find(".d-lg-none")
            .text()
            .replace(/\s/g, "");
          const coinName = $childElement
            .find("td.coin-name")
            .attr("data-sort")
            .replace(/\s/g, "");
          const price = $childElement
            .find(".td-price")
            .text()
            .replace(/\s/g, "");
          const oneHourChange = $childElement
            .find(".td-change1h > span")
            .text()
            .replace(/\s/g, "");
          const twentyFourHourChange = $childElement
            .find(".td-change24h > span")
            .text()
            .replace(/\s/g, "");
          const sevenDayChange = $childElement
            .find(".td-change7d > span")
            .text()
            .replace(/\s/g, "");
          const twentyFourHourVolume = $childElement
            .find(".td-liquidity_score > span")
            .text()
            .replace(/\s/g, "");
          const marketCap = $childElement
            .find(".td-market_cap > span")
            .text()
            .replace(/\s/g, "");

          // td - change7d;
          //saving coin data in object which will pushed to array
          const coinData = {
            Id: coinNumber,
            Logo: coinLogo,
            Symbol: coinSymbol,
            CoinName: coinName,
            Price: price,
            "1hChange": oneHourChange,
            "24hChange": twentyFourHourChange,
            "7dChange": sevenDayChange,
            Volume24h: twentyFourHourVolume,
            MarketCapital: marketCap,
          };
          pricesData.push(coinData);
        });
    });
    return pricesData;
  } catch (err) {
    console.log(err);
  }
}

app.get("/", async (req, res) => {
  res.json({ greetings: "welcome to live crypto priceFeed API" });
});
app.get("/pricefeed", async (req, res) => {
  const result = await getPrice();
  return res.status(200).json({
    result: result,
  });
});

app.listen(PORT, () => console.log(`server started at ${PORT} 🚀💨`));
