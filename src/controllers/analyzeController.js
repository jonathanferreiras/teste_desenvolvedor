const fs = require('fs')
const { dirIn, dirOut, type, format, separator, numberVendor, numberClient, numberSale } = require('./../config/analyze')
const readdirp = require('readdirp')
const { promisify } = require('util')

module.exports = {

    filesOld: [],
    allFiles: [],


    async analyze() {
        await module.exports.getFiles()
        let response = await module.exports.checkDifference()
        if (response) {
            await module.exports.process()
        } 

        console.log('fim')
    },

    async getFiles() {

        let settings = {
            entryType: type,
            fileFilter: [format],
        };

        let files = []

        readdirp(dirIn, settings)
            .on('data', function (entry) {

                files.push(
                    entry.path
                );
            })
            .on('warn', function (warn) {
                console.log("Aviso: ", warn)
            })
            .on('error', function (err) {
                console.log("Erro: ", err)
            })
            .on('end', function () {
                module.exports.allFiles = files
            })
    },

    async checkDifference() {

        console.log(this.filesOld)
        console.log(this.allFiles)

        if (JSON.stringify(this.filesOld) == JSON.stringify([])) {           
            module.exports.filesOld = this.allFiles
            module.exports.allFiles = []
            return true;

        }

        if (JSON.stringify(this.filesOld) != JSON.stringify(this.allFiles)) {
            module.exports.filesOld = this.allFiles
            module.exports.allFiles = []
            return true;
        } else {
            module.exports.allFiles = []
            return false;
        }
    },

    async process() {

        //const readFile = promisify(fs.readFile)

        let resultFinal = {
            client : 0,
            vendor: 0,
            idMoreExpensive: 0,
            valueMoreExpensive: 0,
            worstSeller: 0,
            valueWorstSeller: 0
        }

        let vendors = []     

        for await (const file of this.filesOld) {        
            fs.readFileSync(dirIn + '/' + file,  async function(err,data){
               if(err) {
                   console.error("Could not open file: %s", err);                    
                   process.exit(1);
               }

               //lines = data.toString('utf8').split('\r\n')
               lines = data.toString('latin1').split('\r\n')
               // lines = data.toString('ascii').split('\r\n')

               for await (const line of lines ) {
                   result = line.split(separator); 
                   if (result[0] == numberVendor) {
                       resultFinal.vendor++
                   }
                   if (result[0] == numberClient) {
                       resultFinal.client++
                   }

                   if (result[0] == numberSale) {
                       total = 0
                       sales = result[2].replace('[','').replace(']','').split(',')
                       for await (const sale of sales) {
                           item = sale.split('-')
                           
                           total = total + parseFloat((item[1] * item[2]))
                           vendors[result[3]] = total 
                           console.log(resultFinal)    
                                               
                       } 
                   }                   
                }
           });
        }
        
        console.log('Ultimo')
        console.log(resultFinal)

    },

   
}