import sequelizeFixtures from 'sequelize-fixtures';
import fs from 'fs';
import { omit, find } from 'lodash';
import Promise from 'bluebird';
import pgpLib from 'pg-promise';
import jsonfile from 'jsonfile';
import { syncDB } from '../src/model-helpers';
import DB from '../src/models';

Promise.promisifyAll(jsonfile);
Promise.promisifyAll(fs);
const pgp = pgpLib({ promiseLib: Promise });
const db = pgp(process.env.PG_URL);
const temp = './data';
const fixtures = [
    `${temp}/systems.json`,
    `${temp}/users.json`,
    `${temp}/system-roles.json`,
    `${temp}/product-groups.json`,
    `${temp}/products.json`,
    `${temp}/api-tokens.json`,
    `${temp}/customer-roles.json`,
    `${temp}/customers.json`,
    `${temp}/transactions.json`,
    `${temp}/transaction-products.json`
];

const parseSystemRoles = () => db.map('SELECT * FROM "systemRoles"', [], a => ({ model: 'SystemRole', data: a }))
    .then(customers => jsonfile.writeFileAsync(`${temp}/system-roles.json`, customers));

const parseCustomer = () => db.map('SELECT * FROM customers', [], a => ({ model: 'Customer', data: a }))
    .then(customers => jsonfile.writeFileAsync(`${temp}/customers.json`, customers));

const parseUsers = () => db.map('SELECT * FROM users', [], a => ({ model: 'User', data: a }))
    .then(users => jsonfile.writeFileAsync(`${temp}/users.json`, users));

const parseTransactions = () => db.map('SELECT * FROM transactions', [], a => ({ model: 'Transaction', data: a }))
    .then(trans => jsonfile.writeFileAsync(`${temp}/transactions.json`, trans));

const parseCustomerRoles = () => db.map('SELECT * FROM "customerRoles"', [], a => ({ model: 'CustomerRole', data: a }))
    .then(roles => jsonfile.writeFileAsync(`${temp}/customer-roles.json`, roles));

const parseAPITokens = () => db.map('SELECT * FROM "APITokens"', [], a => ({ model: 'APIToken', data: a }))
    .then(tokens => jsonfile.writeFileAsync(`${temp}/api-tokens.json`, tokens));

const parseTransactionProducts = () => db.map('SELECT * FROM "transactionProducts"', [], a => ({ model: 'TransactionProduct', data: a }))
    .then(trans => jsonfile.writeFileAsync(`${temp}/transaction-products.json`, trans));

const parseSystems = () => db.many('SELECT * FROM systems')
    .map(systemData => {
        const system = ({ model: 'System', data: omit(systemData, ['productTypes']) });
        const productGroups = systemData.productTypes.map(type =>
            ({ model: 'ProductGroup', data: { name: type, systemId: systemData.id } }));
        return { system, productGroups };
    })
    .then(data => {
        let systems = [];
        let productGroups = [];

        data.forEach(value => {
            systems = [value.system, ...systems];
            productGroups = [...value.productGroups, ...productGroups];
        });

        productGroups = productGroups
            .map((group, id) => ({ model: 'ProductGroup', data: { ...group.data, id: id + 1 } }));
        return Promise.all([
            jsonfile.writeFileAsync(`${temp}/systems.json`, systems),
            jsonfile.writeFileAsync(`${temp}/product-groups.json`, productGroups),
            productGroups
        ]);
    })
    .spread((systemsData, productGroupsData, data) => {
        const productGroups = data.map(group => ({ ...group.data }));
        db.many('SELECT * FROM products')
            .map(product => {
                const productGroup = find(productGroups, {
                    systemId: product.systemId,
                    name: product.type
                });

                if (!productGroup) {
                    return null;
                }

                return { model: 'Product', data: {
                    ...omit(product, ['type']),
                    productGroupId: productGroup.id
                } };
            })
            .then(products => {
                const dataset = products.filter(Boolean);

                jsonfile.writeFileAsync(`${temp}/products.json`, dataset);
            });
    });

fs.mkdirAsync(temp)
    .catch(() => {})
    .then(() => parseSystems())
    .then(() => Promise.all([
        parseCustomer(),
        parseUsers(),
        parseSystemRoles(),
        parseTransactions(),
        parseCustomerRoles(),
        parseAPITokens(),
        parseTransactionProducts()
    ]))
    .then(() => {
        console.log('Parsed Data');
        return syncDB({ force: true });
    })
    .then(() => sequelizeFixtures.loadFiles(fixtures, DB))
    .then(() => {
        console.log('Loaded data!');
        process.exit(0);
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
