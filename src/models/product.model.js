export default function(sequelize, DataTypes) {
    const Product = sequelize.define('product', {
        type: DataTypes.STRING,
        price: {
            type: DataTypes.DECIMAL,
            get() {
                return Number(this.getDataValue('price'));
            }
        },
        internalPrice: {
            type: DataTypes.DECIMAL,
            allowNull: true,
            get() {
                if (!this.getDataValue('internalPrice')) {
                    return Number(this.getDataValue('price'));
                }
                return Number(this.getDataValue('internalPrice'));
            }
        },
        name: DataTypes.STRING,
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        stock: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        keepStock: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        classMethods: {
            associate(models) {
                Product.belongsTo(models.System, {
                    foreignKey: {
                        allowNull: false
                    }
                });
                Product.belongsToMany(models.Transaction, {
                    through: models.TransactionProduct
                });
            }
        }
    });

    return Product;
}
