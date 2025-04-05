export const timestamp = {
   _dateobj: new Date(),

   // Utility method to pad single-digit numbers with a leading zero
   _padZero: (num) => num < 10 ? `0${num}` : `${num}`,

   // Days of the week
   _days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

   // Months of the year
   _months: ["January", "February", "March", "April", "May", "June", 
             "July", "August", "September", "October", "November", "December"],

   // Get formatted date string in "Mon. March 24, 2025 at 3:30 PM" format
   getFormattedDate: () => {
       const date = timestamp._dateobj;
       const day = timestamp._days[date.getDay()].slice(0, 3) + '.';
       const month = timestamp._months[date.getMonth()];
       const dateNum = timestamp._padZero(date.getDate());
       const year = date.getFullYear();
       
       // Handle hour and AM/PM
       let hours = date.getHours();
       const minutes = timestamp._padZero(date.getMinutes());
       const ampm = hours >= 12 ? 'PM' : 'AM';
       
       // Convert to 12-hour format
       hours = hours % 12;
       hours = hours ? hours : 12; // handle midnight (0 hours)
       
       return `${day} ${month} ${dateNum}, ${year} at ${hours}:${minutes} ${ampm}`;
   },

   // Keep other utility methods if needed
   dateNow: () => Date.now(),
   getDay: () => timestamp._days[timestamp._dateobj.getDay()],
   getMonth: () => timestamp._months[timestamp._dateobj.getMonth()],
   getDate: () => timestamp._padZero(timestamp._dateobj.getDate()),
   getFullYear: () => timestamp._dateobj.getFullYear(),
   getHour: () => timestamp._padZero(timestamp._dateobj.getHours()),
   getMinutes: () => timestamp._padZero(timestamp._dateobj.getMinutes()),
   getSeconds: () => timestamp._padZero(timestamp._dateobj.getSeconds()),
   getAnteAndPostMeridiem: () => (timestamp._dateobj.getHours() >= 12 ? 'pm' : 'am')
};