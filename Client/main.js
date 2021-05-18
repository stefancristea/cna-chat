const {app, BrowserWindow, ipcMain } = require('electron')
const service = require('./proto/chat_grpc_pb')
const chat = require('./proto/chat_pb')
const grpc = require('grpc')

const onReady = () =>
{
  const win = new BrowserWindow( { width: 800, height: 600, webPreferences: { nodeIntegration: true, contextIsolation: false } });

  win.removeMenu();
  win.webContents.openDevTools({ mode: "detach" });

  win.loadFile('./html/index.html');

  const client = new service.ChatServiceClient('0.0.0.0:8999', grpc.credentials.createInsecure());
  const clientRequest = client.chatRequest();

  ipcMain.handle('onLogin', (_event, userName) =>
  {
    const loginMessage = new chat.ClientRequest();

    loginMessage.setType(chat.ClientRequest.RequestType.CONNECT);
    loginMessage.setContent(userName);

    clientRequest.write(loginMessage);
  });

  clientRequest.on('data', (serverRequest) =>
  {
    win.webContents.executeJavaScript(`onServerResponse('${JSON.stringify({ type: serverRequest.getType(), content: serverRequest.getContent(), sender: serverRequest.getSender()})}');`);
  });

  clientRequest.on('error', (error) =>
  {
    console.log('error');
  });

}

app.on('ready', onReady);
