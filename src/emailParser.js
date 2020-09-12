const cheerio = require("cheerio");

const Product = require("./Models/product.js");
const Order = require("./Models/order.js");

const titleOrder = {
    PICTURE: 0,
    DESCRIPTION: 1,
    UNIT_PRICE: 2,
    AMOUNT: 3,
    TOTAL_PRICE: 4,
    COMISSION: 5,
    INVOICE: 6,
}

const descOrder = {
    SKU: 0,
    NAME: 1,
    SIZE: 2,
    COLOR: 3,
}

const parse = function(htmlTable) {
    const $ = cheerio.load(htmlTable);

    const order = new Order();

    order.orderNumber = $("tbody").find('p').first().text().split(':')[1].trim();

    $("tbody").last()
        .children('tr')
        .each((i, tr) => {
            if(i === 0)
                return;

            let product = new Product();

            $(tr)
            .children('td')
            .each((j, td) => {
                switch(j) {
                    case titleOrder.DESCRIPTION:
                      const desc = processDescription(td);
                      product.sku = desc[descOrder.SKU];
                      product.name = desc[descOrder.NAME];
                      product.size = desc[descOrder.SIZE];
                      product.color = desc[descOrder.COLOR];
                      break;
                    case titleOrder.UNIT_PRICE:
                      product.unitPrice = parseInt($(td).text().trim().replace(' TL'));
                      break;
                    case titleOrder.AMOUNT:
                      product.amount = parseInt($(td).text().trim());
                      break;
                    case titleOrder.TOTAL_PRICE:
                      product.totalPrice = parseInt($(td).text().trim().replace(' TL'));
                      break;
                    case titleOrder.COMISSION:
                      product.comission = parseInt($(td).text().trim());
                      break;
                    case titleOrder.INVOICE:
                      product.invoicePrice = parseInt($(td).text().trim().replace(' TL'));
                      break;
                    default:
                  }
            })
            order.products.push(product);
        }).get();

    return order;
}

const processDescription = (data) => {
    const desc = []
    const $ = cheerio.load(data);
    
    desc.push($('h3').text().trim());
    
    $('p').each((i, p) => {
        desc.push($(p).text().replace(/\n/g, '').replace(/\s\s+/g, ' ').split(':')[1].trim())
    });

    return desc;
}

module.exports = parse;