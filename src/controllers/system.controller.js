import _ from 'lodash';
import db from '../models';
import { NotFoundError } from '../components/errors';

export function list(req, res, next) {
    db.System.findAll()
        .then(res.json.bind(res))
        .catch(next);
}

export function retrieve(req, res, next) {
    const { id } = req.params;
    db.System.findOne({
        where: { id },
        include: [{ model: db.CustomerRole, as: 'defaultCustomerRole' }]
    })
    .then(system => {
        if (!system) throw new NotFoundError();
        res.json(system);
    })
    .catch(next);
}

export function create(req, res, next) {
    db.System.create(req.body)
    .then(system => system.get({ plain: true }))
    .then(system =>
        db.CustomerRole.create({
            ...req.body.defaultCustomerRole,
            isDefaultRole: true,
            systemId: system.id
        })
        .then(customerRole => {
            system.defaultCustomerRole = customerRole;
            res.status(201).json(system);
        })
    )
    .catch(next);
}

export function update(req, res, next) {
    const { id } = req.params;
    db.System.update(req.body, {
        where: { id },
        returning: true,
        fields: _.without(Object.keys(req.body), 'id')
    })
    .spread((count, systems) => {
        if (!count) throw new NotFoundError();
        res.json(systems[0]);
    })
    .catch(next);
}
