function drawacademic(data, selector, getTooltip) {
  var chart = d3.select(selector);
  chart.attr("class", "barchart");
  var bar = chart.selectAll("div");
  var barUpdate = bar.data(data);
  var barEnter = barUpdate.enter().append(createbar);

  function perccheck(a) {
    if (a < 100) {
      return a;
    }
    if (a > 100 && a < 1000) {
      return a / 10;
    } else {
      return a / 100;
    }
  }

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
    $(mbar.node()).tooltip({ container: chart.node() });
    let barEnter = mbar.append("div");
    barEnter.style("width", function() {
      return perccheck(d.perc) + "%";
    });
    // barEnter.text(function () { return d.perc + "%"; });
    barEnter.attr("class", "perc");
    let ftick = mbar.append("div");
    ftick.attr("class", "tick");
    ftick.style("left", function() {
      return perccheck(d.ftick) + "%";
    });
    let stick = mbar.append("div");
    stick.attr("class", "tick red");
    stick.style("left", function() {
      return perccheck(d.stick) + "%";
    });

    const percentText = (d.perc / 100).toLocaleString(undefined, {
      style: "percent",
      minimumFractionDigits: 1
    });
    mbar
      .append("div")
      .text(percentText)
      .attr("class", "val");

    return gbar.node();
  }
}
