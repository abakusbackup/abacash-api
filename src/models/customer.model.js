export default function(sequelize, DataTypes) {
    const Customer = sequelize.define('customer', {
        rfid: {
            type: DataTypes.STRING,
            unique: 'customers_rfid_unique'
        },
        displayName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value) {
                this.setDataValue('username', value.toLowerCase());
            }
        },
        systemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: 'customers_rfid_unique'
        },
        balance: {
            type: DataTypes.DECIMAL,
            get() {
                return Math.round(Number(this.getDataValue('balance')) * 100) / 100.0;
            }
        }
    }, {
        classMethods: {
            associate(models) {
                Customer.hasMany(models.Transaction);
                Customer.belongsTo(models.System);
                Customer.belongsTo(models.CustomerRole);
            }
        }
    });

    return Customer;
}
