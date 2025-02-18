import { grpc } from '@improbable-eng/grpc-web';
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport';
import { IncrementRequest, IncrementResponse } from './grpc/counter';

const client = {
    increment: () => {
        return new Promise((resolve, reject) => {
            const request = new IncrementRequest();
            
            grpc.unary(
                {
                    methodName: 'Increment',
                    service: { serviceName: 'counter.Counter' },
                    requestStream: false,
                    responseStream: false,
                    requestType: IncrementRequest,
                    responseType: IncrementResponse,
                },
                {
                    request: request,
                    host: 'http://localhost:8080',
                    transport: NodeHttpTransport(),
                    onEnd: (response) => {
                        if (response.status === grpc.Code.OK && response.message) {
                            resolve(response.message.toObject());
                        } else {
                            reject(new Error('Failed to increment counter'));
                        }
                    }
                }
            );
        });
    }
};

export default client;