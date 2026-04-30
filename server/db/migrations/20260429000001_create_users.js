export async function up(knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
  await knex.schema.createTable('users', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.text('email').notNullable().unique();
    t.text('password_hash').notNullable();
    t.text('name').notNullable();
    t.enu('role', ['admin', 'editor', 'viewer']).notNullable().defaultTo('viewer');
    t.text('avatar_url');
    t.boolean('is_active').notNullable().defaultTo(true);
    t.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTable('users');
}
