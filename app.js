const express = require('express');
const formidable = require('formidable');
const app = express();
const skuToSizeAndPrice = require('./data/data.js').skuToSizeAndPrice;

app.get('/shirts/sizesAndPrices', function(req, res) {
    let sku = req.query.sku;
    let response = {};
    response[sku] = skuToSizeAndPrice[sku];
    setTimeout(() => res.json(response), 1000); // Simulate network delay.
});

app.get('/search', function(req, res) {
    let data = { item: [] }
    if (req.query) {
        data.items = require('./data/data.js').items.filter(item => findIndex(item, req))
    } else {
        data.items = require('./data/data.js').items;
    }
    res.status(200).json(data);
})

const findIndex = (item, req) => {
    return (
        item.name.first.indexOf(req.query) > -1 ||
        item.name.last.indexOf(req.query) > -1 ||
        item.about.indexOf(req.query) > -1
    )
}
app.post('/shirts/addToCart', function(req, res) {
    // Necessary for AMP CORS security protocol.
    // @see https://github.com/ampproject/amphtml/blob/master/spec/amp-cors-requests.md
    res.setHeader('AMP-Access-Control-Allow-Source-Origin',
        'http://localhost:3000');

    let form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        if (fields.color && fields.size && fields.quantity) {
            res.status(200).json(fields);
        } else {
            res.status(400).json({ error: 'Please select a size.' });
        }
    });
});

app.use('/', express.static('static'));

app.listen(3000, function() {
    console.log('Server for "Advanced Interactivity in AMP" codelab listening on port 3000!');
});