class SocketClient{
  constructor(address){
    this.listeners = {};
    this.address;
    this.connection = new WebSocket(address);
    this.connection.onmessage = ({data}) => {
      let message = JSON.parse(data);
      let channel = message.channel;
      let payload = message.payload;
      if(Array.isArray(this.listeners[channel])){
        for(let listener of this.listeners[channel]){
          listener.call(null, payload);
        }
      }
    };
  }

  send(channel, payload){
    this.connection.send(JSON.stringify({
      channel,
      payload
    }));
  }

  on(channel, listener){
    if(!Array.isArray(this.listeners[channel])){
      this.listeners[channel] = [];
    }
    this.listeners[channel].push(listener);
  }

}

export default new SocketClient("ws://api.local.threeswithfriends.com:4290");
