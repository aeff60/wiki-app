export async function up(knex) {
  await knex.schema.createTable('categories', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('space_id').notNullable().references('id').inTable('spaces').onDelete('CASCADE');
    t.text('name').notNullable();
    t.text('slug').notNullable();
    t.unique(['space_id', 'slug']);
  });

  await knex.schema.createTable('page_categories', (t) => {
    t.uuid('page_id').notNullable().references('id').inTable('pages').onDelete('CASCADE');
    t.uuid('category_id').notNullable().references('id').inTable('categories').onDelete('CASCADE');
    t.primary(['page_id', 'category_id']);
  });
}

export async function down(knex) {
  await knex.schema.dropTable('page_categories');
  await knex.schema.dropTable('categories');
}
