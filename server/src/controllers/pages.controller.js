import * as pagesService from '../services/pages.service.js';

export async function getPageTree(req, res, next) {
  try {
    const tree = await pagesService.getPageTree(req.params.spaceId);
    res.json(tree);
  } catch (err) {
    next(err);
  }
}

export async function createPage(req, res, next) {
  try {
    const page = await pagesService.createPage(req.params.spaceId, req.user.id, req.body);
    res.status(201).json(page);
  } catch (err) {
    next(err);
  }
}

export async function getPage(req, res, next) {
  try {
    const page = await pagesService.getPage(req.params.spaceId, req.params.pageId);
    res.json(page);
  } catch (err) {
    next(err);
  }
}

export async function updatePage(req, res, next) {
  try {
    const page = await pagesService.updatePage(req.params.pageId, req.user.id, req.body);
    res.json(page);
  } catch (err) {
    next(err);
  }
}

export async function deletePage(req, res, next) {
  try {
    await pagesService.deletePage(req.params.pageId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function listRevisions(req, res, next) {
  try {
    const revisions = await pagesService.listRevisions(req.params.pageId);
    res.json(revisions);
  } catch (err) {
    next(err);
  }
}

export async function getRevision(req, res, next) {
  try {
    const revision = await pagesService.getRevision(req.params.revisionId);
    res.json(revision);
  } catch (err) {
    next(err);
  }
}

export async function restoreRevision(req, res, next) {
  try {
    const page = await pagesService.restoreRevision(req.params.pageId, req.params.revisionId, req.user.id);
    res.json(page);
  } catch (err) {
    next(err);
  }
}
