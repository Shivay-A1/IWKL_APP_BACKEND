export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const generateUniqueSlug = async (
  text: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> => {
  let slug = generateSlug(text);
  let counter = 1;
  let originalSlug = slug;

  while (await checkExists(slug)) {
    slug = `${originalSlug}-${counter}`;
    counter++;
  }

  return slug;
};
