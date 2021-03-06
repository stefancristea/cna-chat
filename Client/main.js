const {app, BrowserWindow, ipcMain } = require('electron')
const service = require('./proto/chat_grpc_pb')
const chat = require('./proto/chat_pb')
const grpc = require('grpc')


const onReady = () =>
{
  const client = new service.ChatServiceClient('0.0.0.0:8999', grpc.credentials.createInsecure());
  const win = new BrowserWindow( { width: 1280, height: 720, resizable: false, webPreferences: { nodeIntegration: true, contextIsolation: false } });

  win.removeMenu();
  win.webContents.openDevTools({ mode: "detach" });

  win.loadFile('./html/index.html');

  const clientRequest = client.chatRequest();

  clientRequest.on('data', (serverRequest) =>
  {
    win.webContents.executeJavaScript(`onServerResponse('${JSON.stringify({ type: serverRequest.getType(), content: serverRequest.getContent(), sender: serverRequest.getSender()})}');`);
  });

  clientRequest.on('error', (error) =>
  {
    if (error.code == 6)
      win.webContents.executeJavaScript(`alert("${error.details}");`);
  });

  ipcMain.handle('onLogin', (_, userName) =>
  {
    const loginMessage = new chat.ClientRequest();

    loginMessage.setType(chat.ClientRequest.RequestType.CONNECT);
    loginMessage.setContent(userName);

    clientRequest.write(loginMessage);
  });

  ipcMain.handle('sendMessage', (_, messageText) =>
  {
      const messageRequest = new chat.ClientRequest();

      messageRequest.setType(chat.ClientRequest.RequestType.MESSAGE);
      messageRequest.setContent(messageText);

      clientRequest.write(messageRequest);
  });

}


app.on('ready', onReady);
