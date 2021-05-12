import {getData} from "./readData.js"
import LineChart from 'metrics-graphics'

const canvas = document.getElementById('Occ').getContext("2d");



chartIt()

async function getformatedData(start,end){

    //const week_cw =parseInt(document.getElementById("cw").innerHTML)
    //console.log("Current Week: ",week_cw)
    //n1 , n2 = getfist_last_of_week(2021,week_cw)
    console.log(n1,n2)
    const start = new Date(new Date("10-30-2020 10:00").toLocaleString("en-us", {timeZone: "Europe/Berlin"}))
    const end =new Date(new Date("11-01-2020 10:00").toLocaleString("en-us", {timeZone: "Europe/Berlin"}))
    const loc="b_ei"
    const datapoints=await getData(loc,start,end)

    //format Data to correct object
    const data_percent=datapoints.map(elt=>{
        return {x: new Date(elt.timestamp), y: elt.percent}
    })

    const data_queue=datapoints.map(elt=>{
        return {x: new Date(elt.timestamp), y: elt.queue==0 ? 0 : elt.queue }
    })

    return [data_percent,data_queue]
    };


async function chartIt() {
    
    const [data_percent,data_queue] = await getformatedData();
    console.log(data_percent)
    console.log(data_queue)
    
    const data = {
        //labels: [new Date("2015-3-15 13:3").toLocaleString(), new Date("2015-3-25 13:2").toLocaleString(), new Date("2015-4-25 14:12").toLocaleString()],
        datasets: [
            {
                label: "Occupancy",
                yAxisID: "Percent",
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                borderWidth: 2,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)",
                data: data_percent
            },
            {
                label: "Queue",
                yAxisID: "Percent",
                backgroundColor: "rgba(0,255,127,0.2)",
                borderColor: "rgba(0,255,127,1)",
                borderWidth: 2,
                hoverBackgroundColor: "rgba(0,255,127,0.4)",
                hoverBorderColor: "rgba(0,255,127,1)",
                data: data_queue
            },
        ]
    };


    var chart = await new Chart(canvas, {
        
        type: 'line',
        data: data,
        options: {
            responsive: true,
            
            scales: {
                yAxes: [{
                    id: 'Percent',
                    position: 'left',
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }
                ],
                xAxes: [{
                    type: 'time',
                    distribution: 'linear',
                    
                }]
            },
            animation: {
                duration:5000,
            },
            pan: {
              enabled: true,
              mode: "x",
              speed: 10,
              threshold: 10
            },
            zoom: {
              enabled: true,
              drag: false,
              mode: "x",
              limits: {
                max: 10,
                min: 0.5
              },
                // Minimal zoom distance required before actually applying zoom
			    threshold: 2,

			    // On category scale, minimal zoom level before actually applying zoom
			    sensitivity: 3,
            }
        }
    });
    return chart  
}



new LineChart({
  data, // some array of data objects
  width: 600,
  height: 200,
  target: '#chart',
  area: true,
  xAccessor: 'date',
  yAccessor: 'value'
})