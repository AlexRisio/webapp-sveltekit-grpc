import pkg from '@improbable-eng/grpc-web';
const { grpc } = pkg;
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport';
import { IncrementRequest, IncrementResponse } from '$lib/grpc/counter';

// Define the method descriptor with explicit false values for requestStream and responseStream
const methodDescriptor = {
    methodName: 'Increment',
    service: { serviceName: 'counter.Counter' },
    requestStream: false as const,
    responseStream: false as const,
    requestType: IncrementRequest,
    responseType: IncrementResponse,
    requestSerialize: (request: IncrementRequest) => request.serializeBinary(),
    responseDeserialize: (bytes: Uint8Array) => IncrementResponse.deserializeBinary(bytes),
};

// Set the transport for server-side
grpc.setDefaultTransport(NodeHttpTransport());

const client = {
    increment: () => {
        return new Promise((resolve, reject) => {
            const request = new IncrementRequest();
            console.log('Sending increment request...');
            
            grpc.unary(methodDescriptor, {
                request: request,
                host: "http://localhost:8080",
                transport: NodeHttpTransport(),
                debug: true,
                onEnd: (response) => {
                    console.log('Received response:', response);
                    if (response.status === grpc.Code.OK && response.message) {
                        resolve(response.message.toObject());
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