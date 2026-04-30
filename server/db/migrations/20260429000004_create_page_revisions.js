export async function up(knex) {
  await knex.schema.createTable('page_revisions', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('page_id').notNullable().references('id').inTable('pages').onDelete('CASCADE');
    t.text('title').notNullable();
    t.text('content').notNullable();
    t.uuid('author_id').notNullable().references('id').inTable('users');
    t.integer('revision_number').notNullable();
    t.text('change_summary');
    t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
  await knex.raw('CREATE INDEX idx_revisions_page_id ON page_revisions(page_id)');
}

export async function down(knex) {
  await knex.schema.dropTable('page_revisions');
}
