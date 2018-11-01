function drawplayerinfo(data, selector) {
  function creatediv(parentid, newelclass, newelcont) {
    let parentel = document.getElementById(parentid);
    let newel = document.createElement("div");
    if (newelclass != null) {
      newel.className = newelclass;
      newel.id = newelclass;
    }
    if (newelcont != null) {
      newel.innerHTML = newelcont;
    }
    return parentel.appendChild(newel);
  }

  creatediv("basic-player-info", "playerinfoblock");
  creatediv("playerinfoblock", "photo");
  creatediv("playerinfoblock", "detailedinfo");
  let univer = data.university;
  creatediv("playerinfoblock", "univer", univer);
  let fullname = data.fname + " " + data.lname;
  creatediv("detailedinfo", "fullname", fullname);
  creatediv("detailedinfo", "furtherinfo");
  let hometown = "Hometown: " + data.hometown;
  let scout = "Scout Date: " + data.scoutDate;
  let coach = "Athletic Coach: " + data.coach;
  let school = "Hight School: " + data.school;
  creatediv("furtherinfo", null, hometown);
  creatediv("furtherinfo", null, scout);
  creatediv("furtherinfo", null, coach);
  creatediv("furtherinfo", null, school);

  // создаем новый элемент div
  // и добавляем в него немного контента
  // let mydiv = document.getElementById("basic-player-info");
  // var photodiv = document.createElement("div");
  // photodiv.className = "photo";
  // mydiv.appendChild(photodiv);
  // var textDiv = document.createElement("div");
  // textDiv.className = "textfield";
  // mydiv.appendChild(textDiv);
  // let title = document.createElement("div");
  // title.className = "title";
  // let univer = document.createElement("div");
  // univer.className = "univer";
  // univer.innerHTML = data.university;
  // let details = document.createElement("div");
  // details.className = "details";
  // textDiv.appendChild(univer);
  // textDiv.appendChild(title);
  // textDiv.appendChild(details);
  // let namediv = document.createElement("div");
  // namediv.className = "name";
  // namediv.innerHTML = data.fname + " " + data.lname;
  // let hometowndiv = document.createElement("div");
  // hometowndiv.className = "hometown"
  // hometowndiv.innerHTML = "Hometown: " + data.hometown;
  // let schooldiv = document.createElement("div");
  // schooldiv.className = "school";
  // schooldiv.innerHTML = "Hight School: " + data.school;
  // let scoutdate = document.createElement("div");
  // scoutdate.className = "scout";
  // scoutdate.innerHTML = "Scout Date: " + data.scoutdate;
  // let coach = document.createElement("div");
  // coach.className = "coach";
  // coach.innerHTML = "Athletic Coach: " + data.coach;
  // title.appendChild(namediv);
  // details.appendChild(hometowndiv);
  // details.appendChild(scoutdate);
  // details.appendChild(schooldiv);
  // details.appendChild(coach);
}
