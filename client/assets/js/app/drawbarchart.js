function drawbarchart(data, selector) {
  var chart = d3.select(selector);
  var bar = chart.selectAll("div");
  var barUpdate = bar.data(data);
  var barEnter = barUpdate.enter().append(createbar);

  function createbar(d) {
    let gbar = d3.select(document.createElement("div"));
    gbar.attr("class", "gbar");
    let namefield = gbar.append("div");
    namefield.attr("class", "namef");
    namefield.text(function() {
      return d.name;
    });
    let mbar = gbar.append("div");
    // let mainbar = d3.select(mbar).attr("class", "mbar");
    mbar.attr("class", "mbar");
    mbar.text(function() {
      return d.perc + "%";
    });
    let barEnter = mbar.append("div");
    barEnter.style("width", function() {
      return d.perc * 6 + "px";
    });
    // barEnter.text(function () { return d.perc + "%"; });
    barEnter.attr("class", "perc");
    let ftick = mbar.append("div");
    ftick.attr("class", "tick");
    ftick.style("left", d.ftick * 6 + "px");
    let stick = mbar.append("div");
    stick.attr("class", "tick red");
    stick.style("left", d.stick * 6 + "px");

    return gbar.node();
  }
}
