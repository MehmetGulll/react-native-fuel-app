const puppeteer = require("puppeteer");

exports.getOpetPrices = async (req, res) => {
  const { city } = req.body;
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const url = `${process.env.OPET_URI}/${city}`;

    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
    console.log("Sayfaya gidildi.");

    await page.waitForSelector(".all-accept-cookie-btn", { visible: true });
    console.log("Çerez pop-up'ı bulundu.");

    await page.click(".all-accept-cookie-btn");
    console.log("Çerez kabul etme butonuna tıklandı.");

    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log("Ekstra bekleme süresi tamamlandı.");

    await page.waitForSelector(".FuelPrice-module_tableFuelPrice--1ch", {
      timeout: 60000,
    });
    console.log("Fiyat tablosu yüklendi.");

    page.on("console", (consoleObj) => console.log(consoleObj.text()));

    const fuelPrices = await page.evaluate(() => {
      const prices = [];
      const rows = document.querySelectorAll(
        ".FuelPrice-module_tableFuelPrice--1ch tbody tr"
      );
      console.log("Toplam satır sayısı:", rows.length);

      rows.forEach((row) => {
        const priceSpans = row.querySelectorAll(".ml-auto");
        priceSpans.forEach((span) => {
          const priceText = span.textContent;
          const match = priceText.match(/(\d+\.\d+)\s*TL\/L/);
          if (match) {
            prices.push(match[1]);
          }
        });
      });
      return prices.slice(0, 3);
    });

    console.log("İlk üç fiyat:", fuelPrices);
    res.json(fuelPrices);

    await browser.close();
  } catch (error) {
    console.error("Hata", error);

    res
      .status(500)
      .json({ error: "Yakıt fiyatlarını çekme işlemi başarısız oldu." });
  }
};
exports.getBPPrices = async (req, res) => {
  const { city } = req.body;
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const url = process.env.BP_URI;
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
    console.log("Sayfaya gidildi");
    await page.waitForSelector(".nr-cookie-accept", { visible: true });
    console.log("Çerezi pop up bulundu!");
    await page.click(".nr-cookie-accept");
    console.log("Çerez pop up tıklandı kabul edildi!");

    await page.click('select[name="city"]');

    await page.evaluate((city) => {
      let options = [
        ...document.querySelectorAll('select[name="city"] option'),
      ];
      let targetOption = options.find(
        (option) => option.textContent.trim() === city
      );
      if (targetOption) {
        targetOption.selected = true;
        let event = new Event("change", { bubbles: true });
        targetOption.parentElement.dispatchEvent(event);
      }
    }, city.toLocaleUpperCase("tr-TR"));

    console.log(`${city} değeri girildi`);

    await page.waitForFunction(
      () => {
        let districtSelect = document.querySelector('select[name="district"]');
        return districtSelect && districtSelect.options.length > 1;
      },
      { timeout: 30000 }
    );

    await page.evaluate(() => {
      let districtSelect = document.querySelector('select[name="district"]');
      let options = [...districtSelect.options].filter(
        (option) => !option.disabled
      );
      if (options.length > 0) {
        options[0].selected = true;
        let event = new Event("change", { bubbles: true });
        districtSelect.dispatchEvent(event);
      }
    });

    console.log("İlçe değeri girildi");

    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Ekstra bekleme süresi tamamlandı.");

    await page.click('button[name="submitButton"]');
    console.log("Ara butonuna basıldı");

    await page.waitForSelector("tbody.pp-tbody");

    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log("Ekstra bekleme süresi ekleniyor..");

    const prices = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll("tbody.pp-tbody tr"));
      return rows.map((row) => {
        const cells = Array.from(row.querySelectorAll("td"));
        return cells.map((cell) => cell.textContent.trim());
      });
    });
    res.json(prices);
    console.log("Alınan fiyatlar:", prices);
  } catch (error) {
    console.log("Error", error);
  }
};
