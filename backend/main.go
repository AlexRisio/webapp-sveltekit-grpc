package main

import (
    "context"
    "log"
    "net"
    "sync/atomic"

    "github.com/bufbuild/connect-go"
    "github.com/AlexRisio/webapp-sveltekit-grpc/backend/counterpb"
    "google.golang.org/grpc"
)

// global counter variable
var counter int64 = 0

// CounterServer implements the gRPC service.
type CounterServer struct {
    counterpb.UnimplementedCounterServer
}

// Increment increments the counter and returns the new value.
func (s *CounterServer) Increment(ctx context.Context, req *connect.Request[counterpb.IncrementRequest]) (*connect.Response[counterpb.IncrementResponse], error) {
    newValue := atomic.AddInt64(&counter, 1)
    res := &counterpb.IncrementResponse{
        Value: newValue,
    }
    return connect.NewResponse(res), nil
}

func main() {
    lis, err := net.Listen("tcp", ":50051")
    if err != nil {
        log.Fatalf("failed to listen: %v", err)
    }
    grpcServer := grpc.NewServer()
    counterpb.RegisterCounterServer(grpcServer, &CounterServer{})
    log.Println("Go gRPC server running on port 50051")
    if err := grpcServer.Serve(lis); err != nil {
        log.Fatalf("failed to serve: %v", err)
    }
}
