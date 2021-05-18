import io.grpc.Server;
import io.grpc.ServerBuilder;
import service.ChatServer;

import java.io.IOException;

public class Main
{
    public static void main(String[] args)
    {
        try
        {
            Server server = ServerBuilder.forPort(8999).addService(new ChatServer()).build();
            server.start();
            System.out.println("Server started at " + server.getPort());
            server.awaitTermination();
        }
        catch (IOException e)
        {
            System.out.println("Error: " + e);
        }
        catch (InterruptedException e)
        {
            System.out.println("Error: " + e);
        }
    }
}
