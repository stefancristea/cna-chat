const ipc = require('electron').ipcRenderer;
window.$ = window.jQuery = require('jquery');

const usersList = [];
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
};

const sendMessage = () =>
{
  
};

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
      break;
    }
  }

};

const refreshUsers = () =>
{
  $("#users-list").html("");

  for(user of usersList)
    $("#users-list").append(`<li>${user}</li>`);
};