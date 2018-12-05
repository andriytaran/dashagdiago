function drawTable(data, selector) {
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
  // column definitions
  var columns = [
    { head: "First Name", cl: "title", html: f("fname") },
    { head: "Last Name", cl: "center", html: f("lname") },
    { head: "Position", cl: "center", html: f("position") },
    { head: "Score", cl: "num", html: f("score") },
    { head: "Show Details", cl: "title", html: function (d) { return "<a href='/dashboard-player/?id=" + d.id + "'>Show Details</a>" } }
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
