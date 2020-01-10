const fs = require("fs");
const {
  dirIn,
  type,
  format,
  separator,
  numberVendor,
  numberClient,
  numberSale
} = require("./../config/analyze");
const readdirp = require("readdirp");

module.exports = {
  filesOld: [],
  allFiles: [],

  async analyze() {
    await module.exports.getFiles();
    let response = await module.exports.checkDifference();
    if (response) {
      console.log("Atualizando arquivos...");
      let { resultFinal, vendor } = await module.exports.process();
      let resp = await module.exports.processWorstSeller(vendor);
      data = Object.assign(resultFinal, resp);
      return data;
    }

    return false;
  },

  async getFiles() {
    let settings = {
      entryType: type,
      fileFilter: [format]
    };

    let files = [];

    const doc = await readdirp.promise(dirIn, settings);
    doc.map(entry => {
      files.push(entry.path);
    });

    module.exports.allFiles = files;
  },

  async checkDifference() {
    if (JSON.stringify(this.filesOld) == JSON.stringify([])) {
      module.exports.filesOld = this.allFiles;      
      module.exports.allFiles = [];
      return true;
    }

    if (JSON.stringify(this.filesOld) != JSON.stringify(this.allFiles)) {
      module.exports.filesOld = this.allFiles;
      module.exports.allFiles = [];
      return true;
    } else {
      module.exports.allFiles = [];
      return false;
    }
  },

  async process() {
    let resultFinal = {
      client: 0,
      vendor: 0,
      idMoreExpensive: 0,
      valueMoreExpensive: 0,
      worstSeller: 0,
      valueWorstSeller: 0
    };

    let vendor = {};

    let total = 0;

    for await (const file of this.filesOld) {
      let data = fs.readFileSync(dirIn + "/" + file);

      lines = data.toString("latin1").split("\r\n");

      for await (const line of lines) {
        result = line.split(separator);
        if (result[0] == numberVendor) {
          resultFinal.vendor++;
        }
        if (result[0] == numberClient) {
          resultFinal.client++;
        }

        if (result[0] == numberSale) {
          sales = result[2]
            .replace("[", "")
            .replace("]", "")
            .split(",");
          for await (const sale of sales) {
            item = sale.split("-");

            total = total + parseFloat(item[1] * item[2]);
            vendor[result[3]] = total;
          }

          if (resultFinal.valueMoreExpensive == 0) {
            resultFinal.valueMoreExpensive = total;
            resultFinal.idMoreExpensive = result[1];
          } else {
            if (resultFinal.valueMoreExpensive > total) {
              resultFinal.valueMoreExpensive = total;
              resultFinal.idMoreExpensive = result[1];
            }
          }
        }
      }
    }

    return { resultFinal, vendor };
  },

  async processWorstSeller(vendor) {
    totalValue = 0;
    resp = {};

    for (var value in vendor) {
      if (totalValue == 0) {
        resp.valueWorstSeller = vendor[value];
        resp.worstSeller = value;
        totalValue = vendor[value];
      } else {
        if (resp.valueWorstSeller > value) {
          resp.valueWorstSeller = vendor[value];
          resp.worstSeller = value;
          totalValue = vendor[value];
        }
      }
    }

    return resp;
  }
};
