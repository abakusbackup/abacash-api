import db from '../models';
import _ from 'lodash';
import { NotFoundError, ValidationError, AuthenticationError } from '../components/errors';

const clean = user => _.omit(user.get({ plain: true }), 'hash');
const attributes = _.without(Object.keys(db.User.attributes), 'hash');

export function retrieve(req, res, next) {
    db.User.findOne({ where: {
        id: req.user.id
    } })
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

export function password(req, res, next) {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        const error = new ValidationError('Requires both old and new password');
        return next(error);
    }

    const throwAuthError = () => {
        throw new AuthenticationError('Invalid credentials provided');
    };

    db.User.findOne({
        where: { id: req.user.id }
    })
    .then(user => {
        if (!user) throwAuthError();
        return [user.authenticate(oldPassword), user];
    })
    .spread((valid, user) => {
        if (!valid) throwAuthError();
        return user.setPassword(newPassword);
    })
    .then(user => {
        const cleanUser = clean(user);
        res.json(cleanUser);
    })
    .catch(next);
}
