function drawplayerinfo(data, selector) {
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
  univer.innerHTML = data.university;
  let details = document.createElement("div");
  details.className = "details";
  textDiv.appendChild(univer);
  textDiv.appendChild(title);
  textDiv.appendChild(details);
  let namediv = document.createElement("div");
  namediv.className = "name";
  namediv.innerHTML = data.fname + " " + data.lname;
  let hometowndiv = document.createElement("div");
  hometowndiv.className = "hometown"
  hometowndiv.innerHTML = "Hometown: " + data.hometown;
  let schooldiv = document.createElement("div");
  schooldiv.className = "school";
  schooldiv.innerHTML = "Hight School: " + data.school;
  let scoutdate = document.createElement("div");
  schooldiv.className = "scout";
  schooldiv.innerHTML = "Scout Date: " + data.scoutDate;
  let coach = document.createElement("div");
  schooldiv.className = "coach";
  schooldiv.innerHTML = "Athletic Coach: " + data.coach;
  title.appendChild(namediv);
  details.appendChild(schooldiv);
  details.appendChild(hometowndiv);
}
