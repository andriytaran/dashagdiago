function drawOverall(data, selector, position, getTooltip, getPlayersData) {
  var chart = d3.select(selector);
  chart.selectAll(".elLoader").remove();
  // let cleaner = document.querySelector(selector);
  // cleaner.removeChild();
  // cleaner.innerHTML = '';
  chart.attr("class", "barchart");
  var bar = chart.selectAll("div");
  var barUpdate = bar.data(data);
  // for (let i =0;i<barUpdate.length;i++)
  // {
  var barEnter = barUpdate.enter().append(createcard);
  // }
  // function checkupdatepos(barUpdate){
  //   return barUpdate[0] + 1;
  // }
  // let cleaner = d3.select(selector);
  function createcard(d, i) {
    function creatediv(parentel, newelclass, newelid, newelcont) {
      let newel = document.createElement("div");
      if (newelclass != null) {
        newel.className = newelclass;
        newel.id = newelclass;
      }
      if (newelid != null) {
        newel.id = newelid;
      }
      if (newelcont != null) {
        newel.innerHTML = newelcont;
      }
      if (parentel != null) {
        parentel.appendChild(newel);
      }
      return newel;
    }

    function createbutt(parentel, dataTarget, ariacont) {
      parentel.querySelector("h5");
      let newel = document.createElement("button");
      newel.className = "btn btn-link";
      newel.setAttribute("data-toggle", "collapse");
      newel.setAttribute("aria-expanded", "false");
      newel.setAttribute("data-target", dataTarget);
      newel.setAttribute("aria-controls", ariacont);
      newel.style.width = "100%" ;
     
      let bar = createbar(d);
      newel.appendChild(bar);
      parentel.appendChild(newel);

     var leftnode = document.createElement("div"); 
          leftnode.className = "pull-left";
   
  
      var node = document.createElement("I"); 

      var textToShow=document.createTextNode(" Show Sub Categories"); 
          node.className = "fas fa-arrow-alt-circle-down";
          node.appendChild(textToShow);  
          leftnode.appendChild(node);

        newel.appendChild(node);


    }
    let newcardid = "card" + i.toString();
    let newcard = creatediv(null, "card", newcardid);
    newcard.style.marginBottom = "0px";
    // newcard.setAttribute("width", "100%");
    let headingid = "heading" + i.toString();
    let heading = creatediv(newcard, "card-header", headingid);
    let newh = document.createElement("h5");
    newh.className = "mb-0";
    heading.appendChild(newh);
    let datatar = "#collapse" + i.toString();
    let ariacon = "collapse" + i.toString();
    createbutt(heading, datatar, ariacon);
    let bodywrap = creatediv(newcard, "collapse", ariacon);
    bodywrap.setAttribute("aria-labelledby", headingid);
    bodywrap.setAttribute("data-parent", "#accordionExample");
    $(bodywrap).one('show.bs.collapse', function(){
      switch (d.field){
      case "coreAttributes":
      return handleCoreAttributes(position);
      case "academic":
      return handleAcademicAttributes(position);
      case "emotionalIntel":
      return handleEmotionalIntelAttributes(position);
      case "athletic":
      return handleAthleticAttributes(position);
      case "socialProfile":
      return handleSocialProfileAttributes(position);
      }
    });
    let body = creatediv(bodywrap, "card-body", d.contentId);
    let elLoado = creatediv(body,"elLoader");
    let loader = creatediv(elLoado, "loader");
    elLoado.appendChild(loader);
    body.appendChild(elLoado);
    return newcard;
  }

  function createbar(d) {
    // const maxwidth = 300;
    // const widthPerPercent = maxwidth / 100;
    if (d.value == null) {
      return document.createElement("div");
    }
    function perccheck(value, ranges, rangee) {
      let singleperc = (rangee - ranges) / 100;
      return (value - ranges) / singleperc;
    }
    let gbar = d3.select(document.createElement("div"));
    gbar.attr("class", "gbar");
    let namefield = gbar.append("div");
    namefield.attr("class", "namef");
    namefield.style("width", "30%");
    namefield.style("text-align", "left");
    namefield.text(d.name);
    let mbar = gbar.append("div");
    // let mainbar = d3.select(mbar).attr("class", "mbar");
    mbar.attr("class", "mbar");
    mbar.style("width", "70%");
    mbar.attr("data-toggle", "tooltip");
    mbar.attr("data-html", "true");
    // mbar.attr("data-placement", "top");
    mbar.attr("title", getTooltip(d.field));
    $(mbar.node()).tooltip({ container: chart.node() });
    if (getPlayersData) {
      function showmodal(event) {
        event.stopPropagation();
        drawloader("#players");
        $("#chartmodal").modal("show");
        getPlayersData(position, d.field, function(players) {
          drawtable(players, "#players");
        });
      }
      $(mbar.node()).on("click", showmodal);
    }
    let barEnter = mbar.append("div");

    barEnter.style("width", perccheck(d.value, d.range[0], d.range[1]) + "%");

    if (d.value < d.ftick && d.value < d.stick) {
      barEnter.style("background-color", "orange");
    }
    // barEnter.text(function () { return d.perc + "%"; });
    barEnter.attr("class", "perc");
    if (d.value == null) {
      gbar.style("display", "none");
    }
    let ftick = mbar.append("div");
    ftick.attr("class", "tick red");

    ftick.style("left", function() {
      return perccheck(d.ftick, d.range[0], d.range[1]) + "%";
    });
    if (d.ftick == null) {
      ftick.style("display", "none");
    }
    let stick = mbar.append("div");
    stick.attr("class", "tick");

    stick.style("left", function() {
      return perccheck(d.stick, d.range[0], d.range[1]) + "%";
    });
    if (d.stick == null) {
      stick.style("display", "none");
    }
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
        });
      } else {
        return d.value.toLocaleString(undefined, {
          useGrouping: false,
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
