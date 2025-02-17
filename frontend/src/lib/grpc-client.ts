import pkg from '@improbable-eng/grpc-web';
const { grpc } = pkg;
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport';
import { IncrementRequest } from '$lib/grpc/counter';

// Set the transport for server-side
grpc.setDefaultTransport(NodeHttpTransport());

const client = {
    increment: () => {
        return new Promise((resolve, reject) => {
            const request = new IncrementRequest();
            
            grpc.unary({
                methodName: "/counter.Counter/Increment",
                service: { serviceName: "counter.Counter" },
                requestStream: false,
                responseStream: false,
                request: request,
                host: "http://localhost:8080",
                transport: NodeHttpTransport(),
                debug: true,
                onEnd: (response) => {
                    if (response.status === grpc.Code.OK && response.message) {
                        resolve(response.message);
                    } else {
                        console.error('gRPC error:', response);
                        reject(new Error(response.statusMessage || 'Unknown error'));
                    }
                }
            });
        });
    }
};

export default client; 