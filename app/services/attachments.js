import { Readable } from 'node:stream';

export const getWebStream = async (url) => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`);
  }

  return Readable.fromWeb(response.body);
}