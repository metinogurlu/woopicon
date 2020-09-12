module.exports = function(orderNumber, products, dateAt) {
    this.orderNumber = orderNumber;
    this.dateAt = dateAt === undefined ? new Date() : dateAt;
    this.products = Array.isArray(products) ? products : [];
}