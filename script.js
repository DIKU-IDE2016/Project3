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

// inspiration: https://bl.ocks.org/d3noob/43a860bc0024792f8803bba8ca0d5ecd

d3.json("dataset.json", function(error, treeData) {
	if (error){

		console.log(error);
	} else {
		
		/*  =====================================================================
		  	======================== Tree Visualization =========================
		  	===================================================================== */

		var margin = {top: 20, right: 120, bottom: 20, left: 120},
			width = 960 - margin.right - margin.left,
			height = 500 - margin.top - margin.bottom;
			
		var i = 0,
			duration = 750,
			root;

		var tree = d3.layout.tree()
			.size([height, width]);

		var diagonal = d3.svg.diagonal()
			.projection(function(d) { return [d.y, d.x]; });

		var svg = d3.select("#vis2_div").append("svg")
			.attr("width", width + margin.right + margin.left)
			.attr("height", height + margin.top + margin.bottom)
		  .append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		root = treeData;

		root.x0 = height / 2;
		root.y0 = 0;
		  
		update(root);

		d3.select(self.frameElement).style("height", "500px");

		function update(source) {

		  // Compute the new tree layout.
		  var nodes = tree.nodes(root).reverse(),
			  links = tree.links(nodes);

		  // Normalize for fixed-depth.
		  nodes.forEach(function(d) { d.y = d.depth * 180; });

		  // Update the nodes…
		  var node = svg.selectAll("g.node")
			  .data(nodes, function(d) { return d.id || (d.id = ++i); });

		// Define 'div' for tooltips
		var div = d3.select("body")
			.append("div")  // declare the tooltip div 
			.attr("class", "tooltip")              // apply the 'tooltip' class
			.style("opacity", 0);                  // set the opacity to nil

		  // Enter any new nodes at the parent's previous position.
		  var nodeEnter = node.enter().append("g")
			  .attr("class", "node")
			  .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
			  .on("click", click);
			 // UNCOMMENT THIS FOR TOOLTIPS and remove the semicolon in line above
			// .on("mouseover", function(d) {
				
			// 	var text = "";
			// 	if (d.type ==="File") {
			// 		text += "<strong>Type: </strong>" + d.type + "<br/>";
			// 		text += "<strong>Path: </strong>" + d.path + "<br/>";
			// 		text += "<strong>Size: </strong>" + d.size + " MB<br/>";
			// 		text += "<strong>Last edited: </strong>" + d.mtime;
			// 	} else {
			// 		text += "<strong>Type: </strong>" + d.type + "<br/>";
			// 		text += "<strong>Path: </strong>" + d.path;
			// 	}
   //          div.transition()
			// 	.duration(500)	
			// 	.style("opacity", 0);
			// div.transition()
			// 	.duration(200)	
			// 	.style("opacity", 1.0);	
			// div	.html(text)	 
			// 	.style("left", (d3.event.pageX+15) + "px")			 
			// 	.style("top", (d3.event.pageY - 28) + "px");

			// })
			// .on("mouseout", function(d) {
			//   // Remove the info text on mouse out.
   //            div.transition()		
   //              .duration(500)		
   //              .style("opacity", 0);	
   // 			});


		  nodeEnter.append("circle")
			  .attr("r", 1e-6)
			  .style("fill", function(d) { return d._children ? "#fc9272" : "#fee0d2"; });

		  nodeEnter.append("text")
			  .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
			  .attr("dy", ".35em")
			  .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
			  .text(function(d) { return d.name; })
			  .style("fill-opacity", 1e-6);

		  // Transition nodes to their new position.
		  var nodeUpdate = node.transition()
			  .duration(duration)
			  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

		  nodeUpdate.select("circle")
			  .attr("r", 10)
			  .style("fill", function(d) { return d._children ? "#fc9272" : "#fee0d2"; });

		  nodeUpdate.select("text")
			  .style("fill-opacity", 1);

		  // Transition exiting nodes to the parent's new position.
		  var nodeExit = node.exit().transition()
			  .duration(duration)
			  .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
			  .remove();

		  nodeExit.select("circle")
			  .attr("r", 1e-6);

		  nodeExit.select("text")
			  .style("fill-opacity", 1e-6);

		  // Update the links…
		  var link = svg.selectAll("path.link")
			  .data(links, function(d) { return d.target.id; });

		  // Enter any new links at the parent's previous position.
		  link.enter().insert("path", "g")
			  .attr("class", "link")
			  .attr("d", function(d) {
				var o = {x: source.x0, y: source.y0};
				return diagonal({source: o, target: o});
			  });

		  // Transition links to their new position.
		  link.transition()
			  .duration(duration)
			  .attr("d", diagonal);

		  // Transition exiting nodes to the parent's new position.
		  link.exit().transition()
			  .duration(duration)
			  .attr("d", function(d) {
				var o = {x: source.x, y: source.y};
				return diagonal({source: o, target: o});
			  })
			  .remove();

		  // Stash the old positions for transition.
		  nodes.forEach(function(d) {
			d.x0 = d.x;
			d.y0 = d.y;
		  });
		}

		// Toggle children on click.
		function click(d) {
		  if (d.children) {
			d._children = d.children;
			d.children = null;
		  } else {
			d.children = d._children;
			d._children = null;
		  }
		  update(d);
		}

		/* =====================================================================
		   ===================== Network Visualization =========================
		   ===================================================================== */

		// create sample dataset
		var sample_data = [
			{"name": "Brazil", "size": 14691},
			{"name": "Argentina", "size": 9665},
			{"name": "Paraguay", "size": 3920},
			{"name": "Uruguay", "size": 1564},
			{"name": "Chile", "size": 6171},
			{"name": "Bolivia", "size": 6743},
			{"name": "Peru", "size": 5536},
			{"name": "Ecuador", "size": 2010},
			{"name": "Colombia", "size": 6004},
			{"name": "Venezuela", "size": 4993},
			{"name": "Guyana", "size": 	2462}
		]
		// create list of node positions
		var positions = [
		  {"name": "Brazil", "x": 26, "y": 10},
		  {"name": "Argentina", "x": 24, "y": 17},
		  {"name": "Paraguay", "x": 26, "y": 14},
		  {"name": "Uruguay", "x": 28, "y": 14},
		  {"name": "Chile", "x": 21, "y": 14},
		  {"name": "Bolivia", "x": 23, "y": 12},
		  {"name": "Peru", "x": 20, "y": 11},
		  {"name": "Ecuador", "x": 19, "y": 9},
		  {"name": "Colombia", "x": 21, "y": 8},
		  {"name": "Venezuela", "x": 23, "y": 6},
		  {"name": "Guyana", "x": 26, "y": 7}
		]
		// create list of node connections
		var connections = [
		  {"source": "Brazil", "target": "Argentina", "size": 1224},
		  {"source": "Brazil", "target": "Bolivia", "size": 3400},
		  {"source": "Brazil", "target": "Colombia", "size": 1643},
		  {"source": "Brazil", "target": "Guyana", "size": 1119},
		  {"source": "Brazil", "target": "Paraguay", "size": 1290},
		  {"source": "Brazil", "target": "Peru", "size": 1560},
		  {"source": "Brazil", "target": "Uruguay", "size": 985},
		  {"source": "Brazil", "target": "Venezuela", "size": 2200},
		  {"source": "Argentina", "target": "Bolivia", "size": 832},
		  {"source": "Argentina", "target": "Chile", "size": 5300},
		  {"source": "Argentina", "target": "Paraguay", "size": 5300},
		  {"source": "Argentina", "target": "Uruguay", "size": 579},
		  {"source": "Paraguay", "target": "Bolivia", "size": 750},
		  {"source": "Chile", "target": "Bolivia", "size": 861},
		  {"source": "Chile", "target": "Peru", "size": 160},
		  {"source": "Bolivia", "target": "Peru", "size": 900},
		  {"source": "Peru", "target": "Colombia", "size": 1496},
		  {"source": "Peru", "target": "Ecuador", "size": 1420},
		  {"source": "Ecuador", "target": "Colombia", "size": 590},
		  {"source": "Colombia", "target": "Venezuela", "size": 2050},
		  {"source": "Venezuela", "target": "Guyana", "size": 743}
		]
		// instantiate d3plus
		var visualization = d3plus.viz()
		  .container("#vis3_div")  // container DIV to hold the visualization
		  .width(1000)
		  .height(600)
		  .ui({"font": {"size": 8}})
		  .zoom({ "scroll" : false, "click" : false, })
		  .background("#eee")
		  .font({ "color" : "#444444"})
		  .type("network")    // visualization type
		  .data(sample_data)  // sample dataset to attach to nodes
		  .nodes(positions)   // x and y position of nodes
		  .edges(connections) // list of node connections
		  .size("size")       // key to size the nodes
		  .id("name")         // key for which our data is unique on
		  .tooltip({"title":"maaaan"})
		  .draw()             // finally, draw the visualization!
	};
});
