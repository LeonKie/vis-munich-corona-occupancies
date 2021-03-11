
const url = "https://raw.githubusercontent.com/zepatrik/munich-corona-occupancies/location-index/data"

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

export async function getData(loc,start,end = new Date()){
    const paths=getPaths(loc,start,end)
    console.log(paths)
    const output = await Promise.all(paths.map(path => { 
        return fetch(path)
                .then(res => res.json())
                .then(data=> (data))
                .catch(()=> [] )
    }))
    const data= await output.reduce((acc,cur)=> {
        return acc.concat(cur)
    },[])
    
    console.log(data)
    return data
}




