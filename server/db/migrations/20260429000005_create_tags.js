export async function up(knex) {
  await knex.schema.createTable('tags', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.text('name').notNullable().unique();
    t.text('slug').notNullable().unique();
  });

  await knex.schema.createTable('page_tags', (t) => {
    t.uuid('page_id').notNullable().references('id').inTable('pages').onDelete('CASCADE');
    t.uuid('tag_id').notNullable().references('id').inTable('tags').onDelete('CASCADE');
    t.primary(['page_id', 'tag_id']);
  });
}

export async function down(knex) {
  await knex.schema.dropTable('page_tags');
  await knex.schema.dropTable('tags');
}
