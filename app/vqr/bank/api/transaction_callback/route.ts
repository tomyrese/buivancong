import { POST as originalPOST } from '../transaction-callback/route';

export async function POST(request: Request) {
  return originalPOST(request);
}
