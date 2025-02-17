import pkg from '@improbable-eng/grpc-web';
const { grpc } = pkg;
import { IncrementRequest, IncrementResponse, methodDescriptor } from '$lib/grpc/counter';

export class GrpcWebImpl {
    private host: string;
    private options: any;

    constructor(host: string, options: any) {
        this.host = host;
        this.options = {
            ...options,
            debug: true
        };
    }

    unary(
        request: IncrementRequest,
        metadata: pkg.grpc.Metadata | undefined,
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            grpc.unary(methodDescriptor, {
                request,
                host: this.host,
                metadata: metadata,
                ...this.options,
                onEnd: (response) => {
                    if (response.status === grpc.Code.OK && response.message) {
                        resolve(IncrementResponse.deserializeBinary(response.message as Uint8Array));
                    } else {
                        const error = new Error(response.statusMessage || 'Unknown gRPC error');
                        console.error('gRPC error details:', {
                            status: response.status,
                            statusMessage: response.statusMessage,
                            headers: response.headers,
                            message: response.message,
                            trailers: response.trailers
                        });
                        reject(error);
                    }
                },
            });
        });
    }
}

export class CounterClient {
    private rpc: GrpcWebImpl;

    constructor(rpc: GrpcWebImpl) {
        this.rpc = rpc;
    }

    increment(request: IncrementRequest, callback: (error: any, response: IncrementResponse | null) => void): void {
        this.rpc.unary(request, undefined)
            .then(response => callback(null, response))
            .catch(error => {
                console.error('Counter increment error:', error);
                callback(error, null);
            });
    }
}

interface UnaryMethodDefinitionish {
    methodName: string;
    service: string;
    requestStream: boolean;
    responseStream: boolean;
}