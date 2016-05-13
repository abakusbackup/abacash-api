import Sequelize from 'sequelize';
import db from '../models';
import _ from 'lodash';
import { NotFoundError, ModelValidationError } from '../components/errors';

export function list(req, res, next) {
    req.system.getProducts({
        where: req.query
    })
    .then(res.json.bind(res))
    .catch(next);
}

export function retrieve(req, res, next) {
    db.Product.findOne({
        where: {
            systemId: req.system.id,
            id: req.params.id
        }
    })
    .then(product => {
        if (!product) {
            throw new NotFoundError();
        }
        res.json(product);
    })
    .catch(next);
}

export function create(req, res, next) {
    db.Product.create({
        ...req.body,
        systemId: req.system.id
    })
    .then(product => {
        res.status(201).json(product);
    })
    .catch(Sequelize.ValidationError, err => {
        throw new ModelValidationError(err);
    })
    .catch(next);
}

export function update(req, res, next) {
    db.Product.update(req.body, {
        where: {
            id: req.params.id,
            systemId: req.system.id
        },
        returning: true,
        fields: _.without(Object.keys(req.body), 'id')
    })
    .spread((count, product) => {
        if (!count) throw new NotFoundError();
        res.json(product[0]);
    })
    .catch(next);
}

export function destroy(req, res, next) {
    db.Product.destroy({
        where: {
            systemId: req.system.id,
            id: req.params.id
        }
    })
    .then(count => {
        if (count === 0) {
            throw new NotFoundError();
        }
        res.status(204).send();
    })
    .catch(next);
}
