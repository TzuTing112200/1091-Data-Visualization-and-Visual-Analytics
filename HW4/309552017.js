(function (d3, d3Force) {
  'use strict';

  // get svg -----------------------------------------------------------------------------------------------------------------------
  const svg_node_link_diagrams = d3.select('#node_link_diagrams');
  const width_node_link_diagrams = +svg_node_link_diagrams.attr('width');
  const height_node_link_diagrams = +svg_node_link_diagrams.attr('height');
  
  svg_node_link_diagrams.append('text')
	.attr('class', 'title')
	.attr('x', 15)
	.attr('y', 20)
	.attr('fill', "#F75000")
	.text('Hover the nodes/edges to highlight the corresponding nodes/edges and squares');
  svg_node_link_diagrams.append('text')
	.attr('class', 'title')
	.attr('x', 15)
	.attr('y', 38)
	.attr('fill', "#F75000")
	.text('on the other idiom. (You can use mouse to zoom in/zoom out on both svgs.)');
  

  const svg_adjacency_matrix = d3.select('#adjacency_matrix');
  const width_adjacency_matrix = +svg_adjacency_matrix.attr('width');
  const height_adjacency_matrix = +svg_adjacency_matrix.attr('height');
  
  svg_adjacency_matrix.append('text')
	.attr('class', 'title')
	.attr('x', 15)
	.attr('y', 20)
	.attr('fill', "#F75000")
	.text('Hover the squares to highlight the corresponding nodes/edges on the other idiom.');
  

  var color = ["#9467bd", "#1f77b4", "#2ca02c", "#FFD306", "#ff7f0e"];
  
  const margin = { top: 10, right: 40, bottom: 40, left: 10 };
  
  
  
  
  
  // node-link diagrams -----------------------------------------------------------------------------------------------------------------------
  const NLD = () => {
	const the_links = links.map((d) => Object.create(d));
	const the_nodes = nodes.map((d) => Object.create(d));
	
	const draggraph = (simulation) => {
	function dragstarted(event) {
	  if (!event.active) simulation.alphaTarget(0.3).restart();
	  event.subject.fx = event.subject.x;
	  event.subject.fy = event.subject.y;
	}

	function dragged(event) {
	  event.subject.fx = event.x;
	  event.subject.fy = event.y;
	}

	function dragended(event) {
	  if (!event.active) simulation.alphaTarget(0);
	  event.subject.fx = null;
	  event.subject.fy = null;
	  }

	  return d3.drag()
	    .on('start', dragstarted)
	    .on('drag', dragged)
	    .on('end', dragended);
    };
	
	const simulation = d3Force.forceSimulation(the_nodes)
      .force('link', d3Force.forceLink(the_links).id((d) => d.id))
      .force('charge', d3Force.forceManyBody())
      .force('center', d3Force.forceCenter(width_node_link_diagrams / 2, height_node_link_diagrams / 2));

    const link = svg_node_link_diagrams
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('.link')
      .data(the_links)
      .join('line')
	  .attr("class", "link")
	  .attr('lable', function(d){
          return d["source"]["index"] + " " + d["target"]["index"];
    	})
      .attr('stroke-width', 1)
      .attr('transform', `translate(${margin.left},${margin.top})`)
	  .on("mouseover", function(d,i){
		// 標記 link
		var the_link = d3.select(link.nodes()[i["index"]]);
		var the_nodes_id = the_link.attr("lable").split(' ');
	    the_link.attr('stroke', "#F75000").attr('stroke-width', 3).attr('stroke-opacity', 1);
		
		// 標記關聯的 node
	    d3.select(node.nodes()[the_nodes_id[0]]).attr('stroke', "#F75000").attr('stroke-width', 3).attr('r', 8);
	    d3.select(node.nodes()[the_nodes_id[1]]).attr('stroke', "#F75000").attr('stroke-width', 3).attr('r', 8);
		
		// 標記 square
		d3.selectAll(".cell").filter(function(dd) {
		  if(dd["x"] == the_nodes_id[0])if(dd["y"] == the_nodes_id[1]) return true;
		  if(dd["y"] == the_nodes_id[0])if(dd["x"] == the_nodes_id[1]) return true;
		  return false;
		}).attr('fill', "#F75000");
		
		// 標記關聯的 text
		d3.selectAll(".column text").filter(function(dd, ii) {
		  if(the_nodes_id[0] == ii) return true;
		  if(the_nodes_id[1] == ii) return true;
          return false;
        }).attr("fill", "#F75000").attr("font-weight", 900);
		d3.selectAll(".row text").filter(function(dd, ii) {
		  if(the_nodes_id[0] == ii) return true;
		  if(the_nodes_id[1] == ii) return true;
          return false;
        }).attr("fill", "#F75000").attr("font-weight", 900);
	  })
	  .on("mouseout", function(d, i){
		// 取消標記 link
		var the_link = d3.select(link.nodes()[i["index"]]);
		var the_nodes_id = the_link.attr("lable").split(' ');
	    the_link.attr('stroke', "#999").attr('stroke-width', 1).attr('stroke-opacity', 0.6);
		
		// 取消標記關聯的 node
	    d3.select(node.nodes()[the_nodes_id[0]]).attr('stroke', "#fff").attr('stroke-width', 1.5).attr('r', 5);
	    d3.select(node.nodes()[the_nodes_id[1]]).attr('stroke', "#fff").attr('stroke-width', 1.5).attr('r', 5);
		
		// 取消標記 square
		d3.selectAll(".cell").filter(function(dd) {
		  if(dd["x"] == the_nodes_id[0])if(dd["y"] == the_nodes_id[1]) return true;
		  if(dd["y"] == the_nodes_id[0])if(dd["x"] == the_nodes_id[1]) return true;
		  return false;
		}).attr('fill', "#000");
		
		// 取消標記關聯的 text
		d3.selectAll(".column text").filter(function(dd, ii) {
		  if(the_nodes_id[0] == ii) return true;
		  if(the_nodes_id[1] == ii) return true;
          return false;
        }).attr("fill", "#000").attr("font-weight", 500);
		d3.selectAll(".row text").filter(function(dd, ii) {
		  if(the_nodes_id[0] == ii) return true;
		  if(the_nodes_id[1] == ii) return true;
          return false;
        }).attr("fill", "#000").attr("font-weight", 500);
	  });
	  
    const node = svg_node_link_diagrams
      .append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(the_nodes)
      .join('circle')
	  .attr('lable', function(d){
          return d["id"];
    	})
      .attr('r', 5)
      .attr('fill', function(d){
          return color[d["group"]];
    	})
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .call(draggraph(simulation))
	  .on("mouseover", function(d,i){
		// 標記 node
		var the_node = d3.select(node.nodes()[i["index"]]);
		var the_node_id = the_node.attr("lable");
	    the_node.attr('stroke', "#F75000").attr('stroke-width', 3).attr('r', 8);
		
		// 標記關聯的 node
		for(var j = 0; j < 410; j++) 
		  if(matrix[the_node_id - 1][j]["z"] == 1)
 		    d3.select(node.nodes()[j]).attr('stroke', "#F75000").attr('stroke-width', 3).attr('r', 8);
		
		// 標記關聯的 link
		the_node_id --;
		d3.selectAll(link).filter(function(d) {
		  return d["source"]["index"] == the_node_id || d["target"]["index"] == the_node_id;
		}).attr('stroke', "#F75000").attr('stroke-width', 3).attr('stroke-opacity', 1);
		
		// 標記關聯的 square
		d3.selectAll(".cell").filter(function(dd) {
		  if(dd["x"] == the_node_id) return true;
		  if(dd["y"] == the_node_id) return true;
		  return false;
		}).attr('fill', "#F75000");
		
		// 標記 text
		d3.selectAll(".column text").filter(function(dd, ii) {
		  if(the_node_id == ii) return true;
          return false;
        }).attr("fill", "#F75000").attr("font-weight", 900);
		d3.selectAll(".row text").filter(function(dd, ii) {
		  if(the_node_id == ii) return true;
          return false;
        }).attr("fill", "#F75000").attr("font-weight", 900);
	  })
	  .on("mouseout", function(d, i){
		// 取消標記 node
		var the_node = d3.select(node.nodes()[i["index"]]);
		var the_node_id = the_node.attr("lable");
	    the_node.attr('stroke', "#fff").attr('stroke-width', 1.5).attr('r', 5);
		
		// 取消標記關聯的 node
		for(var j = 0; j < 410; j++) 
		  if(matrix[the_node_id - 1][j]["z"] == 1)
 		    d3.select(node.nodes()[j]).attr('stroke', "#fff").attr('stroke-width', 1.5).attr('r', 5);
		
		// 取消標記關聯的 link
		the_node_id --;
		d3.selectAll(link).filter(function(d) {
		  return d["source"]["index"] == the_node_id || d["target"]["index"] == the_node_id;
		}).attr('stroke', "#999").attr('stroke-width', 1).attr('stroke-opacity', 0.6);
		
		// 取消標記關聯的 square
		d3.selectAll(".cell").filter(function(dd) {
		  if(dd["x"] == the_node_id) return true;
		  if(dd["y"] == the_node_id) return true;
		  return false;
		}).attr('fill', "#000");
		
		// 取消標記 text
		d3.selectAll(".column text").filter(function(dd, ii) {
		  if(the_node_id == ii) return true;
          return false;
        }).attr("fill", "#000").attr("font-weight", 500);
		d3.selectAll(".row text").filter(function(dd, ii) {
		  if(the_node_id == ii) return true;
          return false;
        }).attr("fill", "#000").attr("font-weight", 500);
	  });

    svg_node_link_diagrams.call(
      d3.zoom()
        .extent([ [0, 0], [width_node_link_diagrams, height_node_link_diagrams], ])
        .scaleExtent([-4, 4])
        .on('zoom', zoomed_node_link_diagrams)
    );

    function zoomed_node_link_diagrams({ transform }) {
      link.attr('transform', transform);
      node.attr('transform', transform);
    }

    // 印資訊
    node.append('title').text((d) => d["title"]);

    link.append('title').text((d) => "Source : " + (d["source"]["index"] + 1) + ' ,  Target : ' + (d["target"]["index"] + 1));

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
    });
  }
  
  
  
  
  
  // adjacency matrix -----------------------------------------------------------------------------------------------------------------------
  const AM = () => {
	  
	const the_matrix = matrix.map((d) => Object.create(d));
	
	const g = svg_adjacency_matrix.append("g")
  	  .attr("transform", `translate(${margin.right},${margin.bottom})`);
	  
	g.append("rect")
      .attr("fill", "#F0F0F0")
      .attr("width", width_adjacency_matrix * 10  - margin.right)
      .attr("height", height_adjacency_matrix * 10 - margin.bottom);
	
	var matrixScale = d3.scaleBand().range([0, height_adjacency_matrix * 10 - margin.bottom]).domain(d3.range(matrix.length));
    var opacityScale = d3.scaleLinear().domain([0, 10]).range([0.3, 1.0]).clamp(true);
	
	var rows = g.selectAll(".row")
	  .data(matrix)
	  .enter().append("g")
	  .attr("class", "row")
	  .attr("transform", (d, i) => {
		  return "translate(0," + matrixScale(i) + ")";
	  });

    var squares = rows.selectAll(".cell")
	  .data(d => d.filter(item => item["z"] > 0 ))
	  .enter().append("rect")
	  .attr("class", "cell")
	  .attr("x", d => matrixScale(d["x"]))
	  .attr("y", d => matrixScale(d["y"]) - matrixScale(d["x"]))
	  .attr("width", matrixScale.bandwidth())
	  .attr("height", matrixScale.bandwidth())
	  .attr("fill", "#000")
	  .attr("stroke", "#fff")
	  .attr('stroke-width', 2)
	  .attr("opacity", d => d.z)
	  .on("mouseover", function(d, i){
		// 標記 square
		d3.select(this).attr('fill', "#F75000");
		
		// 標記 text
		d3.selectAll(".column text").filter(function(dd, ii) {
		  if(i["x"] == ii) return true;
          return false;
        }).attr("fill", "#F75000").attr("font-weight", 900);
		d3.selectAll(".row text").filter(function(dd, ii) {
		  if(i["y"] == ii) return true;
          return false;
        }).attr("fill", "#F75000").attr("font-weight", 900);
		
		// 標記關聯的 node
		d3.selectAll("circle").filter(function(d) {
			if(d["index"] == i["x"]) return true;
			if(d["index"] == i["y"]) return true;
			return false;
		}).attr('stroke', "#F75000").attr('stroke-width', 3).attr('r', 8);
		
		// 標記關聯的 link
		d3.selectAll(".link").filter(function(d) {
		  if(d["source"]["index"] == i["x"])if(d["target"]["index"] == i["y"]) return true;
		  if(d["source"]["index"] == i["y"])if(d["target"]["index"] == i["x"]) return true;
		  return false;
		}).attr('stroke', "#F75000").attr('stroke-width', 3).attr('stroke-opacity', 1);
	  })
	  .on("mouseout", function(d, i){
		// 取消標記 square
		d3.select(this).attr('fill', "#000");
		
		// 取消標記 text
		d3.selectAll(".column text").filter(function(dd, ii) {
		  if(i["x"] == ii) return true;
          return false;
        }).attr("fill", "#000").attr("font-weight", 500);
		d3.selectAll(".row text").filter(function(dd, ii) {
		  if(i["y"] == ii) return true;
          return false;
        }).attr("fill", "#000").attr("font-weight", 500);
		
		// 取消標記關聯的 node
		d3.selectAll("circle").filter(function(d) {
			if(d["index"] == i["x"]) return true;
			if(d["index"] == i["y"]) return true;
			return false;
		}).attr('stroke', "#fff").attr('stroke-width', 1.5).attr('r', 5);
		
		// 取消標記關聯的 link
		d3.selectAll(".link").filter(function(d) {
		  if(d["source"]["index"] == i["x"])if(d["target"]["index"] == i["y"]) return true;
		  if(d["source"]["index"] == i["y"])if(d["target"]["index"] == i["x"]) return true;
		  return false;
		}).attr('stroke', "#999").attr('stroke-width', 1).attr('stroke-opacity', 0.6);
	  });

	var columns = g.selectAll(".column")
	  .data(matrix)
	  .enter().append("g")
	  .attr("class", "column")
	  .attr("transform", (d, i) => {
		  return "translate(" + matrixScale(i) + ")rotate(-90)";
	  });

    rows.append("text")
	  .attr("class", "label")
	  .attr("x", -8)
	  .attr("y", matrixScale.bandwidth() / 2)
	  .attr("dy", ".32em")
	  .attr("text-anchor", "end")
	  .attr("font-weight", 500)
	  .style("font-size", "10px")
	  .text((d, i) => nodes[i]["id"]);

    columns.append("text")
	  .attr("class", "label")
	  .attr("x", 6)
	  .attr("y", matrixScale.bandwidth() / 2 - 6)
	  .attr("dy", ".32em")
	  .attr("text-anchor", "start")
	  .attr("font-weight", 500)
	  .style("font-size", "10px")
	  .text((d, i) => nodes[i]["id"])
      .attr("transform", "rotate(30)");

    rows.append("line")
	  .attr("stroke", "#fff")
	  .attr('stroke-width', 2)
      .attr("x2", width_adjacency_matrix * 10);

    columns.append("line")
	  .attr("stroke", "#fff")
	  .attr('stroke-width', 2)
      .attr("x1", -width_adjacency_matrix * 10);
	  
	  
	// 實做 Optimal Order of Adjacency Matrix Visualization
	function optimalOrder() {
		var init = d3.range(matrix.length);
		
		var result = new Array(410);
		var aa = new Array(410);
		var bb = new Array(410);
		
		var list = new Array(410);
		for(var i = 0; i < 410; i++)
			list[i] = {"id":i, "index":-1, "value":-1};
		
		var temp = new Array(410);
		for(var i = 0; i < 410; i++) {
			temp[i] = new Array(410);
			for(var j = 0; j < 410; j++)
				temp[i][j] = 0;
		}
		
		for(var i = 0; i < 410; i++)
		{
			for(var j = i + 1; j < 410; j++)
			{
				for (var k = 0; k < matrix.length; k++)
				{
					if (matrix[init[i]][k]['z'] == 1 && matrix[init[j]][k]['z'] == 1)
					{
						temp[i][j] ++;
						temp[j][i] ++;
					}
				}
			}
		}
		
		for (var i = 0; i < 410; i ++)
		{
			list[i]['value'] = Math.max(...temp[init[i]]);
			list[i]['index'] = temp[init[i]].indexOf(list[i]['value']);
		}
		
		for (var i = 0; i < 409; i ++)
		{
			if(list[i]['index'] == list[list[i]['index']]['index'])
				[list[list[i]['index']], list[i + 1]] = [list[i + 1], list[list[i]['index']]];
		}
		
		list.sort((a, b) => {
			return b['value'] - a['value'];
		});
		
		for (var i = 0; i < 410; i ++)
			result[i] = list[i]['id'];
		
		// for(var ii = 0; ii < 410; ii++)
		// {
			// if(temp[result[0]][result[1]] < temp[result[0]][result[2]])
				// [result[0], result[1]] = [result[1], result[0]];
			// for(var i = 1; i < 408; i++)
			// {
				// while (i < 408 && temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 2]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 2]])
				// {
					// [result[i], result[i + 1]] = [result[i + 1], result[i]];
					// i++;
				// }
				// if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 3]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 3]])
					// [result[i], result[i + 2]] = [result[i + 2], result[i]];
				// else if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 4]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 4]])
					// [result[i], result[i + 3]] = [result[i + 3], result[i]];
				// else if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 5]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 5]])
					// [result[i], result[i + 4]] = [result[i + 4], result[i]];
			// }
		// }
		
		for(var ii = 0; ii < 410; ii++)
		{
			if(temp[result[0]][result[1]] < temp[result[0]][result[2]])
				[result[0], result[1]] = [result[1], result[0]];
			for(var i = 1; i < 408; i++)
			{
				while (i < 408 && temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 2]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 2]])
				{
					[result[i], result[i + 1]] = [result[i + 1], result[i]];
					i++;
				}
				if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 3]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 3]])
					[result[i], result[i + 2]] = [result[i + 2], result[i]];
				else if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 4]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 4]])
					[result[i], result[i + 3]] = [result[i + 3], result[i]];
				else if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 5]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 5]])
					[result[i], result[i + 4]] = [result[i + 4], result[i]];
				else if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 6]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 6]])
					[result[i], result[i + 5]] = [result[i + 5], result[i]];
				else if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 7]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 7]])
					[result[i], result[i + 6]] = [result[i + 6], result[i]];
				else if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 8]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 8]])
					[result[i], result[i + 7]] = [result[i + 7], result[i]];
				else if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 9]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 9]])
					[result[i], result[i + 8]] = [result[i + 8], result[i]];
				else if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 10]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 10]])
					[result[i], result[i + 9]] = [result[i + 9], result[i]];
				else if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 11]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 11]])
					[result[i], result[i + 10]] = [result[i + 10], result[i]];
				else if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 12]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 12]])
					[result[i], result[i + 11]] = [result[i + 11], result[i]];
				else if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 13]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 13]])
					[result[i], result[i + 12]] = [result[i + 12], result[i]];
				else if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 14]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 14]])
					[result[i], result[i + 13]] = [result[i + 13], result[i]];
				else if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 15]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 15]])
					[result[i], result[i + 14]] = [result[i + 14], result[i]];
				else if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 16]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 16]])
					[result[i], result[i + 15]] = [result[i + 15], result[i]];
			}
		}
		
		for(var ii = 0; ii < 100; ii++)
		{
			if(temp[result[0]][result[1]] < temp[result[0]][result[2]])
				[result[0], result[1]] = [result[1], result[0]];
			for(var i = 1; i < 390; i++)
			{
				while (i < 408 && temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 2]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 2]])
				{
					[result[i], result[i + 1]] = [result[i + 1], result[i]];
					i++;
				}
				for (var j = 2; j < 20; j ++)
					if (temp[result[i]][result[i + j]] + 10 < temp[result[i + j]][result[i - 1]])
					{	
						[result[i], result[i + j]] = [result[i + j], result[i]];
						break;
					}
			}
		}
		
		for(var ii = 0; ii < 410; ii++)
		{
			if(temp[result[0]][result[1]] < temp[result[0]][result[2]])
				[result[0], result[1]] = [result[1], result[0]];
			for(var i = 1; i < 408; i++)
			{
				while (i < 408 && temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 2]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 2]])
				{
					[result[i], result[i + 1]] = [result[i + 1], result[i]];
					i++;
				}
				if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 3]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 3]])
					[result[i], result[i + 2]] = [result[i + 2], result[i]];
				else if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 4]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 4]])
					[result[i], result[i + 3]] = [result[i + 3], result[i]];
				else if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 5]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 5]])
					[result[i], result[i + 4]] = [result[i + 4], result[i]];
				else if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 6]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 6]])
					[result[i], result[i + 5]] = [result[i + 5], result[i]];
				else if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 7]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 7]])
					[result[i], result[i + 6]] = [result[i + 6], result[i]];
				else if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 8]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 8]])
					[result[i], result[i + 7]] = [result[i + 7], result[i]];
				else if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 9]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 9]])
					[result[i], result[i + 8]] = [result[i + 8], result[i]];
				else if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 10]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 10]])
					[result[i], result[i + 9]] = [result[i + 9], result[i]];
				else if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 11]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 11]])
					[result[i], result[i + 10]] = [result[i + 10], result[i]];
				else if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 12]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 12]])
					[result[i], result[i + 11]] = [result[i + 11], result[i]];
				else if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 13]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 13]])
					[result[i], result[i + 12]] = [result[i + 12], result[i]];
				else if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 14]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 14]])
					[result[i], result[i + 13]] = [result[i + 13], result[i]];
				else if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 15]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 15]])
					[result[i], result[i + 14]] = [result[i + 14], result[i]];
				else if (temp[result[i]][result[i + 1]] < temp[result[i]][result[i + 16]] && temp[result[i]][result[i - 1]] < temp[result[i]][result[i + 16]])
					[result[i], result[i + 15]] = [result[i + 15], result[i]];
			}
		}
				
		
		return result;
	}
	 
	// 重新排序
    var orders = {
	  id_asc: d3.range(matrix.length).sort((a, b) => {
		return d3.ascending(nodes[a]["id"], nodes[b]["id"]);
	  }),
	  id_desc: d3.range(matrix.length).sort((a, b) => {
		return d3.ascending(nodes[b]["id"], nodes[a]["id"]);
	  }),
	  num_asc: d3.range(matrix.length).sort((a, b) => {
		return num_node_links[nodes[a]["id"]] - num_node_links[nodes[b]["id"]];
	  }),
	  num_desc: d3.range(matrix.length).sort((a, b) => {
		return num_node_links[nodes[b]["id"]] - num_node_links[nodes[a]["id"]];
	  }),
	  optimal_order: optimalOrder()
    };

    d3.select("#select_order").on("change", function() {
      changeOrder(this.value);
    });
	  
    function changeOrder(value) {
	  //console.log(orders[value]);
	  matrixScale.domain(orders[value]);
	  
	  var t = g.transition().duration(2000);

	  t.selectAll(".row")
		.delay((d, i) => matrixScale(i))
		.attr("transform", function(d, i) {
		  return "translate(0," + matrixScale(i) + ")";
		})
		.selectAll(".cell")
		.delay(d => matrixScale(d["x"]))
		.attr("x", d => matrixScale(d["x"]))
		.attr("y", d => matrixScale(d["y"]) - matrixScale(d["x"]));

	  t.selectAll(".column")
		.delay((d, i) => matrixScale(i))
		.attr("transform", (d, i) => "translate(" + matrixScale(i) + ")rotate(-90)");
    }

    svg_adjacency_matrix.call(
      d3.zoom()
        .extent([ [0, 0], [width_adjacency_matrix * 10, height_adjacency_matrix * 10], ])
        .scaleExtent([-4, 4])
        .on('zoom', zoomed_adjacency_matrix)
    );

    function zoomed_adjacency_matrix({ transform }) {
      g.attr('transform', transform);
    }

    // 印資訊
    squares.append('title').text((d) => {return "x : " + (d["x"] + 1) + " ,  y : " + (d["y"] + 1);});
	
  }

  
  
  
    
  // get data -----------------------------------------------------------------------------------------------------------------------
  var interval;
  var nodes = [];
  var links = [];
  var num_node_links = new Array(411).fill(0);
  var matrix = new Array(410);
  
  for(var i = 0; i < 410; i++) {
	matrix[i] = new Array(410);
	for(var j = 0; j < 410; j++)
	  matrix[i][j] = {"x":i, "y":j, "z":0}
  }
  
  function convertRow(row) {
	var temp = row.split(' ');
	var temp_link = {};
		
	temp_link["source"] = +temp[0];
	temp_link["target"] = +temp[1];
	
	num_node_links[temp_link["source"]] += 1;
	num_node_links[temp_link["target"]] += 1;
	
	matrix[temp_link["source"] - 1][temp_link["target"] - 1]["z"] = 1;
	matrix[temp_link["target"] - 1][temp_link["source"] - 1]["z"] = 1;
	
	return temp_link;
  }
  
  d3.tsv('http://vis.lab.djosix.com:2020/data/infect-dublin.edges')
    .then(data => {
	  var first = Object.keys(Object.values(data)[0]);
	  links.push(convertRow(first[0]));
	  
	  data.forEach(d => {
	    links.push(convertRow(Object.values(d)[0]));
	  })
	  
	  links.forEach(d => {
	    d["weight"] = num_node_links[d["source"]] + num_node_links[d["target"]];
	  })
	
	  interval = Math.floor(Math.max.apply(Math, num_node_links) / 5);
 
      for(var i = 1; i <= 410; i++) nodes.push({"id":i, "group":Math.min(Math.floor(num_node_links[i]/interval), 4),
					"title":"Node ID : " + i.toString() + " ,  Number of links : " + num_node_links[i]});

	  // console.log(nodes);
	  // console.log(links);
	  // console.log(num_node_links);
	  // console.log(interval);
	  // console.log(matrix);
	  
	  NLD();
	  AM();
	});
	
}(d3, d3));