export function mediaUrl(path?: string) {
  if (!path) {
    return '/placeholder.png';
  }

  const clean = path.replace(/^\/+/, '');
  return `https://tamasaya.ru/api/project2/${clean}`;
}
