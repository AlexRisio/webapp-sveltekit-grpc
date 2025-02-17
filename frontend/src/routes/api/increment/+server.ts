import client from '$lib/grpc-client';

export async function POST() {
    try {
        const value = await client.increment();
        return new Response(JSON.stringify({ value }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        console.error('Error:', e);
        return new Response(JSON.stringify({ 
            error: 'Failed to increment counter',
            details: e instanceof Error ? e.message : String(e)
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}