export async function up(knex) {
  await knex.schema.createTable('comments', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('page_id').notNullable().references('id').inTable('pages').onDelete('CASCADE');
    t.uuid('author_id').notNullable().references('id').inTable('users');
    t.text('content').notNullable();
    t.uuid('parent_id').references('id').inTable('comments').onDelete('CASCADE');
    t.boolean('is_deleted').notNullable().defaultTo(false);
    t.timestamps(true, true);
  });
  await knex.raw('CREATE INDEX idx_comments_page_id ON comments(page_id)');
}

export async function down(knex) {
  await knex.schema.dropTable('comments');
}
