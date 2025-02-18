package main

import (
	"context"
	"log"
	"net"
	"sync/atomic"

	"github.com/AlexRisio/webapp-sveltekit-grpc/backend/counterpb"
	"google.golang.org/grpc"
)

var counter int64 = 0

type CounterServer struct {
	counterpb.UnimplementedCounterServer
}

func (s *CounterServer) Increment(ctx context.Context, req *counterpb.IncrementRequest) (*counterpb.IncrementResponse, error) {
	newValue := atomic.AddInt64(&counter, 1)
	return &counterpb.IncrementResponse{Value: newValue}, nil
}

func main() {
	lis, err := net.Listen("tcp", ":50052")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	counterpb.RegisterCounterServer(s, &CounterServer{})

	log.Printf("Server listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
