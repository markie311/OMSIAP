function generateInt32StringDataType(length) {

    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    let result = '';
    const charsetlength = characters.length;
  
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charsetlength));
    }
      
    return result;
  
  }
  
  module.exports =  generateInt32StringDataType;