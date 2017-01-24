import db from '.';
import { createEvent } from '../stats';

const trackProductUsage = transactionProduct => {
    db.Product.findOne({
        where: {
            id: transactionProduct.productId
        }
    })
    .then(product => {
        if (product) {
            return createEvent([
                {
                    measurement: 'product_sale',
                    tags: {
                        name: product.name,
                        type: product.type
                    },
                    fields: {
                        count: Number(transactionProduct.count)
                    }
                }
            ]);
        }
    });
};

export default function(sequelize, DataTypes) {
    return sequelize.define('transactionProduct', {
        count: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        hooks: {
            afterCreate: transactionProduct => trackProductUsage(transactionProduct),
            afterBulkCreate: transactionProducts =>
                transactionProducts.map(transactionProduct => trackProductUsage(transactionProduct))
        }
    });
}
