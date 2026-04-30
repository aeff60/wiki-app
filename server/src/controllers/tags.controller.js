import * as tagsService from '../services/tags.service.js';

export async function listTags(req, res, next) {
  try {
    const tags = await tagsService.listTags();
    res.json(tags);
  } catch (err) {
    next(err);
  }
}

export async function createTag(req, res, next) {
  try {
    const tag = await tagsService.createTag(req.body.name);
    res.status(201).json(tag);
  } catch (err) {
    next(err);
  }
}
