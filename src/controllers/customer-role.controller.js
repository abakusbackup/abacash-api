import _ from 'lodash';
import db from '../models';
import Promise from 'bluebird';
import { NotFoundError } from '../components/errors';

export function list(req, res, next) {
  db.CustomerRole.findAll()
    .map(role =>
      Promise.all([role.countCustomers(), role.toJSON()]).spread(
        (customerCount, customerRole) => ({ ...customerRole, customerCount })
      )
    )
    .then(res.json.bind(res))
    .catch(next);
}

export function create(req, res, next) {
  db.CustomerRole.create({
    ...req.body
  })
    .then(role => {
      res.status(201).json(role);
    })
    .catch(next);
}

export function update(req, res, next) {
  const { id } = req.params;
  db.CustomerRole.update(req.body, {
    where: { id },
    returning: true,
    fields: _.without(Object.keys(req.body), 'id')
  })
    .spread((count, roles) => {
      if (!count) throw new NotFoundError();
      res.json(roles[0]);
    })
    .catch(next);
}

export function destroy(req, res, next) {
  const { id } = req.params;
  db.CustomerRole.destroy({
    where: { id }
  })
    .then(count => {
      if (!count) throw new NotFoundError();
      res.status(204).send();
    })
    .catch(next);
}
