import {
  getData
} from "./readData.js"


const trusted_location=["b_bw_ost","b_bw_sued","b_bw_west","s_cosi","s_dante","s_micha","s_nord","s_prinz","s_sued","s_west","s_volk","s_cosima","b_forst","b_gies","b_michaeli","b_nord","b_oly","b_sued","b_volk","b_west"]


async function updateCurrentOcc(val){
  //console.log("currentloc",val)
  const laterdate = new Date();
  laterdate.setDate(laterdate.getDate()-1)
  const today_data = await getData(val,laterdate)
  //console.log("here current occ", today_data.pop().percent)
  $('#occ1').progress({
    percent: today_data.pop().percent,
    text: {
      active : 'Current Occupancy',
      success: 'Current Occupancy'
    }
  });
}





function getfist_last_of_week(year,week){
  const firstDay = new Date(year, 0, 1).getDay();
  var d = new Date("Jan 01 " + year + " 01:00:00");
  //console.log("Start Date of the Year ", d)
  var w = d.getTime() - (3600000 * 24 * (firstDay - 1 )) + 604800000 * (week)
  var n1 = new Date(w);
  var n2 = new Date(w + 518400000)
  return [n1,n2]
}


am4core.ready(async function () {

  Date.prototype.getWeekNumber = function () {
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  };


  let cw = new Date().getWeekNumber()
  let year = new Date().getFullYear()
  $('#cw').text(String(cw))

  //console.log(cw)
  let currentlySeclected = ""
  const bubble_size = Math.max(($('#bubblechart').width() - 500) / (1100 - 500) * 20 + 10, 10)
  //console.log("Widh", bubble_size)

  $('.avatar.image')
    .popup({
      hoverable: true,
    });

  $("#pre").on("click", async function () {

    //console.log("previouse Clicked")
    let cw_new = cw - 1
    if (cw_new < 1) {
      cw_new = 52
      year = year - 1
    }else if (cw_new > 52){
      cw_new = 1
      year = year + 1
    }
    cw = cw_new
    $('#cw').text(String(cw))
    
    const [s,e]=getfist_last_of_week(year,cw)
    console.log("Start,end: ", s,e,year)
    if (currentlySeclected != "") {
      const data_element = await getformatedData(currentlySeclected,s,e);
      chart.data = data_element
    }
  });


  $("#coffee").on("click", function () {
    //console.log("Test")
    window.location.href = "https://www.buymeacoffee.com/occupancy";

  });

  //$('#standard_calendar').calendar();

  $("#next").on("click", async function () {
    let cw_new = cw + 1
    if (cw_new < 1) {
      cw_new = 52
      year = year - 1
    }else if (cw_new > 52){
      cw_new = 1
      year = year + 1
    }
    cw = cw_new
    $('#cw').text(String(cw))
    const [s,e]=getfist_last_of_week(year,cw)
    //console.log("Start,end: ", s,e)
    if (currentlySeclected != "") {
      const data_element = await getformatedData(currentlySeclected,s,e);
      chart.data = data_element
    }
    //console.log("next Clicked")

  });

  $('#year-dropdown')
    .dropdown();

  const locations_path = "https://raw.githubusercontent.com/zepatrik/munich-corona-occupancies/main/data/locations.json"
  fetch(locations_path)
    .then(res => res.json())
    .then(data => {

      console.log(data)
      const dropdown_elts = Object.keys(data).map(elt => {
        const certificate= trusted_location.includes(elt) ?  '<img src="trusted-icon-3.png" alt="Trusted Data"></img>': ''
        return {
          name: data[elt].name + certificate,
          value: elt
        }
      });

      const cw = parseInt($('#cw').text())
      console.log("Current Week: ",cw)

      const [s,e]  = getfist_last_of_week(year,cw)

      //console.log(s,e)
      dropdown_elts[0].selected = true;
      //console.log("Data:", dropdown_elts[0])
      currentlySeclected = dropdown_elts[0]["value"]
      //console.log("Data:", dropdown_elts)
      $('#location-dropdown')
        .dropdown({
          values: dropdown_elts,
          selectOnBlur:false,
          onChange: async function (val) {
            console.log("Value Secected:", val)
            const cw = parseInt($('#cw').text())
            console.log("Current Week: ",cw)
            /*const laterdate = new Date();
            laterdate.setDate(laterdate.getDate()-1)
            let today_data = await getData(val,laterdate)
            console.log("here current occ", today_data.pop().percent)
            $('#occ1').progress({
              percent: today_data.pop().percent
            });*/
            await updateCurrentOcc(val)

            
            	
            $( '#vis' ).on( "mouseleave",async function(){
              await updateCurrentOcc(val)
            } );


            

            const [s,e]  = getfist_last_of_week(year,cw)

            currentlySeclected = val
            if (val != "") {
              const data_element = await getformatedData(val,s,e);
              chart.data = data_element
            }
            
            console.log("Loading Dropdown")
            console.log("Filter:",data[val])
            const setupMaps = function() {
            var setting = {
              "height": 257,
              "width": 523,
              "zoom": 17,
              "queryString": "Test",
              "place_id": "",
              "satellite": false,
              "centerCoord": [],
              "cid": data[val]["cid"],
              "lang": "de",
              "id": "map-9cd199b9cc5410cd3b1ad21cab2e54d3",
              "embed_id": "428535"
            };

            
            var d = document;
            var to = d.getElementById('map-9cd199b9cc5410cd3b1ad21cab2e54d3');
            var s = d.createElement('script');
            var header = d.getElementById('maps-header')
            header.innerHTML=data[val].name
            s.id = "maps"
            s.src = 'https://1map.com/js/script-for-user.js?embed_id=428535';
            s.async = true;
            s.onload = function (e) {
              to.innerHTML = "";
              window.OneMap.initMap(setting)
            };

            

            //to.parentNode.Child(s, to);
            console.log(s)
            console.log(to)
            
            to.appendChild(s)

            console.log(to)
          }

          setupMaps();
          }
        });
    })


  // $('.ui.dropdown').dropdown('setting', 'onChange', function(){
  //console.log("Selected")
  //data = await getformatedData();
  //chart.data = data
  //});









  // Themes begin
  am4core.useTheme(am4themes_animated);
  // Themes end
  const hours = ["12pm", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am", "12am", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm"]


  // Data import get correctly formated Data
  async function getformatedData(location,start,end) {
    const weekdays = ["Son", "Mon", "The", "Wed", "Thu", "Fr", "Sa"];
    //const start = new Date(start_date.toLocaleString("en-us", {
    //  timeZone: "Europe/Berlin"
    //}))
    //const end = new Date(end_date.toLocaleString("en-us", {
    //  timeZone: "Europe/Berlin"
    //}))
    const loc = location


    const datapoints = await getData(loc, start, end)
    //console.log(datapoints)
    //format Data to correct object
    const data_percent = datapoints.map(elt => {

      //console.log(elt)
      return {
        x: new Date(elt.timestamp.slice(0,-1)),
        y: elt.percent
      }
    })

    const data_queue = datapoints.map(elt => {
      return {
        x: new Date(elt.timestamp),
        y: elt.queue == 0 ? 0 : elt.queue
      }
    })


    const data_bubble = data_percent.map(elt => {
      return {
        hour: hours[elt.x.getHours()],
        weekday: weekdays[elt.x.getDay()],
        value: elt.y
      }
    });

    console.log(data_bubble)

    const data = []

    weekdays.push(weekdays.shift())

    weekdays.forEach(w => {

      const data_day_filered = data_bubble.filter(elt => elt.weekday == w)
      hours.forEach(h => {
        if (data_day_filered.length > 0) {
        const result = data_day_filered.filter(elt => elt.hour == h)
        //console.log(result)
        if (result.length > 0) {
          data.push({
            hour: h,
            weekday: w,
            value: result.reduce((i, a) => i + a.value, 0) / result.length
          })
        }else {
          data.push({
            hour: h,
            weekday: w,
            value: 0
          })

        }
      }

      })
    })


    //console.log(data)

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

  
  bullet.adapter.add("tooltipY", function (tooltipY, target) {
    
    $('#occ1').progress({
      percent: target.dataItem.value,
      text: {
        active : 'Selected Occupancy',
        success: 'Selected Occupancy'
      }
    });


    //console.log(target.radius)
    return -target.radius + 1;
  })


  series.heatRules.push({
    property: "radius",
    target: bullet,
    min: 2,
    max: bubble_size,
    maxValue : 100
  });

  series.heatRules.push({
    property: "fill",
    target: bullet,
    max: am4core.color("#D2222D"),
    maxValue: 99,
    minValue: 80,
    min: am4core.color("#238823"),

  })

  bullet.hiddenState.properties.scale = 0.01;
  bullet.hiddenState.properties.opacity = 1;

  var hoverState = bullet.states.create("hover");
  hoverState.properties.strokeOpacity = 1;




  //console.log(data_percent)
  //console.log(data_queue)
});