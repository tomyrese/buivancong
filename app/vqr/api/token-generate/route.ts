import { POST as originalPOST, GET as originalGET } from '../token_generate/route';

export async function POST(request: Request) {
  return originalPOST(request);
}

export async function GET(request: Request) {
  return originalGET(request);
}
