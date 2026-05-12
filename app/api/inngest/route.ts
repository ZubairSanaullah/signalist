import {serve} from 'inngest/next';
import {inngest} from '@/lib/inngest/client';
import {sendSignUpEmail} from '@/lib/inngest/functions';

let lastError: any = null;
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
    lastError = args;
    originalConsoleError(...args);
};

const handler = serve({
    client: inngest,
    functions: [sendSignUpEmail],
});

export async function GET(req: any, ctx: any) {
    lastError = null;
    const res = await handler.GET(req, ctx);
    if (res.status === 500 && lastError) {
        return new Response(JSON.stringify({ error: lastError }), { status: 500 });
    }
    return res;
}
export const POST = handler.POST;
export const PUT = handler.PUT;