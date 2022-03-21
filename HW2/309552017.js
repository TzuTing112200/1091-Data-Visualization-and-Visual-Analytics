(function (d3) {
  'use strict';

  const svg = d3.select('svg');

  const width = +svg.attr('width');
  const height = +svg.attr('height');
    
  const margin = { top: 30, right: 10, bottom: 10, left: 10 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  var x = d3.scale.ordinal().rangePoints([0, innerWidth], 1);
  var line = d3.svg.line();
  var axis = d3.svg.axis().orient("left");

  var y = {};
  var dragging = {};
  
  var edge;
  var dimensions;
  
  d3.csv("http://vis.lab.djosix.com:2020/data/iris.csv", function(error, data) {
    
    const g = svg.append('g');
    
    x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
      y[d] = d3.scale.linear()
            	 .domain([0,8])
            	 .range([innerHeight, margin.top]);
      return d != "class";
    }));
    
    
    g.append("g")
     .attr("class", "edge")
  	 .selectAll("path")
     .data(data)
  	 .enter().append("path")
     .filter(function(data) {
       return data['class'] == 'Iris-setosa';
     })
     .attr("d", path)
     .attr('class', 'red')
    
    g.append("g")
     .attr("class", "edge")
  	 .selectAll("path")
     .data(data)
  	 .enter().append("path")
     .filter(function(data) {
       return data['class'] == 'Iris-versicolor';
     })
     .attr("d", path)
     .attr('class', 'green')
    
    g.append("g")
     .attr("class", "edge")
  	 .selectAll("path")
     .data(data)
  	 .enter().append("path")
     .filter(function(data) {
       return data['class'] == 'Iris-virginica';
     })
     .attr("d", path)
     .attr('class', 'blue')
		
    edge = g.selectAll("path");
    
    
    
    var dimension = g.selectAll(".dimension")
      .data(dimensions)
      .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
      .call(d3.behavior.drag()
        .origin(function(d) { return {x: x(d)}; })
        .on("dragstart", function(d) {
          dragging[d] = x(d);
        })
        .on("drag", function(d) {
          dragging[d] = Math.min(innerWidth, Math.max(0, d3.event.x));
          edge.attr("d", path);
          dimensions.sort(function(a, b) { return position(a) - position(b); });
          x.domain(dimensions);
          dimension.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
        })
        .on("dragend", function(d) {
          delete dragging[d];
          transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
          transition(edge).attr("d", path);
        })
      );
    
    dimension.append("g")
      .attr("class", "axis")
      .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
      .append("text")
      .attr("class", "title")
      .attr("y", 20)
      .text(function(d) { return d; });
  });
    
  function position(d) {
    var v = dragging[d];
    return v == null ? x(d) : v;
  }

  function transition(g) {
    return g.transition().duration(100);
  }

  function path(d) {
    return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
  }

}(d3));
