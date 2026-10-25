// Format text consistently, including incomplete API responses.
export function joinText(...parts: unknown[]): string {
 return parts.map(part => part ?? '').join('');
}
