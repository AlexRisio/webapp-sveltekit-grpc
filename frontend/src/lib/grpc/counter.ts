import pkg from '@improbable-eng/grpc-web';
const { grpc } = pkg;
import * as grpcWeb from 'grpc-web';
import protobuf from 'google-protobuf';

export class IncrementRequest extends protobuf.Message {
    constructor() {
        super();
    }

    serializeBinary(): Uint8Array {
        const writer = new protobuf.BinaryWriter();
        return writer.getResultBuffer();
    }

    static deserializeBinary(bytes: Uint8Array): IncrementRequest {
        const reader = new protobuf.BinaryReader(bytes);
        const msg = new IncrementRequest();
        return msg;
    }
}

export class IncrementResponse extends protobuf.Message {
    private value: number = 0;

    getValue(): number {
        return this.value;
    }

    setValue(value: number): void {
        this.value = value;
    }

    serializeBinary(): Uint8Array {
        const writer = new protobuf.BinaryWriter();
        const value = this.getValue();
        if (value !== 0) {
            writer.writeInt64(1, value);
        }
        return writer.getResultBuffer();
    }

    static deserializeBinary(bytes: Uint8Array): IncrementResponse {
        const reader = new protobuf.BinaryReader(bytes);
        const msg = new IncrementResponse();
        while (reader.nextField()) {
            if (reader.isEndGroup()) break;
            const field = reader.getFieldNumber();
            if (field === 1) {
                msg.setValue(reader.readInt64());
            } else {
                reader.skipField();
            }
        }
        return msg;
    }
}

export const methodDescriptor = {
    methodName: 'Increment',
    service: { serviceName: 'counter.Counter' },
    requestStream: false,
    responseStream: false,
    requestType: IncrementRequest,
    responseType: IncrementResponse,
    requestSerialize: (request: IncrementRequest) => request.serializeBinary(),
    responseDeserialize: IncrementResponse.deserializeBinary
};