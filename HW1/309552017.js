(function (d3) {
  'use strict';

  const svg = d3.select('svg');

  const width = +svg.attr('width');
  const height = +svg.attr('height');
  
  svg.append('text')
	.attr('class', 'title')
	.attr('x', 330)
	.attr('y', 100)
	.text('Loading datas ...');

  const circleRadius = 10;
  
  const render = (data, xType, yType) => {
    svg.selectAll("*").remove();
    
    const title = 'Iris: ' + xType + ' vs. ' + yType;
  
  	const xValue = d => d[xType];
    const xAxisLabel = xType;
    
  	const yValue = d => d[yType];
    const yAxisLabel = yType;
    
    const margin = { top: 60, right: 40, bottom: 88, left: 150 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, xValue))
      .range([0, innerWidth])
      .nice();
    
    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, yValue))
      .range([innerHeight, 0])
      .nice();
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const xAxis = d3.axisBottom(xScale)
      .tickSize(-innerHeight)
      .tickPadding(15);
    
    const yAxis = d3.axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickPadding(10);
    
    const yAxisG = g.append('g').call(yAxis);
    yAxisG.selectAll('.domain').remove();
    
    yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', -93)
        .attr('x', -innerHeight / 2)
        .attr('fill', 'black')
        .attr('transform', `rotate(-90)`)
        .attr('text-anchor', 'middle')
        .text(yAxisLabel);
    
    const xAxisG = g.append('g').call(xAxis)
      .attr('transform', `translate(0,${innerHeight})`);
    
    xAxisG.select('.domain').remove();
    
    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 75)
        .attr('x', innerWidth / 2)
        .attr('fill', 'black')
        .text(xAxisLabel);
    
    g.selectAll('circle').data(data).enter().
    	filter(function(data) {
        return data['class'] == 'Iris-setosa';
      }).append('circle')
        .attr('class', 'red')
        .attr('cy', d => yScale(yValue(d)))
        .attr('cx', d => xScale(xValue(d)))
        .attr('r', circleRadius);
    
    g.selectAll('circle').data(data).enter().
    	filter(function(data) {
        return data['class'] == 'Iris-versicolor';
      }).append('circle')
        .attr('class', 'green')
        .attr('cy', d => yScale(yValue(d)))
        .attr('cx', d => xScale(xValue(d)))
        .attr('r', circleRadius);
    
    g.selectAll('circle').data(data).enter().
    	filter(function(data) {
        return data['class'] == 'Iris-virginica';
      }).append('circle')
        .attr('class', 'blue')
        .attr('cy', d => yScale(yValue(d)))
        .attr('cx', d => xScale(xValue(d)))
        .attr('r', circleRadius);
    
    g.append('text')
        .attr('class', 'title')
        .attr('y', -10)
        .text(title);
  };

  var dataset;
  d3.csv('http://vis.lab.djosix.com:2020/data/iris.csv')
    .then(data => {
      data.forEach(d => {
        d['sepal length'] = +d['sepal length'];
        d['sepal width'] = +d['sepal width'];
        d['petal length'] = +d['petal length'];
        d['petal width'] = +d['petal width'];
      });
      dataset = data
      render(dataset, 'sepal length', 'sepal width');
	  
	  d3.select("#select_x").attr('disabled', null);
	  d3.select("#select_y").attr('disabled', null);
    });
  
  function onChange(){
  	render(
      dataset,
      d3.select("#select_x").node().value,
      d3.select("#select_y").node().value
    );
  }
  
  d3.select("#select_x").on("change", onChange);
  
  d3.select("#select_y").on("change", onChange);

}(d3));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIHNlbGVjdCxcbiAgY3N2LFxuICBzY2FsZUxpbmVhcixcbiAgZXh0ZW50LFxuICBheGlzTGVmdCxcbiAgYXhpc0JvdHRvbSxcbiAgZm9ybWF0XG59IGZyb20gJ2QzJztcblxuY29uc3Qgc3ZnID0gc2VsZWN0KCdzdmcnKTtcblxuY29uc3Qgd2lkdGggPSArc3ZnLmF0dHIoJ3dpZHRoJyk7XG5jb25zdCBoZWlnaHQgPSArc3ZnLmF0dHIoJ2hlaWdodCcpO1xuXG5jb25zdCByZW5kZXIgPSBkYXRhID0+IHtcbiAgY29uc3QgdGl0bGUgPSAnQ2FyczogSG9yc2Vwb3dlciB2cy4gV2VpZ2h0JztcbiAgXG4gIGNvbnN0IHhWYWx1ZSA9IGQgPT4gZC5ob3JzZXBvd2VyO1xuICBjb25zdCB4QXhpc0xhYmVsID0gJ0hvcnNlcG93ZXInO1xuICBcbiAgY29uc3QgeVZhbHVlID0gZCA9PiBkLndlaWdodDtcbiAgY29uc3QgY2lyY2xlUmFkaXVzID0gMTA7XG4gIGNvbnN0IHlBeGlzTGFiZWwgPSAnV2VpZ2h0JztcbiAgXG4gIGNvbnN0IG1hcmdpbiA9IHsgdG9wOiA2MCwgcmlnaHQ6IDQwLCBib3R0b206IDg4LCBsZWZ0OiAxNTAgfTtcbiAgY29uc3QgaW5uZXJXaWR0aCA9IHdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQ7XG4gIGNvbnN0IGlubmVySGVpZ2h0ID0gaGVpZ2h0IC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XG4gIFxuICBjb25zdCB4U2NhbGUgPSBzY2FsZUxpbmVhcigpXG4gICAgLmRvbWFpbihleHRlbnQoZGF0YSwgeFZhbHVlKSlcbiAgICAucmFuZ2UoWzAsIGlubmVyV2lkdGhdKVxuICAgIC5uaWNlKCk7XG4gIFxuICBjb25zdCB5U2NhbGUgPSBzY2FsZUxpbmVhcigpXG4gICAgLmRvbWFpbihleHRlbnQoZGF0YSwgeVZhbHVlKSlcbiAgICAucmFuZ2UoW2lubmVySGVpZ2h0LCAwXSlcbiAgICAubmljZSgpO1xuICBcbiAgY29uc3QgZyA9IHN2Zy5hcHBlbmQoJ2cnKVxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7bWFyZ2luLmxlZnR9LCR7bWFyZ2luLnRvcH0pYCk7XG4gIFxuICBjb25zdCB4QXhpcyA9IGF4aXNCb3R0b20oeFNjYWxlKVxuICAgIC50aWNrU2l6ZSgtaW5uZXJIZWlnaHQpXG4gICAgLnRpY2tQYWRkaW5nKDE1KTtcbiAgXG4gIGNvbnN0IHlBeGlzID0gYXhpc0xlZnQoeVNjYWxlKVxuICAgIC50aWNrU2l6ZSgtaW5uZXJXaWR0aClcbiAgICAudGlja1BhZGRpbmcoMTApO1xuICBcbiAgY29uc3QgeUF4aXNHID0gZy5hcHBlbmQoJ2cnKS5jYWxsKHlBeGlzKTtcbiAgeUF4aXNHLnNlbGVjdEFsbCgnLmRvbWFpbicpLnJlbW92ZSgpO1xuICBcbiAgeUF4aXNHLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0cignY2xhc3MnLCAnYXhpcy1sYWJlbCcpXG4gICAgICAuYXR0cigneScsIC05MylcbiAgICAgIC5hdHRyKCd4JywgLWlubmVySGVpZ2h0IC8gMilcbiAgICAgIC5hdHRyKCdmaWxsJywgJ2JsYWNrJylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBgcm90YXRlKC05MClgKVxuICAgICAgLmF0dHIoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpXG4gICAgICAudGV4dCh5QXhpc0xhYmVsKTtcbiAgXG4gIGNvbnN0IHhBeGlzRyA9IGcuYXBwZW5kKCdnJykuY2FsbCh4QXhpcylcbiAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCR7aW5uZXJIZWlnaHR9KWApO1xuICBcbiAgeEF4aXNHLnNlbGVjdCgnLmRvbWFpbicpLnJlbW92ZSgpO1xuICBcbiAgeEF4aXNHLmFwcGVuZCgndGV4dCcpXG4gICAgICAuYXR0cignY2xhc3MnLCAnYXhpcy1sYWJlbCcpXG4gICAgICAuYXR0cigneScsIDc1KVxuICAgICAgLmF0dHIoJ3gnLCBpbm5lcldpZHRoIC8gMilcbiAgICAgIC5hdHRyKCdmaWxsJywgJ2JsYWNrJylcbiAgICAgIC50ZXh0KHhBeGlzTGFiZWwpO1xuICBcbiAgZy5zZWxlY3RBbGwoJ2NpcmNsZScpLmRhdGEoZGF0YSlcbiAgICAuZW50ZXIoKS5hcHBlbmQoJ2NpcmNsZScpXG4gICAgICAuYXR0cignY3knLCBkID0+IHlTY2FsZSh5VmFsdWUoZCkpKVxuICAgICAgLmF0dHIoJ2N4JywgZCA9PiB4U2NhbGUoeFZhbHVlKGQpKSlcbiAgICAgIC5hdHRyKCdyJywgY2lyY2xlUmFkaXVzKTtcbiAgXG4gIGcuYXBwZW5kKCd0ZXh0JylcbiAgICAgIC5hdHRyKCdjbGFzcycsICd0aXRsZScpXG4gICAgICAuYXR0cigneScsIC0xMClcbiAgICAgIC50ZXh0KHRpdGxlKTtcbn07XG5cbmNzdignaHR0cHM6Ly92aXpodWIuY29tL2N1cnJhbi9kYXRhc2V0cy9hdXRvLW1wZy5jc3YnKVxuICAudGhlbihkYXRhID0+IHtcbiAgICBkYXRhLmZvckVhY2goZCA9PiB7XG4gICAgICBkLm1wZyA9ICtkLm1wZztcbiAgICAgIGQuY3lsaW5kZXJzID0gK2QuY3lsaW5kZXJzO1xuICAgICAgZC5kaXNwbGFjZW1lbnQgPSArZC5kaXNwbGFjZW1lbnQ7XG4gICAgICBkLmhvcnNlcG93ZXIgPSArZC5ob3JzZXBvd2VyO1xuICAgICAgZC53ZWlnaHQgPSArZC53ZWlnaHQ7XG4gICAgICBkLmFjY2VsZXJhdGlvbiA9ICtkLmFjY2VsZXJhdGlvbjtcbiAgICAgIGQueWVhciA9ICtkLnllYXI7ICBcbiAgICB9KTtcbiAgICByZW5kZXIoZGF0YSk7XG4gIH0pOyJdLCJuYW1lcyI6WyJzZWxlY3QiLCJzY2FsZUxpbmVhciIsImV4dGVudCIsImF4aXNCb3R0b20iLCJheGlzTGVmdCIsImNzdiJdLCJtYXBwaW5ncyI6Ijs7O0VBVUEsTUFBTSxHQUFHLEdBQUdBLFNBQU0sQ0FBQyxLQUFLLENBQUMs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