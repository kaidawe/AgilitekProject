// it formats date as "Mar 24, 2023"
export const getDate = dt => {
    const formatedDate = new Date(dt);
    const dtOptions = {  
        year: "numeric", month: "short", day: "numeric"
    };  
    return formatedDate.toLocaleDateString('en-US', dtOptions);
};
    

// it formats time as "18:40"
export const getTime = tm => {
    const formatedTime = new Date(tm);
    const tmOptions = { hour: "2-digit", minute: "2-digit", hour12: false };
    // time is displaying 24:XX for some runs (ONLY in CHROME)
    // so, code below does not help 
    // return formatedTime.toTimeString();
    // next 4 lines is intended to fix a chrome feature that display 24:28 instead of 00:28 (as an example)
    const tempTm = formatedTime.toLocaleTimeString('en-US', tmOptions);
    const hour = tempTm.split(":");
    if (hour[0] === "24")
        return "00:" + hour[1];
    
    return tempTm;
}


// it formats Date and Time in the same string like 
export const getDateTime = dtTm => {
    const dt = new Date(dtTm)
    const dtOptions = {  
        year: "numeric", month: "short", day: "numeric"
      };  
    const tmOptions = { hour: "2-digit", minute: "2-digit", hour12: false };
    const dateToDisplay = `${dt.toLocaleDateString('en-US', dtOptions)} - ${dt.toLocaleTimeString("en-US", tmOptions)}`;
    return dateToDisplay;
}