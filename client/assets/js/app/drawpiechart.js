function drawpiechart(data, selector, getTooltip) {
  nv.addGraph(function() {
    var pieChart = nv.models
      .pieChart()
      .x(function(d) {
        return d.label;
      })
      .y(function(d) {
        return d.value;
      })
      // .showLabels(true)
      .labelThreshold(0.05);

    pieChart.tooltip.contentGenerator(function(obj) {
      return getTooltip(obj.data);
    });

    d3.select(selector)
      .append("svg")
      .datum(data)
      .transition()
      .duration(300)
      .call(pieChart);

    return pieChart;
  });
}
