
const url = "https://raw.githubusercontent.com/zepatrik/munich-corona-occupancies/main/data"

let getDaysArray = function(start, end) {
    for(var arr=[],dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt));
    }
    return arr;
}

function getPaths(location,startDate,endDate){
    const days=getDaysArray(startDate,endDate)
    const paths = days.map((day) => (day.toISOString().split("T")[0]+".json")).map(day=>([url,location,day].join("/")))
    return paths
}

export async function getData(){
    const start = new Date(new Date("10-25-2020 10:00").toLocaleString("en-us", {timeZone: "Europe/Berlin"}))
    const end = new Date(new Date())
    const paths=getPaths("bwo",start,end)
    console.log(paths)
    const output = await Promise.all(paths.map(path => {
        return fetch(path)
                .then(res => res.json())
                .then(data=> (data))
        
    }))
    const data= await output.reduce((acc,cur)=> {
        return acc.concat(cur)
    },[])
    
    //console.log(data)
    return data
}




