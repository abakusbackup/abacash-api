export default function(sequelize, DataTypes) {
    return sequelize.define('transactionProduct', {
        count: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
}
