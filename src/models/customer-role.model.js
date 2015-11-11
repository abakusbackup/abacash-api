import config from '../config';

export default function(sequelize, DataTypes) {
    const CustomerRole = sequelize.define('customerRole', {
        role: {
            type: DataTypes.STRING,
            defaultValue: config.defaultCustomerRole
        },
        internalSales: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isSeller: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        classMethods: {
            associate(models) {
                CustomerRole.belongsTo(models.System);
                CustomerRole.hasMany(models.Customer);
            }
        }
    });

    return CustomerRole;
}
