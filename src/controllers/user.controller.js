import db from '../models';
import { NotFoundError, ValidationError } from '../components/errors';
import Sequelize from 'sequelize';
import _ from 'lodash';

const attributes = _.without(Object.keys(db.User.attributes), 'hash');

export function list(req, res, next) {
    db.User.findAll({
        attributes
    })
    .then(res.json.bind(res))
    .catch(next);
}

export function systems(req, res, next) {
    db.User.findOne({ where: {
        id: req.params.id
    },
        include: [{ model: db.System, as: 'systems' }]
    })
    .then(user => {
        if (!user) throw new NotFoundError();
        res.json(user.systems);
    })
    .catch(next);
}

export function retrieve(req, res, next) {
    db.User.findOne({ where: {
        id: req.params.id
    },
        attributes
    })
    .then(user => {
        if (!user) throw new NotFoundError();
        res.json(user);
    })
    .catch(next);
}

export function create(req, res, next) {
    const body = _.omit(req.body, 'password');
    const { password } = req.body;

    if (!password) {
        const error = new Error('something');
        return next(error);
    }

    const clean = user => _.omit(user.get({ plain: true }), 'hash');

    db.User.register(body, password)
    .then(user => {
        if (!req.body.systemId) {
            return res.status(201).json(clean(user));
        }

        return user.addSystem(req.body.systemId)
        // For some reason this returns an array of arrays,
        // so we'll destructure it:
        .then(([[system]]) => {
            const plain = clean(user);
            plain.role = system.role;
            res.status(201).json(plain);
        });
    })
    .catch(Sequelize.ValidationError, err => {
        throw new ValidationError(err);
    })
    .catch(next);
}

export function update(req, res, next) {
    db.User.update(req.body, {
        where: {
            id: req.params.id
        },
        returning: true,
        fields: _.without(Object.keys(req.body), 'id', 'hash')
    })
    .spread((count, user) => {
        if (!count) throw new NotFoundError();
        res.json(_.pick(user[0], attributes));
    })
    .catch(next);
}

export function destroy(req, res, next) {
    db.User.destroy({ where: {
        id: req.params.id
    } })
    .then(count => {
        if (!count) throw new NotFoundError();
        res.status(204).send();
    })
    .catch(next);
}
