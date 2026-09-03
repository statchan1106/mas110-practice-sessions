const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');
const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true';

export function sitePath(path: string) {
  if (!path.startsWith('/')) return path;

  const [, pathname = '/', suffix = ''] = path.match(/^([^?#]*)(.*)$/) ?? [];
  if (pathname === '/') return `${basePath}/${suffix}`;

  return `${basePath}${pathname}${isStaticExport ? '.html' : ''}${suffix}`;
}
