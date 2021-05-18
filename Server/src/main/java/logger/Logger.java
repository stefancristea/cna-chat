package logger;

import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Logger
{

    private FileWriter fileWriter = null;
    static private final DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");

    public Logger()
    {
        try
        {
            fileWriter = new FileWriter("log.txt");
            Write("Logging session started.");
        }
        catch(IOException e)
        {
            System.out.println("Exception during logger initialization " + e.getMessage());
        }
    }

    protected void finalize() throws IOException
    {
        if(fileWriter != null)
            fileWriter.close();
    }

    public void Write(String message)
    {
        try
        {
            fileWriter.write("[" + dtf.format(LocalDateTime.now()) + "] " + message + "\n");
            fileWriter.flush();
        }
        catch(IOException e)
        {
            System.out.println("Exception during logging " + e.getMessage());
        }
    }
}
