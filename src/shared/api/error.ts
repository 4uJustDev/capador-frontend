import axios from 'axios';

export function toErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const detail = (err.response?.data as any)?.detail;
    return detail ?? err.message;
  }
  return err instanceof Error ? err.message : 'Unknown error';
}
