import slugifyLib from 'slugify';

export function slugify(text) {
  return slugifyLib(text, { lower: true, strict: true, trim: true });
}

export async function uniqueSlug(base, checkFn) {
  let slug = slugify(base);
  let candidate = slug;
  let n = 2;
  while (await checkFn(candidate)) {
    candidate = `${slug}-${n++}`;
  }
  return candidate;
}
