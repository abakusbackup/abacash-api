import db from '../models';
import { NotFoundError, ModelValidationError, ValidationError } from '../components/errors';
import ConflictError from '../components/errors';
import Sequelize from 'sequelize';
import Bluebird from 'bluebird';
import SERIALIZATION_FAILURE from '../components/constants';

function checkIfSellerIsSeller(sellerId, needSeller) {
    if (needSeller) {
        return db.Customer.findById(sellerId)
        .then(customer => customer.getCustomerRole())
        .then(role => role.isSeller);
    }
    return Bluebird.resolve(true);
}

export function list(req, res, next) {
    req.system.getTransactions()
    .then(res.json.bind(res))
    .catch(next);
}

export function retrieve(req, res, next) {
    db.Transaction.findOne({ where: {
        id: req.params.transactionId,
        systemId: req.system.id
    } })
    .then(transaction => {
        if (!transaction) throw new NotFoundError();
        res.json(transaction);
    })
    .catch(next);
}

export function add(req, res, next) {
    let currentTransaction;
    let currentCustomer;
    let currentTotal;
    let currentCustomerRole;


    // start database transaction
    db.sequelize.transaction(t => {
        // transaction must contain products
        if (!req.body.products || req.body.products.length === 0) {
            return next(new ValidationError('A transaction must contain at least one product'));
        }

        // check that seller is included if system needs seller
        if (req.system.needSeller && !req.body.sellerId) {
            return next(new ValidationError('A transaction for this system requires a seller'));
        }
        // find and store customer
        return checkIfSellerIsSeller(req.body.sellerId, req.system.needSeller)
        .then(isSeller => {
            if (!isSeller) {
                throw new ValidationError('sellerId does not belong to a seller');
            }
            return db.Customer.findById(req.body.customerId);
        })
        .then(customer => {
            if (!customer) {
                throw new ValidationError('Customer for transaction not found');
            }
            currentCustomer = customer;
            return customer.getCustomerRole();
        })

        // find customer role
        .then(customerRole => {
            currentCustomerRole = customerRole;
            // reduce stock for all products. database transaction must explicitly be
            // set because a new transaction promise chain implies a new transaction
            return Bluebird.mapSeries(req.body.products, id =>
                db.Product.findById(id, { transaction: t })
                .then(product => {
                    if (product.keepStock) {
                        product.stock--;
                    }
                    return product.save({ transaction: t });
                })
            );
        })

        // calculate sum of all products
        .reduce((sum, product) =>
            (currentCustomerRole.internalSales ? product.internalPrice : product.price) + sum
        , 0)

        // store total and create transaction
        .then(total => {
            currentTotal = total;
            return db.Transaction.create({
                ...req.body,
                systemId: req.system.id,
                total
            });
        })

        // decrease customer balance
        .then(transaction => {
            currentTransaction = transaction;
            currentCustomer.balance -= currentTotal;
            if (currentCustomer.balance < 0 && currentCustomerRole.allowCredit !== true) {
                throw new ValidationError('Insufficient balance');
            }
            return currentCustomer.save();
        });
    }).then(result => {
        // entire database transaction OK, return newly created transaction
        res.status(201).json(currentTransaction);
    }).catch(Sequelize.ValidationError, err => {
        throw new ModelValidationError(err);
    }).catch(err => {
        if (err.parent) {
            return err.parent.code === SERIALIZATION_FAILURE;
        }
        return false;
    }, err => {
        throw new ConflictError(err);
    })
    .catch(next);
}
