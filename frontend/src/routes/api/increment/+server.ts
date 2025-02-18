import pkg from '@improbable-eng/grpc-web';
const { grpc } = pkg;
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport';
import { IncrementRequest, IncrementResponse } from '$lib/grpc/counter';

export async function POST() {
    try {
        const request = new IncrementRequest();
        
        return new Promise((resolve, reject) => {
            grpc.unary({
                methodName: 'Increment',
                service: { serviceName: 'counter.Counter' },
                requestStream: false,
                responseStream: false,
                requestType: IncrementRequest,
                responseType: IncrementResponse,
                request: request,
                host: 'http://localhost:8080',
                transport: NodeHttpTransport(),
                onEnd: (response) => {
                    if (response.status === grpc.Code.OK && response.message) {
                        resolve(new Response(JSON.stringify({ value: response.message.toObject() }), {
                            headers: { 'Content-Type': 'application/json' }
                        }));
                    } else {
                        reject(new Error('Failed to increment counter'));
                    }
                }
            });
        });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to increment counter' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}