import db from '../models';
import { NotFoundError, ModelValidationError } from '../components/errors';
import Sequelize from 'sequelize';

export function list(req, res, next) {
    req.system.getAPITokens()
    .then(res.json.bind(res))
    .catch(next);
}

export function create(req, res, next) {
    req.body.systemId = req.system.id;
    db.APIToken.generate(req.body)
    .then(token => res.status(201).json(token))
    .catch(Sequelize.ValidationError, err => {
        throw new ModelValidationError(err);
    })
    .catch(next);
}

export function destroy(req, res, next) {
    const { id } = req.params;
    db.APIToken.destroy({ where: { id } })
    .then(count => {
        if (!count) throw new NotFoundError();
        res.status(204).send();
    })
    .catch(next);
}
