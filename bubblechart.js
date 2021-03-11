import {getData} from "./readData.js"
am4core.ready(async function() {

      $('.avatar.image')
      .popup({
        
        hoverable  : true,
      })
    ;

    $('.ui.dropdown')
      .dropdown({
        values: false
      })
    ;

    const locations_path="https://raw.githubusercontent.com/zepatrik/munich-corona-occupancies/location-index/data/locations.json"
    fetch(locations_path)
      .then(res => res.json())
      .then(data=> {

        console.log(data)
        const dropdown_elts=Object.keys(data).map(elt => {
          return {name: data[elt].name , value: elt}
          });
          console.log(dropdown_elts)
          $('.ui.dropdown')
          .dropdown({
            values: dropdown_elts,
            onChange: async function(val) {
              console.log("Value Secected:", val)
              if (val != "")
              {data = await getformatedData(val);
              chart.data = data}
            }
          })
        ;
      })


   // $('.ui.dropdown').dropdown('setting', 'onChange', function(){
      //console.log("Selected")
      //data = await getformatedData();
      //chart.data = data
    //});









    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    const hours = ["12pm","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am","12am","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"]
    

    // Data import get correctly formated Data
    async function getformatedData(location){
        const weekdays= ["Son","Mon","The","Wed","Thu","Fr","Sa"];
        const start = new Date(new Date("10-24-2020 10:00").toLocaleString("en-us", {timeZone: "Europe/Berlin"}))
        const end =new Date(new Date("11-01-2020 10:00").toLocaleString("en-us", {timeZone: "Europe/Berlin"}))
        const loc=location

        
        const datapoints=await getData(loc,start,end)
        //console.log(datapoints)
        //format Data to correct object
        const data_percent=datapoints.map(elt=>{
            return {x: new Date(elt.timestamp), y: elt.percent}
        })
    
        const data_queue=datapoints.map(elt=>{
            return {x: new Date(elt.timestamp), y: elt.queue==0 ? 0 : elt.queue }
        })
        

        const data_bubble=data_percent.map(elt=>{
            return {hour: hours[elt.x.getHours()] , weekday: weekdays[elt.x.getDay()], value: elt.y }
        });

        const data= []
        
        weekdays.push(weekdays.shift())

        weekdays.forEach(w => {

            const data_day_filered = data_bubble.filter( elt=> elt.weekday == w )
            hours.forEach( h=>{

                const result =data_day_filered.filter(elt=> elt.hour == h)
                //console.log(result)
                if (result.length > 0)
                {
                    data.push({hour: h, weekday: w, value: result.reduce( (i,a) => i + a.value , 0)/result.length })
                }

            } )
        } )

        
        console.log(data)

        return data
        };



    
    var chart = am4core.create("bubblechart", am4charts.XYChart);
    chart.maskBullets = false;
    
    var xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    var yAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    
    yAxis.dataFields.category = "weekday";
    xAxis.renderer.minGridDistance = 40;
    xAxis.dataFields.category = "hour";
    
    xAxis.renderer.grid.template.disabled = true;
    yAxis.renderer.grid.template.disabled = true;
    xAxis.renderer.axisFills.template.disabled = true;
    yAxis.renderer.axisFills.template.disabled = true;
    yAxis.renderer.ticks.template.disabled = true;
    xAxis.renderer.ticks.template.disabled = true;
    
    yAxis.renderer.inversed = true;
    
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryY = "weekday";
    
    series.dataFields.categoryX = "hour";
    series.dataFields.value = "value";
    series.columns.template.disabled = true;
    series.sequencedInterpolation = true;
    //series.defaultState.transitionDuration = 3000;
    
    var bullet = series.bullets.push(new am4core.Circle());
    bullet.tooltipText = "{weekday}, {hour}: {value.workingValue.formatNumber('#.')}%";
    bullet.strokeWidth = 3;
    bullet.stroke = am4core.color("#ffffff");
    bullet.strokeOpacity = 0;
    
    bullet.adapter.add("tooltipY", function(tooltipY, target) {
      return -target.radius + 1;
    })
    
    series.heatRules.push({
      property: "radius",
      target: bullet,
      min: 2,
      max: 40
    });

    series.heatRules.push({
        property: "fill",
        target: bullet,
        max: am4core.color("#D2222D"),
        maxValue: 99,
        minValue:80,
        min: am4core.color("#238823"),
        
    })
    
    bullet.hiddenState.properties.scale = 0.01;
    bullet.hiddenState.properties.opacity = 1;
    
    var hoverState = bullet.states.create("hover");
    hoverState.properties.strokeOpacity = 1;
    
    

    
    //console.log(data_percent)
    //console.log(data_queue)
    });