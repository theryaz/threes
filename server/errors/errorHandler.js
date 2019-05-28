module.exports = (error, req, res , next) => {
  if(error){
    console.log("Error handled", error);
    res.status(error.status || 500).json({
        result: {
        message: error.message,
        payload: error.payload
      }
    });
    return;
  }
  next();
};
