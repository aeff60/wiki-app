export async function up(knex) {
  await knex.schema.createTable('uploads', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.text('filename').notNullable();
    t.text('original_name').notNullable();
    t.text('mime_type').notNullable();
    t.integer('size_bytes').notNullable();
    t.text('url').notNullable();
    t.uuid('uploaded_by').notNullable().references('id').inTable('users');
    t.uuid('page_id').references('id').inTable('pages').onDelete('SET NULL');
    t.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.dropTable('uploads');
}
