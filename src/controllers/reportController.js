const fs = require("fs");
const { dirOut } = require("./../config/analyze");

module.exports = {
  async writeReport(data) {
    text = `● Quantidade de clientes no arquivo de entrada: ${data.client} \n\r● Quantidade de vendedor no arquivo de entrada : ${data.vendor} \n\r● ID da venda mais cara: ${data.idMoreExpensive}  Valor: ${data.valueMoreExpensive} \n\r● O pior vendedor:  ${data.worstSeller}  Valor: ${data.valueWorstSeller}`;

    fs.writeFile(
      dirOut + "/" + "relatorio.done.dat",
      text,
      { enconding: "latin", flag: "w" },
      function(err) {
        if (err) throw err;
        console.log("Arquivo salvo!");
      }
    );
  }
};
