export default function(sequelize, DataTypes) {
    const Transaction = sequelize.define('transaction', {
        total: {
            type: DataTypes.DECIMAL,
            defaultValue: 0.0,
            get() {
                return Math.round(Number(this.getDataValue('total')) * 100) / 100.0;
            }
        },

        customerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sellerId: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        classMethods: {
            associate(models) {
                Transaction.belongsToMany(models.Product, {
                    through: models.TransactionProduct
                });
                Transaction.belongsTo(models.Customer, {
                    as: 'customer',
                    foreignKey: 'customerId'
                });
                Transaction.belongsTo(models.Customer, {
                    as: 'seller',
                    foreignKey: 'sellerId'
                });
                Transaction.belongsTo(models.System);
            }
        }
    });

    return Transaction;
}
