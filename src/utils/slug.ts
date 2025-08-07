export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFD') // Normalize to separate accents
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

export const createUniqueSlug = (title: string, existingSlugs: string[] = []): string => {
  const baseSlug = generateSlug(title);
  let finalSlug = baseSlug;
  let counter = 1;

  // If slug already exists, add a number suffix
  while (existingSlugs.includes(finalSlug)) {
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return finalSlug;
};