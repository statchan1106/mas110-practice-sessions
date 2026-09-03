const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true';

export function sitePath(path: string) {
  if (!path.startsWith('/')) return path;
  if (path === '/') return `${basePath}/`;
  return `${basePath}${path}${isStaticExport ? '.html' : ''}`;
}
