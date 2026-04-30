import * as spacesService from '../services/spaces.service.js';

export async function listSpaces(req, res, next) {
  try {
    const spaces = await spacesService.listSpaces(req.user);
    res.json(spaces);
  } catch (err) {
    next(err);
  }
}

export async function createSpace(req, res, next) {
  try {
    const space = await spacesService.createSpace(req.user.id, req.body);
    res.status(201).json(space);
  } catch (err) {
    next(err);
  }
}

export async function getSpace(req, res, next) {
  try {
    const space = await spacesService.getSpace(req.params.spaceId, req.user);
    res.json(space);
  } catch (err) {
    next(err);
  }
}

export async function updateSpace(req, res, next) {
  try {
    const space = await spacesService.updateSpace(req.params.spaceId, req.body);
    res.json(space);
  } catch (err) {
    next(err);
  }
}

export async function deleteSpace(req, res, next) {
  try {
    await spacesService.deleteSpace(req.params.spaceId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
