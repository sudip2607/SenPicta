// Utility to create page URLs for react-router-dom
export function createPageUrl(pageName) {
  // Normalize page name to lowercase and remove spaces
  const normalized = pageName.trim().toLowerCase();
  if (normalized === 'home') return '/';
  return `/${normalized}`;
}
