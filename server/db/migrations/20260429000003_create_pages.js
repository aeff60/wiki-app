export async function up(knex) {
  await knex.schema.createTable('pages', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('space_id').notNullable().references('id').inTable('spaces').onDelete('CASCADE');
    t.uuid('parent_id').references('id').inTable('pages').onDelete('SET NULL');
    t.text('title').notNullable();
    t.text('slug').notNullable();
    t.text('content').notNullable().defaultTo('');
    t.specificType('search_vector', 'tsvector');
    t.uuid('author_id').notNullable().references('id').inTable('users');
    t.boolean('is_published').notNullable().defaultTo(false);
    t.integer('view_count').notNullable().defaultTo(0);
    t.timestamps(true, true);
    t.unique(['space_id', 'slug']);
  });

  await knex.raw('CREATE INDEX idx_pages_space_id ON pages(space_id)');
  await knex.raw('CREATE INDEX idx_pages_parent_id ON pages(parent_id)');
  await knex.raw('CREATE INDEX idx_pages_author_id ON pages(author_id)');
  await knex.raw('CREATE INDEX idx_pages_search ON pages USING GIN(search_vector)');

  await knex.raw(`
    CREATE OR REPLACE FUNCTION pages_search_vector_update() RETURNS trigger AS $$
    BEGIN
      NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'B');
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await knex.raw(`
    CREATE TRIGGER pages_search_vector_trigger
    BEFORE INSERT OR UPDATE ON pages
    FOR EACH ROW EXECUTE FUNCTION pages_search_vector_update();
  `);
}

export async function down(knex) {
  await knex.raw('DROP TRIGGER IF EXISTS pages_search_vector_trigger ON pages');
  await knex.raw('DROP FUNCTION IF EXISTS pages_search_vector_update');
  await knex.schema.dropTable('pages');
}
