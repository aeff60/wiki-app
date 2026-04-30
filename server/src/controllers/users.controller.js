import * as usersService from '../services/users.service.js';

export async function listUsers(req, res, next) {
  try {
    const users = await usersService.listUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req, res, next) {
  try {
    const user = await usersService.updateUser(req.params.userId, req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function deactivateUser(req, res, next) {
  try {
    await usersService.deactivateUser(req.params.userId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
