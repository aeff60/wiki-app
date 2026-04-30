export async function up(knex) {
  await knex.schema.createTable('spaces', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.text('name').notNullable();
    t.text('slug').notNullable().unique();
    t.text('description');
    t.boolean('is_public').notNullable().defaultTo(false);
    t.uuid('created_by').notNullable().references('id').inTable('users').onDelete('SET NULL');
    t.timestamps(true, true);
  });
  await knex.raw('CREATE INDEX idx_spaces_slug ON spaces(slug)');
  await knex.raw('CREATE INDEX idx_spaces_created_by ON spaces(created_by)');
}

export async function down(knex) {
  await knex.schema.dropTable('spaces');
}
