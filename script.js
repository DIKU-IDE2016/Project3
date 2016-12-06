function openTab(evt, cityName) {
	// Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

// Read in the data from the file called "dataset.csv"
d3.csv("dataset.csv", function(error,dataset) {
	
	if (error){

		console.log(error);
	} else {
		// initialize data storage
		var average = [];
		var spring = [];
		var summer = [];
		var autumn = [];
		var winter = [];
		
		//assign values from CSV by looping over 
		for (var i = 0; i < dataset.length; i++) {

			year = parseInt(dataset[i]["YEAR"]);

			average.push({"year":year, "temperature": parseFloat(dataset[i]["metANN"])});
			winter.push({"year":year, "temperature": parseFloat(dataset[i]["D-J-F"])});
			spring.push({"year":year, "temperature": parseFloat(dataset[i]["M-A-M"])});
			summer.push({"year":year, "temperature": parseFloat(dataset[i]["J-J-A"])});
			autumn.push({"year":year, "temperature": parseFloat(dataset[i]["S-O-N"])});
		};

		var seasonal = [];
		seasonal["spring"] = spring;
		seasonal["summer"] = summer;
		seasonal["autumn"] = autumn;
		seasonal["winter"] = winter;

		//  ====================== First Plot ========================= //

		//Firstly, we select the predefined SVG element and set its width, height and margins
		var vis1 = d3.select("#vis1ualisation1"),
	    WIDTH = 1000,
	    HEIGHT = 500,
	    MARGINS = {
	        top: 20,
	        right: 20,
	        bottom: 20,
	        left: 50
	    },
	    // here we define the ranges and domains of x and y scales
	    xScale = d3.scaleLinear()
	    			.range([MARGINS.left, WIDTH - MARGINS.right])
	    			.domain([
	    				Math.min.apply(null, average.map(function(a){return a.year;})),
	    				Math.max.apply(null, average.map(function(a){return a.year;}))
	    			]);

	    yScale = d3.scaleLinear()
	    			.range([HEIGHT - MARGINS.top, MARGINS.bottom])
	    			.domain([
	    				Math.min.apply(null, average.map(function(a){return a.temperature;})),
	    				Math.max.apply(null, average.map(function(a){return a.temperature;}))
	    			]);

	    // define the axis
	    xAxis = d3.axisBottom()
		    .scale(xScale).tickFormat(d3.format("d")),
		  
		yAxis = d3.axisLeft()
		    .scale(yScale);

		// Append both axis
		vis1.append("svg:g")
		    .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
		    .call(xAxis);

		vis1.append("svg:g")
		    .attr("transform", "translate(" + (MARGINS.left) + ",0)")
		    .call(yAxis);

		// Append axis labels
		vis1.append("text")
		    .attr("class", "x label")
		    .attr("text-anchor", "end")
		    .attr("x", WIDTH-20)
		    .attr("y", HEIGHT-25)
		    .text("Year");

		vis1.append("text")
		    .attr("class", "y label")
		    .attr("text-anchor", "end")
		    .attr("y", 65)
		    .attr("x", -20)
		    .attr("transform", "rotate(-90)")
		    .text("Temperature °C");

		// generate the actual line
		var lineGen = d3.line()
		  .x(function(d) {
		    return xScale(d.year);
		  })
		  .y(function(d) {
		    return yScale(d.temperature);
		  });

		// Add the line to SVG
		vis1.append('svg:path')
		  .attr('d', lineGen(average))
		  .attr('stroke', 'green')
		  .attr('stroke-width', 2)
		  .attr('fill', 'none');

		// ==========================================================
		// Added on mouseover event
		// Credit: https://bl.ocks.org/mbostock/3902569
		// var focus = vis1.append("g")
		//   .attr("class", "focus")
		//   .style("display", "none");

		// focus.append("circle")
		//   .attr("r", 4.5);

		// focus.append("text")
		//   .attr("x", 9)
		//   .attr("dy", ".35em");

		// vis1.append("rect")
		//   .attr("class", "overlay")
		//   .attr("width", WIDTH)
		//   .attr("height", HEIGHT)
		//   .on("mouseover", function() { focus.style("display", null); })
		//   .on("mouseout", function() { focus.style("display", "none"); })
		//   .on("mousemove", mousemove);

		// var bisectDate = d3.bisector(function(d) { return d.year; }).left;
		
		// function mousemove() {
		// 	var x0 = xScale.invert(d3.mouse(this)[0]),
		// 	    i = bisectDate(data, x0, 1),
		// 	    d0 = data[i - 1],
		// 	    d1 = data[i],
		// 	    d = x0 - d0.year > d1.year - x0 ? d1 : d0;
		// 	focus.attr("transform", "translate(" + xScale(d.year) + "," + yScale(d.temperature) + ")");
		// 	console.log("D0 temp: "+ d0.temperature+" ; year: "+ d0.year);
		// 	console.log("D1 temp: "+ d1.temperature+" ; year: "+ d1.year);
		// 	console.log("I: " + i);
		// 	focus.select("text").text(d.temperature+" °C at " + d.year);
		// };


		// ==========================================================
		//  ====================== Second Plot ========================= //

		var vis2 = d3.select("#vis1ualisation2")
						.attr("transform",
		          		  	  "translate(" + MARGINS.left + "," + MARGINS.top + ")")
						.append("g");

		var gs = [];
		for (var i = 0; i < 4; i++) {
			
		}

		var WIDTH = 900,
			HEIGHT = 200,
			MARGINS = {
		    	top: 25,
		    	right: 25,
		    	bottom: 25,
		    	left: 30
			},
			counter = 0,
			season;

		for (var key in seasonal) {

			season = seasonal[key];

			g = vis2.append("g")
					.attr("class",key)
					.attr("transform",
		          		  "translate(" + MARGINS.left + "," + (MARGINS.top+(counter*200)) + ")");

			var x = d3.scaleLinear()
		    			.range([MARGINS.left, WIDTH - MARGINS.right])
		    			.domain([
		    				Math.min.apply(null, season.map(function(a){return a.year;})),
		    				Math.max.apply(null, season.map(function(a){return a.year;}))
		    			]);

		    var y = d3.scaleLinear()
		    			.range([HEIGHT - MARGINS.top, MARGINS.bottom])
		    			.domain([
		    				Math.min.apply(null, season.map(function(a){return a.temperature;})),
		    				Math.max.apply(null, season.map(function(a){return a.temperature;}))
		    			]);

			// define the area
			var area = d3.area()
			    .x(function(d) { return x(d.year); })
			    .y0(HEIGHT - MARGINS.bottom)
			    .y1(function(d) { return y(d.temperature); });

			// define the line
			var valueline = d3.line()
			    .x(function(d) { return x(d.year); })
			    .y(function(d) { return y(d.temperature); });

			;

			// add the area
			g.append("path")
			    .data([season])
			    .attr("class", "area")
			    .attr("d", area);

			// add the valueline path.
			var lin = g.append("path")
			    	    .data([season])
 						.attr("stroke-width", 2)
 						.attr("fill", "none")
			    		.attr("d", valueline);

			if(counter == 0)
				lin.attr("stroke", "#229954");
			else if(counter == 1)
				lin.attr("stroke", "#EC7063");
			else if(counter == 2)
				lin.attr("stroke", "#F7DC6F");
			else 
				lin.attr("stroke", "#85C1E9");

			xAxis = d3.axisBottom()
			    .scale(x).tickFormat(d3.format("d")),
			  
			yAxis = d3.axisLeft()
			    .scale(y);

			g.append("svg:g")
			    .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
			    .call(xAxis);

			g.append("svg:g")
			    .attr("transform", "translate(" + (MARGINS.left) + ",0)")
			    .call(yAxis);

			    // Append axis labels
			g.append("text")
			    .attr("class", "x label")
			    .attr("text-anchor", "end")
			    .attr("x", WIDTH-35)
			    .attr("y", HEIGHT-30)
			    .text("Year");

			g.append("text")
			    .attr("class", "y label")
			    .attr("text-anchor", "end")
			    .attr("y", -15)
			    .attr("x", -20)
			    .attr("transform", "rotate(-90)")
			    .text("Temperature °C");

			vis2.append("text")
			    .attr("class", "season-title")
			    .attr("text-anchor", "end")
			    .attr("x", WIDTH+100)
			    .attr("y", 150+(counter*200))
			    .text(key);

			counter++;
		}

		var vertical = d3.select("#vis1ualisation2")
		      .append("div")
		      .attr("class", "remove")
		      .style("position", "absolute")
		      .style("z-index", "190")
		      .style("width", "10px")
		      .style("height", "380px")
		      .style("top", "10px")
		      .style("bottom", "30px")
		      .style("left", "0px")
		      .style("background", "#000");
		d3.select("#vis1ualisation2")
		    .on("mousemove", function(){  
		       mousex = d3.mouse(this);
		       mousex = mousex[0] + 5;
		       vertical.style("left", mousex + "px" )})
		    .on("mouseover", function(){  
		       mousex = d3.mouse(this);
		       mousex = mousex[0] + 5;
		       vertical.style("left", mousex + "px")});
	//  ====================== Third Plot ========================= //
		var jan = [];
		var feb = [];
		var mar = [];
		var apr = [];
		var may = [];
		var jun = [];
		var jul = [];
		var aug = [];
		var sep= [];
		var oct = [];
		var nov = [];
		var dec = [];
		//assign values from CSV by looping over 
		for (var i = 0; i < dataset.length; i++) {
			year = parseInt(dataset[i]["YEAR"]);
			// add month
			
			jan.push({"year":year, "temperature": parseFloat(dataset[i]["JAN"])});
			feb.push({"year":year, "temperature": parseFloat(dataset[i]["FEB"])});
			mar.push({"year":year, "temperature": parseFloat(dataset[i]["MAR"])});
			apr.push({"year":year, "temperature": parseFloat(dataset[i]["APR"])});
			may.push({"year":year, "temperature": parseFloat(dataset[i]["MAY"])});
			jun.push({"year":year, "temperature": parseFloat(dataset[i]["JUN"])});
			jul.push({"year":year, "temperature": parseFloat(dataset[i]["JUL"])});
			aug.push({"year":year, "temperature": parseFloat(dataset[i]["AUG"])});
			sep.push({"year":year, "temperature": parseFloat(dataset[i]["SEP"])});
			oct.push({"year":year, "temperature": parseFloat(dataset[i]["OCT"])});
			nov.push({"year":year, "temperature": parseFloat(dataset[i]["NOV"])});
			dec.push({"year":year, "temperature": parseFloat(dataset[i]["DEC"])});
		};
		var lineGen = d3.line()
			  .x(function(d) {
			    return xScale(d.year);
			  })
			  .y(function(d) {
			    return yScale(d.temperature);
			  });
		var vis3 = d3.select("#vis1ualisation3"),
	    WIDTH = 1000,
	    HEIGHT = 500,
	    MARGINS = {
	        top: 20,
	        right: 20,
	        bottom: 20,
	        left: 50
	    };
		function originalLegend(newData) {

			xScale = d3.scaleLinear()
			    		.range([MARGINS.left, WIDTH - MARGINS.right])
			    		.domain([
			    			Math.min.apply(null, newData.map(function(a){return a.year;})),
			    			Math.max.apply(null, newData.map(function(a){return a.year;}))
			    			]);

		    yScale = d3.scaleLinear()
		    			.range([HEIGHT - MARGINS.top, MARGINS.bottom])
		    			.domain([
		    				Math.min.apply(null, newData.map(function(a){return a.temperature;})),
		    				Math.max.apply(null, newData.map(function(a){return a.temperature;}))
		    			]);

		    // define the axis
		    xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d"));		  
			yAxis = d3.axisLeft().scale(yScale);

			// Append both axis
			vis3.append("svg:g")
				.attr("class", "xAxis")
			    .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
			    .call(xAxis);

			vis3.append("svg:g")
				.attr("class", "yAxis")
			    .attr("transform", "translate(" + (MARGINS.left) + ",0)")
			    .call(yAxis);

			// Append axis labels
			vis3.append("text")
			    .attr("class", "xLabel")
			    .attr("text-anchor", "end")
			    .attr("x", WIDTH-20)
			    .attr("y", HEIGHT-25)
			    .text("Year");

			vis3.append("text")
			    .attr("class", "yLabel")
			    .attr("text-anchor", "end")
			    .attr("y", 65)
			    .attr("x", -20)
			    .attr("transform", "rotate(-90)")
			    .text("Temperature °C");

			// generate the actual line
			

			vis3.append('svg:path')
			  .attr("class","line3")
			  .attr('d', lineGen(newData))
			  .attr('stroke', 'green')
			  .attr('stroke-width', 2)
			  .attr('fill', 'none');


		}
		// generate initial legend
		originalLegend(jan);
		function updateLegend(newData) {
			xScale = d3.scaleLinear()
			    		//.range([MARGINS.left, WIDTH - MARGINS.right])
			    		.domain([
			    			Math.min.apply(null, newData.map(function(a){return a.year;})),
			    			Math.max.apply(null, newData.map(function(a){return a.year;}))
			    			]);

		    yScale = d3.scaleLinear()
		    			//.range([HEIGHT - MARGINS.top, MARGINS.bottom])
		    			.domain([
		    				Math.min.apply(null, newData.map(function(a){return a.temperature;})),
		    				Math.max.apply(null, newData.map(function(a){return a.temperature;}))
		    			]);

		    // define the axis
		    xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d"));		  
			yAxis = d3.axisLeft().scale(yScale);

			// Append both axis
			var svg = d3.select("vis1ualisation3").transition();
			// Append both axis
			svg.select(".xAxis")
				.duration(500)
			    .call(xAxis);

			svg.select(".yAxis")
				.duration(500)
			    .call(yAxis);
			
			// generate the actual line

			svg.select('.line3')
			   .duration(0)
			   .attr('d', lineGen(newData));
			// vis3.append('svg:path')
			//   .attr("class","line3")
			//   .attr('d', lineGen(newData))
			//   .attr('stroke', 'green')
			//   .attr('stroke-width', 2)
			//   .attr('fill', 'none');
		}

		// handle on click event
		d3.select('#opts')
		  .on('change', function() {
		    var newData = eval(d3.select(this).property('value'));
		    updateLegend(newData);
		 });
	}
});
