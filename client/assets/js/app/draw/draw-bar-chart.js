function drawBarChart(data, selector, position, getTooltip, getPlayersData) {
  var chart = d3.select(selector);
  chart.selectAll(".elLoader").remove();
  // let cleaner = document.querySelector(selector);
  // cleaner.removeChild();
  // cleaner.innerHTML = '';
  chart.attr("class", "barchart");

  // for (let d of data) {
  //   const newbar = createbar(d);
  //   chart.append(newbar);
  // }

  var bar = chart.selectAll("div");
  var barUpdate = bar.data(data);
  var barEnter = barUpdate.enter().append(createbar);

  // let cleaner = d3.select(selector);

  function createbar(d) {
    // const maxwidth = 300;
    // const widthPerPercent = maxwidth / 100;
    if (d.value == null) { return document.createElement("div") };
    function perccheck(value, ranges, rangee) {
      let singleperc = (rangee - ranges) / 100;
      return (value - ranges) / singleperc;
    }
    let gbar = d3.select(document.createElement("div"));
    gbar.attr("class", "gbar");
    let namefield = gbar.append("div");
    namefield.attr("class", "namef");
    namefield.style("width", "30%");
    var unit='';


      if (d.name == 'Weight') {unit = ' lbs'}
      if (d.name == 'Height') {unit = ' in '}
      if (d.name == 'Vertical') {unit = ' in '}
      if (d.name == 'Forty') {unit = ' sec '}


    namefield.text(d.name);
    
           
    let mbar = gbar.append("div");
    // let mainbar = d3.select(mbar).attr("class", "mbar");
    mbar.attr("class", "mbar");
    mbar.style("width", "70%");
    mbar.attr("data-toggle", "tooltip");
    mbar.attr("data-html", "true");
    // mbar.attr("data-placement", "top");
    // $(mbar.node()).tooltip({ container: chart.node() });
    if (getPlayersData) {
      function showmodal() {
        drawloader("#players");
        $("#chartmodal").modal("show");
        getPlayersData({
          position: position,
          attribute: d.field
        }, function (response) {
          drawTable(mapPlayersForTable(response), "#players")
        });
      }
      $(mbar.node()).on("click", showmodal);
    }
    let barEnter = mbar.append("div");

    barEnter.style("width", perccheck(d.value, d.range[0], d.range[1]) + "%");
    let props = {};
    props.color = "green";
    if (d.value < d.ftick && d.value < d.stick) {
      barEnter.style("background-color", "orange");
      props.color = "orange";
    }
    if (d.ftick == null && d.value < d.stick) {
      barEnter.style("background-color", "orange");
      props.color = "orange";
    }
    if (d.value < d.ftick && d.stick == null) {
      barEnter.style("background-color", "orange");
      props.color = "orange";
    }
    mbar.attr("title", getTooltip(d.field, props));
    $(mbar.node()).tooltip({ container: chart.node() });
    // barEnter.text(function () { return d.perc + "%"; });
    barEnter.attr("class", "perc");
    if (d.value == null) { gbar.style("display", "none"); }
    let ftick = mbar.append("div");
    ftick.attr("class", "tick red");

    ftick.style("left", function () {
      return perccheck(d.ftick, d.range[0], d.range[1]) + "%";
    });
    if (d.ftick == null) { ftick.style("display", "none"); }
    let stick = mbar.append("div");
    stick.attr("class", "tick");

    stick.style("left", function () {
      return perccheck(d.stick, d.range[0], d.range[1]) + "%";
    });
    if (d.stick == null) { stick.style("display", "none"); }
    function displayvalue(value, style, fractiondigits) {
      let fractiondigitsval = 1;
      if (d.fractiondigits != null) {
        fractiondigitsval = d.fractiondigits;
      }
      if (d.style == "percent") {
        return (d.value / 100).toLocaleString(undefined, {
          style: "percent",
          useGrouping: false,
          maximumFractionDigits: fractiondigitsval,
          minimumFractionDigits: fractiondigitsval
        })+ unit;
      } else {
        return d.value.toLocaleString(undefined, {
          useGrouping: false,
          maximumFractionDigits: fractiondigitsval,
          minimumFractionDigits: fractiondigitsval
        }) + unit;
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
