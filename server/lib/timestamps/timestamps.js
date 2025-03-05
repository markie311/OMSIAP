
module.exports = {
    dateNow: () => {
     const datenow = Date.now()
     return datenow;
    },
    getDay: () => {
     const timestamp = new Date();
     const _day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
     const _dateobj = timestamp;
     let _currentday = _day[_dateobj.getDay()];
     return _currentday;
    },
    getDate: () => {
     const timestamp = new Date();
     const _dateobj = timestamp;
     let _currentdate = _dateobj.getDate();
    
     if ( _currentdate < 10 ) {
      let _date = `0${_currentdate}`;
      return _date;
     } else {
      let _date = `${_currentdate}`;
      return _date;
     }
    },
    getMonth: () => {
     const timestamp = new Date();
     const dateObj = timestamp;
     const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
     let _currentmonth = month[dateObj.getMonth()];
     return _currentmonth;
    },
    getFullYear: () => {
     const timestamp = new Date();
     const dateObj = timestamp;
     let _currentyear = dateObj.getFullYear();
     return _currentyear
    },
    getHour: () => {
     const timestamp = new Date();
     const dateObj = timestamp;
     let _currenthour = dateObj.getHours();
     let _parsedhour = _currenthour + 1;
     if ( _parsedhour > 9) {
    //doSomethingWithHour((data)=> data = `${_parsedHour}`)
      let _hour = _parsedhour;
      return _hour;
     }
     if (  _parsedhour < 10 ) {
     //     doSomethingWithHour((data)=> data = `0${_parsedHour}`)
      let _hour =`0${_parsedhour}`;
      return _hour;
     }
    },
    getMinutes: () => {
    const timestamp = new Date();
    const dateObj = timestamp;
    let _currentminute = dateObj.getMinutes();
    
    if ( _currentminute < 10) {
     let minutes = `0${_currentminute}`;
     return minutes;
    }
    if (  _currentminute > 9 ) {
     let minutes = _currentminute;
     return minutes
    }
    },
    getSeconds: () => {
    const timestamp = new Date();
    const dateObj = timestamp;
    let _currentseconds = dateObj.getSeconds();
    
    if ( _currentseconds < 10) {
     let _seconds = `0${_currentseconds}`;
     return _seconds;
    }
    if (  _currentseconds > 9 ) {
     let _seconds = _currentseconds;
     return _seconds;
    }
    },
    getAnteAndPostMeridiem: () => {
    
      let _date = new Date();
      let _hours = _date.getHours();
      let _meridiem = _hours >= 12 ? 'PM' : 'AM';
    
      return _meridiem.toLowerCase();
    
    }
    }