function drawbarchart(data, selector, position, getTooltip, getPlayersData) {
  var chart = d3.select(selector);
  chart.attr("class", "barchart");
  var bar = chart.selectAll("div");
  var barUpdate = bar.data(data);
  var barEnter = barUpdate.enter().append(createbar);

  function createbar(d) {
    // const maxwidth = 300;
    // const widthPerPercent = maxwidth / 100;
    function perccheck(value, ranges, rangee) {
      let singleperc = (rangee - ranges) / 100;
      return (value - ranges) / singleperc;
    }
    let gbar = d3.select(document.createElement("div"));
    gbar.attr("class", "gbar");
    let namefield = gbar.append("div");
    namefield.attr("class", "namef");
    namefield.style("width", "30%");
    namefield.text(d.name);
    let mbar = gbar.append("div");
    // let mainbar = d3.select(mbar).attr("class", "mbar");
    mbar.attr("class", "mbar");
    mbar.style("width", "70%");
    mbar.attr("data-toggle", "tooltip");
    mbar.attr("data-html", "true");
    // mbar.attr("data-placement", "top");
    mbar.attr("title", getTooltip(d.name));
    $(mbar.node()).tooltip({ container: chart.node() });
    function showmodal() {
      getPlayersData(position, d.field, function(players) {drawtable(players, "#players")});
      $("#chartmodal").modal("show");
    }
    $(mbar.node()).on("click", showmodal);
    let barEnter = mbar.append("div");

    barEnter.style("width", perccheck(d.value, d.range[0], d.range[1]) + "%");

    if (d.value < d.ftick && d.value < d.stick) {
      barEnter.style("background-color", "orange");
    }
    // barEnter.text(function () { return d.perc + "%"; });
    barEnter.attr("class", "perc");
    if (d.value == null){gbar.style("display", "none");}
    let ftick = mbar.append("div");
    ftick.attr("class", "tick");

    ftick.style("left", function() {
      return perccheck(d.ftick, d.range[0], d.range[1]) + "%";
    });
    if (d.ftick == null){ftick.style("display", "none");}
    let stick = mbar.append("div");
    stick.attr("class", "tick red");

    stick.style("left", function() {
      return perccheck(d.stick, d.range[0], d.range[1]) + "%";
    });
    if (d.stick == null){stick.style("display", "none");}
    function displayvalue(value, style, fractiondigits) {
      let fractiondigitsval = 1;
      if (d.fractiondigits != null) {
        fractiondigitsval = d.fractiondigits;
      }
      if (d.style == "percent") {
        return (d.value / 100).toLocaleString(undefined, {
          style: "percent",
          maximumFractionDigits: fractiondigitsval,
          minimumFractionDigits: fractiondigitsval
        });
      } else {
        return d.value.toLocaleString(undefined, {
          maximumFractionDigits: fractiondigitsval,
          minimumFractionDigits: fractiondigitsval
        });
      }
    }
    // const percentText = (d.value / 100).toLocaleString(undefined, {
    //   style: "percent",
    //   minimumFractionDigits: 1
    // });
    mbar
      .append("div")
      .text(displayvalue(d.value, d.style))
      .attr("class", "val");

    return gbar.node();
  }
}
