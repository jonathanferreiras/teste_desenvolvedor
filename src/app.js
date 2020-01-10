const { analyze } = require('./controllers/analyzeController')



setInterval( async () => {
   const aqui = await analyze()
   
   // console.log(allFiles)
    //var diference = await checkDifference(files);
    //console.log(diference)    

    
}, 5000);
