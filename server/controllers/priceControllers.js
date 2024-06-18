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

exports.getAlpetPrices = async (req, res) => {
  const { city } = req.body;
  const upperCity = city.toLocaleUpperCase("tr-TR");
  console.log(upperCity);
  const today = new Date();
  const date = today.toISOString().split("T")[0];
  console.log(date);
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const url = `${process.env.ALPET_URI}?dt=${date}&city=${upperCity}`;
  await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
  await page.click(".cc-btn");
  console.log("butona basıldı");
  console.log(url);
  const prices = await page.$$eval("tbody tr", (rows) => {
    return rows.map((row) => {
      const columns = row.querySelectorAll("td");
      return Array.from(columns, (column) => column.innerText.trim());
    });
  });
  res.json(prices);
  console.log(prices);
};

exports.getKadoilPrices = async (req, res) => {
  try {
    const { city } = req.body;
    const lowerCity = city.toLowerCase();
    console.log(lowerCity);
    const browser = await puppeteer.launch({ headless: false });
    const url = `${process.env.KADOIL_URI}`;
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
    await page.click("#euCookieAcceptWP");
    console.log("butona basıldı");

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const frameHandle = await page.$("#frame");

    const frame = await frameHandle.contentFrame();

    await frame.waitForSelector("#selectProvince");

    await frame.select("#selectProvince", lowerCity);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    await frame.waitForSelector("table.table-striped.table-bordered");

    const rows = await frame.$$eval(
      "table.table-striped.table-bordered tbody tr",
      (rows) => {
        return rows.map((row) => {
          const cells = row.querySelectorAll("td");
          return Array.from(cells).map((cell) => cell.innerText);
        });
      }
    );

    const aliagaValues = rows[0];

    console.log(aliagaValues);
    res.json(aliagaValues);
  } catch (error) {
    console.log("Error", error);
  }
};

exports.getTotalPrices = async (req, res) => {
  try {
    const { city } = req.body;
    const upperCity = city.toUpperCase();
    console.log(upperCity);
    const browser = await puppeteer.launch({ headless: false });
    const url = `${process.env.TOTAL_URI}`;
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });

    // Şehir seçiciyi bekleyin
    await page.waitForSelector('select[name="cityID"]');

    // Şehir değerini almak için seçiciyi kullanın
    const cityValue = await page.evaluate((upperCity) => {
      const options = Array.from(
        document.querySelectorAll('select[name="cityID"] option')
      );
      const targetOption = options.find((option) =>
        option.textContent.trim().includes(upperCity)
      );
      return targetOption ? targetOption.value : null;
    }, upperCity);

    if (cityValue) {
      await page.evaluate((cityValue) => {
        const event = new Event("change", { bubbles: true });
        const selectElement = document.querySelector('select[name="cityID"]');
        selectElement.value = cityValue;
        selectElement.dispatchEvent(event);
      }, cityValue);

      await page.waitForSelector('table[border="1"]', { visible: true });
      const prices = await page.evaluate((upperCity) => {
        const rows = Array.from(
          document.querySelectorAll('table[border="1"] tr')
        );
        const headerRow = rows.find(
          (row) =>
            row.querySelector("td").textContent.trim().toUpperCase() ===
            upperCity
        );
        if (headerRow) {
          const priceRow = headerRow.nextElementSibling; // başlık satırının hemen altına inmemizi sağlıyor
          if (priceRow) {
            return Array.from(priceRow.querySelectorAll("td:not(:first-child)"))
              .map((td) => {
                const text = td.textContent.trim();
                const match = text.match(/\d+[\.,]?\d*/);
                return match ? match[0] : null;
              })
              .filter((n) => n);
          }
        }
        return [];
      }, upperCity);

      console.log(prices);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

// exports.getShellPrices = async (req, res) => {
//   const { city } = req.body;
//   try {
//     const browser = await puppeteer.launch({ headless: false });
//     const page = await browser.newPage();
//     const url = process.env.SHELL_URI;
//     await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
//     await page.waitForSelector(".evidon-banner-acceptbutton", {
//       visible: true,
//     });

//     await page.click(".evidon-banner-acceptbutton");

//     await new Promise((resolve) => setTimeout(resolve, 5000));

//     const upperCaseCity = city.toUpperCase();
//     const element = await page.$('#cb_all_cb_province_B-1');
//     if (element) {
//       const box = await element.boundingBox();
//       // Elementin ortasına mousedown olayı göndermek için
//       await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
//       await page.mouse.down();
//       // Eğer mouseup olayı da gerekiyorsa
//       await page.mouse.up();
//     } else {
//       throw new Error('Element not found');
//     }
//   } catch (error) {
//     console.log("Error", error);
//   }
// };
