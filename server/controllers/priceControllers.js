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
  console.log("değer", city);
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
        const cells = Array.from(row.querySelectorAll("td")); // tek arraye dönüştürülecek
        return cells.map((cell) => cell.textContent.trim());
      });
    });
    if (prices) {
      res.json(prices);
    } else {
      res.json("Petrol ofisi bulunmamaktadır!");
    }

    console.log("Alınan fiyatlar:", prices);
    await browser.close();
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
  await browser.close();
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

    const frame = await frameHandle.contentFrame(); // diğer istediklerim iframe içinde oldugu için iframei aldım önce

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
    await browser.close();
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

    await page.waitForSelector('select[name="cityID"]');

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
      res.json(prices);
      console.log(prices);
      await browser.close();
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

exports.getPetrolOfisiPrices = async (req, res) => {
  try {
    const { city } = req.body;
    console.log(city);
    const browser = await puppeteer.launch({ headless: false });
    const url = `${process.env.PETROLOFISI_URI}`;
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });

    await page.evaluate((city) => {
      const option = [
        ...document.querySelectorAll(
          ".form-select.form-control-lg.position-relative.zi-1.filter.filter_CityId.cities-dropdown option"
        ),
      ].find((opt) => opt.textContent.trim() === city);
      if (option) {
        option.selected = true;
        const event = new Event("change", { bubbles: true }); // change yapma sebebimiz onchange yani selecti tetiklemsini sağlamak
        option.dispatchEvent(event);
      }
    }, city);

    console.log("Seçim yapıldı");
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const priceElements = await page.$$(
      ".table-prices .price-row td span.with-tax"
    );
    const prices = await Promise.all(
      priceElements.map(async (element) => {
        const priceText = await element.evaluate((el) => el.textContent);
        return parseFloat(priceText);
      })
    );

    console.log("Fiyatlar:", prices);
    res.json(prices.slice(0, 7));

    console.log(prices.slice(0, 7));
    await browser.close();
  } catch (error) {
    console.log("Hata", error);
  }
};

exports.getAytemizPrices = async (req, res) => {
  try {
    const { city } = req.body;
    console.log(city);

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(process.env.AYTEMIZ_URI, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    await page.click("#c-p-bn");

    await page.waitForSelector(
      'select[name="ctl00$ContentPlaceHolder1$C001$ddlCity"]'
    );

    await page.evaluate((city) => {
      const citySelect = document.querySelector(
        'select[name="ctl00$ContentPlaceHolder1$C001$ddlCity"]'
      );
      const option = [...citySelect.options].find(
        (opt) => opt.textContent.trim() === city
      );
      if (option) {
        option.selected = true;
        const event = new Event("change", { bubbles: true });
        citySelect.dispatchEvent(event);
      }
    }, city);

    console.log(`${city} seçildi`);

    await page.waitForSelector(
      "table#fuel-price-table tbody tr td:not(:first-child)",
      { visible: true }
    ); // sayfa yenilenince beklesin diye konuldu

    const priceElements = await page.$$(
      "#fuel-price-table tbody tr td:not(:first-child)"
    );

    const prices = await Promise.all(
      priceElements.map(async (element) => {
        const priceText = await element.evaluate((el) => el.textContent);
        return parseFloat(priceText.replace(",", "."));
      })
    );

    console.log("Fiyatlar:", prices);
    res.json(prices.slice(0, 4));
    await browser.close();
  } catch (error) {
    console.log("Hata:", error);
  }
};
exports.getShellPrices = async (req, res) => {
  const { city } = req.body;
  const upperCity = city.toUpperCase();
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const url = process.env.SHELL_URI;
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });

    console.log("Page loaded");

    await page.waitForSelector(".evidon-banner-acceptbutton", { visible: true });
    await page.click(".evidon-banner-acceptbutton");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const frameHandle = await page.$(".iframed-app__iframe");
    const frame = await frameHandle.contentFrame();
    
    console.log("Frame found");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    let dropdownLoaded = false;
    for (let i = 0; i < 5; i++) { // 5 retries
      try {
        await frame.waitForSelector(".dxEditors_edtDropDown", { timeout: 15000 });
        console.log("Dropdown found");
        dropdownLoaded = true;
        break;
      } catch (error) {
        console.log("Dropdown not found, retrying...");
        await new Promise((resolve) => setTimeout(resolve, 3000)); // wait 3 seconds before retrying
      }
    }

    if (!dropdownLoaded) {
      throw new Error("Dropdown could not be loaded after multiple attempts");
    }

    await frame.click(".dxEditors_edtDropDown");
    console.log("Dropdown clicked");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const options = await frame.$$(".dxeListBoxItem");
    for (const option of options) {
      const optionText = await option.evaluate((el) => el.textContent);
      if (optionText.toUpperCase() === upperCity) {
        await option.click();
        console.log(`Option for city ${upperCity} clicked`);
        break;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const rows = await frame.$$(".dxgvDataRow");
    const data = [];

    for (const row of rows) {
      const cells = await row.$$("td");

      if (cells.length > 2) {
        const cityName = await cells[0].evaluate((el) => el.textContent.trim());
        const price1 = await cells[1].evaluate((el) => el.textContent.trim());
        const price2 = await cells[2].evaluate((el) => el.textContent.trim());

        data.push({ cityName, price1, price2 });
      } else {
        console.log('Expected at least 3 cells in the row, but found:', cells.length);
      }
    }

    await browser.close();
    res.json({ data });

  } catch (error) {
    console.log("Hata", error);
    res.status(500).json({ error: error.message });
  }
};



