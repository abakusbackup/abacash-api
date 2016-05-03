import db from '../models';
import { NotFoundError } from '../components/errors';

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
