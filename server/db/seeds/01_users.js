import bcrypt from 'bcryptjs';

export async function seed(knex) {
  await knex('users').del();

  const hash = (pw) => bcrypt.hashSync(pw, 12);

  await knex('users').insert([
    {
      email: 'admin@wiki.local',
      password_hash: hash('Admin1234!'),
      name: 'Admin User',
      role: 'admin',
    },
    {
      email: 'editor@wiki.local',
      password_hash: hash('Editor1234!'),
      name: 'Editor User',
      role: 'editor',
    },
    {
      email: 'viewer@wiki.local',
      password_hash: hash('Viewer1234!'),
      name: 'Viewer User',
      role: 'viewer',
    },
  ]);
}
