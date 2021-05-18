package service;

import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import logger.Logger;
import proto.Chat;
import proto.ChatServiceGrpc;

import java.util.HashMap;

public class ChatServer extends ChatServiceGrpc.ChatServiceImplBase
{

    HashMap<StreamObserver<Chat.ServerRequest>, String> m_clients = new HashMap<>();
    static final Logger m_logger = new Logger();

    @Override
    public StreamObserver<Chat.ClientRequest> chatRequest(StreamObserver<Chat.ServerRequest> responseObserver)
    {
        return new StreamObserver<Chat.ClientRequest>()
        {
            @Override
            public void onNext(Chat.ClientRequest ClientRequest)
            {
                switch(ClientRequest.getType())
                {
                    case CONNECT:
                    {
                        onConnect(ClientRequest.getContent(), responseObserver);
                        break;
                    }
                    case MESSAGE:
                    {
                        onMessage(ClientRequest.getContent(), responseObserver);
                        break;
                    }
                }
            }

            @Override
            public void onError(Throwable throwable)
            {
                onDisconnect(responseObserver);
            }

            @Override
            public void onCompleted()
            {
                onDisconnect(responseObserver);
            }
        };
    }

    private void onConnect(String username, StreamObserver<Chat.ServerRequest> observer)
    {
        if (m_clients.containsValue(username))
        {
            observer.onError(Status.ALREADY_EXISTS.
                    withDescription("There's already someone connect with this name.").
                    asRuntimeException());

            return;
        }

        for(String name : m_clients.values())
        {
            Chat.ServerRequest response = Chat.ServerRequest.newBuilder()
                    .setType(Chat.ServerRequest.ResponseType.ADD_USER)
                    .setContent(name)
                    .build();

            observer.onNext(response);
        }

        m_clients.put(observer, username);

        Chat.ServerRequest response = Chat.ServerRequest.newBuilder()
                .setType(Chat.ServerRequest.ResponseType.ADD_USER)
                .setContent(username)
                .build();

        m_clients.entrySet().stream().forEach(client -> client.getKey().onNext(response));

        System.out.println("[JOIN] " + username + " connected.");
        m_logger.Write(username + " connected.");
    }

    private void onDisconnect(StreamObserver<Chat.ServerRequest> observer)
    {
        if (m_clients.containsKey(observer))
        {
            String username = m_clients.get(observer);
            m_clients.remove(observer);

            Chat.ServerRequest response = Chat.ServerRequest.newBuilder()
                    .setType(Chat.ServerRequest.ResponseType.REMOVE_USER)
                    .setContent(username)
                    .build();

            m_clients.entrySet().stream().forEach(client -> client.getKey().onNext(response));

            System.out.println("[LEAVE] " + username + " disconnected.");
            m_logger.Write(username + " disconnected.");
        }
    }

    private void onMessage(String message, StreamObserver<Chat.ServerRequest> observer)
    {
        final String sender_name = m_clients.get(observer);

        if (sender_name == null)
            return;

        Chat.ServerRequest response = Chat.ServerRequest.newBuilder()
                .setType(Chat.ServerRequest.ResponseType.MESSAGE)
                .setContent(message)
                .setSender(sender_name)
                .build();

        m_clients.entrySet().stream().forEach(client -> client.getKey().onNext(response));

        m_logger.Write(sender_name + ": " + message);
    }
}
