import Bluebird from 'bluebird';
import bcrypt from 'bcrypt';
Bluebird.promisifyAll(bcrypt);

export default function(sequelize, DataTypes) {
    const User = sequelize.define('user', {
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        name: DataTypes.STRING,
        hash: DataTypes.STRING
    }, {
        classMethods: {
            associate(models) {
                User.belongsToMany(models.System, {
                    through: models.SystemRole,
                    foreignKey: 'userId'
                });
            },
            register(body, password) {
                return bcrypt.genSaltAsync()
                .then(salt => bcrypt.hashAsync(password, salt))
                .then(hash => User.create({
                    ...body,
                    hash
                }));
            }
        },
        instanceMethods: {
            authenticate(password) {
                return bcrypt.compareAsync(password, this.hash);
            },
            updatePassword(password) {
                return bcrypt.genSaltAsync()
                    .then(salt => bcrypt.hashAsync(password, salt))
                    .then(hash => {
                        this.hash = hash;
                        return this.save();
                    });
            }
        }
    });

    return User;
}
