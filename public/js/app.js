$(function(){

  var socket = io.connect('http://localhost:8080');

  // SESSION

  var me = '';

  // $ELEMENTS

  var $sendBtn = $('button#send-message');
  var $message = $('input#message');
  var $messagesList = $('article#messages-list');

  // TEMPLATES

  var messageTemplate = '<div class="card">\
   <div class="card-content {{#me}} right-align {{/me}}">\
     <span class="card-title activator grey-text text-darken-4">{{ msg }}</span>\
     {{^me}}<p><b>{{ user }}</b></p>{{/me}}\
   </div>\
  </div>';

  var connectionTemplate = '<span>User {{{ user }}} {{ type }}</span>';

  var welcomeTemplate = '<span>Hello! Your username is: <b>{{ me }}</b></span>';

  // SOCKET LISTENERS

  socket.on('connect', function connectedToApplication(data){
    console.log('connected...');
  });

  socket.on('welcome', function getWelcomeMessage(data){
    me = data.me;
    var toastHTML = Mustache.render(welcomeTemplate, {me: me});
    Materialize.toast(toastHTML, 5000);
  });

  socket.on('userConnected', function newUserConnected(data){
    console.log(data);
    data.type = 'connected';
    showConnectionNotification(data);
  });

  socket.on('userDisconnected', function userConnected(data){
    console.log(data);
    data.type = 'disconnected';
    showConnectionNotification(data);
  });

  socket.on('message', function(data) {
    if(data.user === me) data.me = true;
    var messageHTML = Mustache.render(messageTemplate, data);
    $messagesList.append(messageHTML);
    window.scrollTo(0, document.body.scrollHeight);
  });

  // MAIN METHODS

  var sendMessage = function(){
    var msg = $message.val().trim();
    if(msg){
      socket.emit('message', {msg: msg});
      $message.val('');
    }
  };

  var showConnectionNotification = function(data){
    var toastHTML = Mustache.render(connectionTemplate, data);
    Materialize.toast(toastHTML, 3000);
  };

  // EVENTS

  $sendBtn.click(sendMessage);

  $message.on('keypress', function(event){
    if(event.keyCode === 13){
      event.preventDefault();
      sendMessage();
    }
  });

});
