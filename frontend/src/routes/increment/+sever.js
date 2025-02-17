import { CounterClient } from 'frontend\src\generated\counter_pb.js';  // Adjust to the right path if needed
import { ConnectError } from '@bufbuild/connect';

// Create an instance of the CounterClient pointing to the Go server.
const client = new CounterClient('http://localhost:50051');

export async function GET() {
    try {
        // Call the increment method (no request body needed).
        const res = await client.increment({});
        return new Response(JSON.stringify({ value: res.value }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e) {
        if (e instanceof ConnectError) {
            return new Response(JSON.stringify({ error: e.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        throw e;
    }
}
