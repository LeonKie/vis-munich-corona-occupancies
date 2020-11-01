
let getDaysArray = function(start, end) {
    for(var arr=[],dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt));
    }
    return arr;
}

const url = "https:raw.githubusercontent.com/zepatrik/munich-corona-occupancies/main/data"

function getPaths(location,startDate,endDate){
    const days=getDaysArray(startDate,endDate)
    const paths = days.map((day) => (day.toISOString().split("T")[0]+".json")).map(day=>([url,location,day].join("/")))
    return paths
}

export async function getData(){
    const paths=getPaths("bwo",new Date("10-27-2020"),new Date())
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




