export async function seed(knex) {
  await knex('page_tags').del();
  await knex('tags').del();
  await knex('pages').del();

  const admin = await knex('users').where({ email: 'admin@wiki.local' }).first();
  const engSpace = await knex('spaces').where({ slug: 'engineering' }).first();
  const hbSpace = await knex('spaces').where({ slug: 'handbook' }).first();

  const [welcome] = await knex('pages').insert({
    space_id: hbSpace.id,
    title: 'Welcome to the Wiki',
    slug: 'welcome',
    content: '# Welcome\n\nThis is your internal knowledge base. Use it to share documentation, processes, and best practices.',
    author_id: admin.id,
    is_published: true,
  }).returning('*');

  await knex('pages').insert({
    space_id: engSpace.id,
    title: 'Architecture Overview',
    slug: 'architecture-overview',
    content: '# Architecture Overview\n\nDescribe your system architecture here.\n\n## Services\n\n- API Server\n- Database\n- Frontend',
    author_id: admin.id,
    is_published: true,
  });

  await knex('page_revisions').insert({
    page_id: welcome.id,
    title: welcome.title,
    content: welcome.content,
    author_id: admin.id,
    revision_number: 1,
    change_summary: 'Initial version',
  });
}
