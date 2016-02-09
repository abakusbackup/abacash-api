import db from '../models';
import { NotFoundError } from '../components/errors';
import _ from 'lodash';

const attributes = _.without(Object.keys(db.User.attributes), 'hash');

export function retrieve(req, res, next) {
    db.User.findOne({ where: {
        id: req.user.id
    },
        attributes
    })
    .then(user => {
        if (!user) throw new NotFoundError();
        res.json(user);
    })
    .catch(next);
}

export function update(req, res, next) {
    db.User.update(req.body, {
        where: {
            id: req.user.id
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
        id: req.user.id
    } })
    .then(count => {
        if (!count) throw new NotFoundError();
        res.status(204).send();
    })
    .catch(next);
}
