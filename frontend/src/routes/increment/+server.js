// @ts-ignore
import { CounterClient } from '$lib/generated/counter_pb.js';  // Correct import for the client
// @ts-ignore
import { ConnectError } from '@bufbuild/connect';

// Create an instance of the CounterClient pointing to the Go server.
const client = new CounterClient('http://localhost:50051');

export async function GET() {
    try {
        // Create IncrementRequest and call the increment method
        const req = new proto.counter.IncrementRequest();  // Create the request
        const res = await client.increment(req);  // Call increment on the client
        return new Response(JSON.stringify({ value: res.getValue() }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (e) {
        if (e instanceof ConnectError) {
            // @ts-ignore
            return new Response(JSON.stringify({ error: e.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        throw e;
    }
}
