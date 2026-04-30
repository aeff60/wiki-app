export async function seed(knex) {
  await knex('spaces').del();

  const admin = await knex('users').where({ email: 'admin@wiki.local' }).first();

  await knex('spaces').insert([
    {
      name: 'Engineering',
      slug: 'engineering',
      description: 'Technical documentation, architecture decisions, and runbooks.',
      is_public: false,
      created_by: admin.id,
    },
    {
      name: 'Company Handbook',
      slug: 'handbook',
      description: 'Policies, processes, and onboarding guides.',
      is_public: true,
      created_by: admin.id,
    },
  ]);
}
