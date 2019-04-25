function drawTopCulturals(data, selector) {
  function f() {
    var functions = arguments;

    //convert all string arguments into field accessors
    var i = 0,
      l = functions.length;
    while (i < l) {
      if (
        typeof functions[i] === "string" ||
        typeof functions[i] === "number"
      ) {
        functions[i] = (function (str) {
          return function (d) {
            return d[str];
          };
        })(functions[i]);
      }
      i++;
    }

    //return composition of functions
    return function (d) {
      var i = 0,
        l = functions.length;
      while (i++ < l) d = functions[i - 1].call(this, d);
      return d;
    };
  }

  function displayvalue(value, style, fractiondigits) {
    let fractiondigitsval = 0;
    if (fractiondigits != null) {
      fractiondigitsval = d.fractiondigits;
    }
    if (style == "percent") {
      return (value / 100).toLocaleString(undefined, {
        style: "percent",
        useGrouping: false,
        maximumFractionDigits: fractiondigitsval,
        minimumFractionDigits: fractiondigitsval
      });
    } else {
      return value.toLocaleString(undefined, {
        useGrouping: false,
        maximumFractionDigits: fractiondigitsval,
        minimumFractionDigits: fractiondigitsval
      });
    }
  }
  // column definitions
  var columns = [
    { head: "Rate", cl: "title", html: f("rate") },
    { head: "First Name", cl: "title", html: f("fname") },
    { head: "Last Name", cl: "center", html: f("lname") },
    { head: "Position", cl: "center", html: f("position") },
    { head: "Score", cl: "num", html: f("score") },
    { head: "Show Details", cl: "title", html: function (d) { const params = `?id=${d.id}`; return "<a href='/dashboard-player/" + params + "'>Show Details</a>" } }
  ];
  // create table
  $(selector).empty();
  var table = d3.select(selector).append("table");
  // create table header
  table
    .append("thead")
    .append("tr")
    .selectAll("th")
    .data(columns)
    .enter()
    .append("th")
    .attr("class", f("cl"))
    .text(f("head"));
  // create table body
  table
    .append("tbody")
    .selectAll("tr")
    .data(data)
    .enter()
    .append("tr")
    .selectAll("td")
    .data(function (row, i) {
      return columns.map(function (c) {
        // compute cell values for this specific row
        var cell = {};
        d3.keys(c).forEach(function (k) {
          row.score = displayvalue(row.score);
          cell[k] = typeof c[k] == "function" ? c[k](row, i) : c[k];
        });
        return cell;
      });
    })
    .enter()
    .append("td")
    .html(f("html"))
    .attr("class", f("cl"));
  function length() {
    var fmt = d3.format("02d");
    return function (l) {
      return Math.floor(l / 60) + ":" + fmt(l % 60) + "";
    };
  }
}
