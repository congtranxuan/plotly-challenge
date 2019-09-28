function buildPlots(sample) {
    /* data route */
    var url=`/samples/${sample}`;
    d3.json(url).then(function(response){
        console.log(response);
        let data = response;
        let samplevalues = data.sample_values.slice(0,10);
        let otuids = data.otu_ids.slice(0,10);
        let otulabels = data.otu_labels.slice(0,10);

        var data1 = [{ labels: otuids, 
                      values: samplevalues, 
                      type: "pie",
                      hovertext: otulabels
        }];
        console.log(data1);

    Plotly.newPlot("pie", data1);
    var hovertext = [];
    for (var i in data.otu_ids) {
      hovertext.push(`(${data.otu_ids[i]},${data.sample_values[i]})<br>${data.otu_labels[i]}`);
    };
    
    var data2 = [{ x: data.otu_ids,
                  y: data.sample_values,
                  mode: "markers",
                  text: hovertext,
                  marker: {
                    color: data.otu_ids,
                    size: data.sample_values
                  }
                }];
    console.log(data2);
    Plotly.newPlot("bubble",data2);
    });
  };


function buildMetadata(sample) {
      var url = `/metadata/${sample}`;
      d3.json(url).then(function(response) {
        var newsample = response;
        console.log(newsample);
        var metadata = d3.select("#sample-metadata").html("");
        console.log(metadata);
        Object.entries(newsample).forEach(([key,value])=>{
          metadata.append("div").append("b").text(`${key} : ${value}`);
          });

        var data = [{
          labels: [" ","0-1","1-2","2-3","3-4","4-5","5-6","6-7","7-8","8-9"],
          values: [9,1,1,1,1,1,1,1,1,1],
          type: "pie",
          //domain: {column: 0},
          hole: .45,
          rotation : 90,
          direction : "clockwise",
          textinfo : "label",
          textposition : "inside",
          hoverinfo : "none",
          //domain : {x : [0, 1], y : [0, 1]},
          marker : {colors : ["white",'rgb(238,240,214)','rgb(238,247,189)','rgb(238,247,170)', 'rgb(208,254,167)', 'rgb(178,231,168)', 'rgb(134,231,168)',"rgb(77,231,168)","rgb(31,220,101)",'rgb(41,226,96)']},
          showlegend : false
  
        }];    
          // This code is using gauge chart format.

          // var data = [
          //   {
          //     domain: { x: [0, 0.75], y: [0, 0.75] },
          //     value: newsample.WFREQ,
          //     title: { text: `<b>Belly Button Washing Frequency <br>Scrubs per Week`},
          //     type: "indicator",
          //     mode: "gauge+number",
          //     //delta: { reference: 7 },
          //     gauge: {
          //       axis: { range: [null, 9] },
          //       steps: [
          //         { range: [0, 1], color: 'rgb(238,240,214)' },
          //         { range: [1, 2], color: 'rgb(238,247,189)' },
          //         { range: [2, 3], color: 'rgb(238,247,170)' },
          //         { range: [3, 4], color: 'rgb(208,254,167)' },
          //         { range: [4, 5], color: 'rgb(178,231,168)' },
          //         { range: [5, 6], color: 'rgb(134,231,168)' },
          //         { range: [6, 7], color: 'rgb(77,231,168)' },
          //         { range: [7, 8], color: 'rgb(31,220,101)' },
          //         { range: [8, 9], color: 'rgb(41,226,96)' }
          //       ],
          //       threshold: {
          //         line: { color: "red", width: 5 },
          //         thickness: 0.75,
          //         value: 9
          //       }
          //     }
          //   }
          // ];

          //console.log(data);


          var layout = {title: `<b> Belly Button Washing Frequency <br> Scrubs per Week`, width: 600, height: 500, margin: { t: 80, b: 50 } };

          Plotly.newPlot("gauge", data, layout);  

          var pat = d3.select("#gauge").select(".trace").append("g").attr("class","slice");
                    
          var newWFREQ = +newsample.WFREQ;
          console.log(newWFREQ);
          var theta = calcAngle(newWFREQ);
          var centerX = 300;
          var centerY = 250;
          var radius = 105;
          
          console.log(pat);
          console.log(theta);

          var pointLocation = calcPosition(centerX,centerY,radius,theta);

          console.log(pointLocation);
         
          var liner = d3.line();
                    
          pat.append("path")
          .attr("d",liner(pointLocation))
          .classed("line",true)
          .attr("fill","red")
          .attr("class","surface")
          .attr("fill-opacity",1)
          .attr("stroke","red")
          .attr("stroke-width",2)
          .attr("z-index","5");


      });
      
      
      // BONUS: Build the Gauge Chart
      // buildGauge(data.WFREQ);
  }
  
  function calcAngle(decimal){
    return angle = 180 - decimal*180/9;
  };

  function calcPosition(centerX, centerY, radius, theta) {
    var coords = [];
    var wide = radius/12;
    var back = radius/8;
    var angle = [theta, theta + 90, theta + 180, theta - 90, theta];
    var rd = [radius, wide, back, wide, radius];
    
    for (var i=0;i< rd.length; i++) {

      var x = centerX + rd[i] * Math.cos(angle[i] * Math.PI/180);
      var y = centerY - rd[i] * Math.sin(angle[i] * Math.PI/180);
      coords.push([x, y]);

    };
    return coords;
  };
    
  function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0];
      buildPlots(firstSample);
      buildMetadata(firstSample);
    });
  };
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildPlots(newSample);
    buildMetadata(newSample);
  };
  
  // Initialize the dashboard
  init();