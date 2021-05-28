const ipc = require('electron').ipcRenderer;
window.$ = window.jQuery = require('jquery');

const usersList = [];

let currentUser = '';
let isLogged = false;

const onClick = () =>
{
  const userName = $("#user_name").val();

  if (userName == undefined || userName.length < 3)
  {
    return;
  }

  if (!userName.match(/^[^0-9]\w+$/))
  {
    return;
  }

  ipc.invoke('onLogin', userName);
  currentUser = userName;

};

const sendMessage = () =>
{
  const message = $("#message").val();

  if (message == undefined || message.length < 1)
    return;

  ipc.invoke('sendMessage', message);
  $("#message").val("");
};

$("#message").on('keyup', (e) =>
{
    if (e.key === 'Enter' || e.keyCode === 13)
      sendMessage();
});

const onServerResponse = (response_string) =>
{
  const response = JSON.parse(response_string);

  if (!isLogged)
  {
    isLogged = true;

    $("#login").hide();
    $("#chat").show();
  }

  switch(response.type)
  {
    case 0:
    {
      usersList.push(response.content);
      refreshUsers();
      break;
    }
    case 1:
    {
      const index = usersList.indexOf(response.content);

      if (index != -1)
        usersList.splice(index, 1);

      refreshUsers();
      break;
    }
    case 2:
    {
      const message = format_string(response.content);
      const sender = response.sender;

      if (currentUser != sender)
      {
        $("#messages").append(`<div class="incoming_msg">
          <div class="received_msg">
            <div class="received_withd_msg">
              <span class="sender_name">${sender}</span>
              <p>${message}</p>
              </div>
          </div>
        </div>`);
      }
      else
      {
        $("#messages").append(`<div class="outgoing_msg">
          <div class="sent_msg">
            <p>${message}</p>
          </div>
        </div>`);
      }

      $(".msg_history").scrollTop(document.getElementsByClassName('msg_history')[0].scrollHeight);

      break;
    }
  }

};

const refreshUsers = () =>
{
  $("#users-list").html("");

  for(user of usersList)
    $("#users-list").append(`<div class = "user">${user}</div>`);
};

const format_string = (text) =>
{

  let final = '';

  /*
    Text italic
  */

  final = text.replaceAll(/\s_(\w+)_\s/g, (_, words) => {
      return ` <i>${words}</i> `;
  });

  /*
    Text bold
  */

  final = text.replaceAll(/\s\*(\w+)\*\s/g, (_, words) => {
      return ` <b>${words}</b> `;
  });

  /*
    Text striketrough
  */

  final = text.replaceAll(/\s\~(\w+)\~\s/g, (_, words) => {
      return ` <del>${words}</del> `;
  });

  return final;
}
