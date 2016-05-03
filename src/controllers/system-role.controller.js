import db from '../models';
import { NotFoundError, ValidationError } from '../components/errors';
import Sequelize from 'sequelize';
import _ from 'lodash';

export function create(req, res, next) {
    db.SystemRole.create({
        ...req.body,
        userId: req.params.id,
        systemId: req.system.id
    })
    .then(role => {
        res.status(201).json(role);
    })
    .catch(Sequelize.ValidationError, err => {
        throw new ValidationError(err);
    })
    .catch(next);
}

export function update(req, res, next) {
    db.SystemRole.update(req.body, {
        where: {
            userId: req.params.id,
            systemId: req.system.id
        },
        returning: true,
        fields: _.without(Object.keys(req.body), 'userId', 'systemId')
    })
    .spread((count, roles) => {
        res.status(201).json(roles[0]);
    })
    .catch(Sequelize.ValidationError, err => {
        throw new ValidationError(err);
    })
    .catch(next);
}

export function destroy(req, res, next) {
    db.SystemRole.destroy({ where: {
        userId: req.params.id,
        systemId: req.system.id
    } })
    .then(count => {
        if (!count) throw new NotFoundError();
        res.status(204).send();
    })
    .catch(next);
}
