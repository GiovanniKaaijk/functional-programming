const express = require('express')
const app = express()
const port = 9090;

app
    .use(express.static(__dirname + '/src'))
    .set('view engine', 'html')
    .get('/', (req, res) => res.render("index", {}))
    .listen(port, () => console.log(`Server is gestart op poort: ${port}`))
;