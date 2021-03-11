import {getData} from "./readData.js"

async function loadPlot(){ 

    const start = new Date(new Date("10-27-2020 10:00").toLocaleString("en-us", {timeZone: "Europe/Berlin"}))
    const end = new Date()
    const loc="bwo"
    const datapoints=await getData(loc,start,end)


    var margin = { top: 30, right: 10, bottom: 30, left: 300 },
        width = 700 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // Percent two area charts can overlap
    var overlap = 0.6;

    var formatTime = d3.timeFormat('%I %p');

    var svg = d3.select('body').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
        .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


    const area = d3.area()
        .curve(d3.curveLinear)
        .x(d => x(d.date))
        .y0(y(0))
        .y1(d => y(d.value))

}