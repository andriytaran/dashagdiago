function drawplayerinfo(data, selector) {
  debugger;
//   var chart = d3.select(selector);
//   chart.attr("class", "barchart");
//   var bar = chart.selectAll("div");
//   var barUpdate = bar.data(data);
//   var barEnter = barUpdate.enter().append(creatediv);
//   function creatediv(d){
//     let gbar = d3.select(document.createElement("div"));
//     gbar.attr("class", "gbar");
//     let namefield = gbar.append("div");
//     namefield.attr("class", "namef");
//     namefield.style("width", "30%");

//     namefield.text(d.fname);


//   }

//   mbar
//   .append("div")
//   .text(displayvalue(d.value, d.style))
//   .attr("class", "val");

// return gbar.node();
  // создаем новый элемент div
  // и добавляем в него немного контента
  let mydiv = document.getElementById("basic-player-info");
  var textDiv = document.createElement("div");
      textDiv.className = "textfield";
      mydiv.appendChild(textDiv);
      let title = document.createElement("div");
      title.className = "title";
      let univer = document.createElement("div");
      univer.className = "univer";
      univer.innerHTML = data[0].university;
      let details = document.createElement("div");
      details.className = "details";
      textDiv.appendChild(univer);
      textDiv.appendChild(title);
      textDiv.appendChild(details);
      let namediv = document.createElement("div");
      namediv.className = "name";
      namediv.innerHTML = data[0].fname + " " + data[0].lname;
      let hometowndiv = document.createElement("div");
      hometowndiv.className = "hometown"
      hometowndiv.innerHTML = "Hometown: " + data[0].hometown;
      let schooldiv = document.createElement("div");
      schooldiv.className = "school";
      schooldiv.innerHTML = "Hight School: " + data[0].school;
      let scoutdate = document.createElement("div");
      schooldiv.className = "scout";
      schooldiv.innerHTML = "Scout Date: " + data[0].scoutDate;
      let coach = document.createElement("div");
      schooldiv.className = "coach";
      schooldiv.innerHTML = "Athletic Coach: " + data[0].coach;
      title.appendChild(namediv);
      details.appendChild(schooldiv);
      details.appendChild(hometowndiv);



  // добавляем только что созданый элемент в дерево DOM

  // my_div = document.getElementById("basic-player-info");
  // document.body.insertBefore(newDiv, mydiv);
}
