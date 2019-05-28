class SocketRouter{
  constructor(channelMap){
    this.channelMap = channelMap;
  }
  handleMessage(context, data){
    let message = JSON.parse(data);
    if(this.channelMap[message.channel] === undefined){
      logger.debug(`Got message for channel with no handler: ${message.channel}`, this.channelMap);
      return;
    }
    this.channelMap[message.channel].call(context, message.payload);
  }
}

module.exports = SocketRouter;
