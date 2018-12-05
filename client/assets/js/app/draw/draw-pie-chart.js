function drawPieChart(data, selector, position, getTooltip) {

  function showmodal(position, data) {
    drawloader("#players");
    $("#chartmodal").modal("show");
    getCulturalFitModalTableData(position, data.rangeStart, data.rangeEnd, function (response) {
      drawTable(mapCulturalFitForTable(response), '#players')
    });
  }

  let block = d3.select(selector)
  block.selectAll(".elLoader").remove()
  nv.addGraph(function () {
    var pieChart = nv.models
      .pieChart()
      .x(function (d) {
        return d.label;
      })
      .y(function (d) {
        return d.value;
      })
      // .showLabels(true)
      .labelThreshold(0.05);

    pieChart.tooltip.contentGenerator(function (obj) {
      return getTooltip(obj.data);
    });

    d3.select(selector)

      .append("svg")
      .datum(data)
      .transition()
      .duration(300)
      .call(pieChart);
    if (getPlayersData) {
      pieChart.pie.dispatch.on("elementClick", function (obj) {
        showmodal(position, obj.data);
      });
    }


    return pieChart;
  });
}

