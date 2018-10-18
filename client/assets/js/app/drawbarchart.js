function drawbarchart(data, selector, getTooltip) {
  var chart = d3.select(selector);
  chart.attr("class", "barchart");
  var bar = chart.selectAll("div");
  var barUpdate = bar.data(data);
  var barEnter = barUpdate.enter().append(createbar);

  function createbar(d) {
    // const maxwidth = 300;
    // const widthPerPercent = maxwidth / 100;

    let gbar = d3.select(document.createElement("div"));
    gbar.attr("class", "gbar");
    let namefield = gbar.append("div");
    namefield.attr("class", "namef");
    namefield.style("width", "30%");
    namefield.text(function() {
      return d.name;
    });
    let mbar = gbar.append("div");
    // let mainbar = d3.select(mbar).attr("class", "mbar");
    mbar.attr("class", "mbar");
    mbar.style("width", "70%");
    mbar.attr("data-toggle", "tooltip");
    mbar.attr("data-html", "true");
    // mbar.attr("data-placement", "top");
    mbar.attr("title", getTooltip(d.name));
    $(mbar.node()).tooltip({container: chart.node()});
    let barEnter = mbar.append("div");
    barEnter.style("width", function() {
      return d.perc + "%";
    });
    // barEnter.text(function () { return d.perc + "%"; });
    barEnter.attr("class", "perc");
    let ftick = mbar.append("div");
    ftick.attr("class", "tick");
    ftick.style("left", d.ftick + "%");
    let stick = mbar.append("div");
    stick.attr("class", "tick red");
    stick.style("left", d.stick + "%");

    const percentText = (d.perc / 100).toLocaleString(undefined, {
      style: "percent",
      minimumFractionDigits: 1
    });
    mbar.append("div").text(percentText);

    return gbar.node();
  }
}
