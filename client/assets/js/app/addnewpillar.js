function createElem(tag, parentid, newelclass, newelid, newelcont) {
  let parentel = document.getElementById(parentid);
  let newel = document.createElement(tag);
  if (newelid !=null){
    newel.id = newelid;
  }
  if (newelclass != null) {
    newel.className = newelclass;
    if (newelid == null){
    newel.id = newelclass;
  }
  }
  if (newelcont != null) {
    newel.innerHTML = newelcont;
  }
  return parentel.appendChild(newel);
}

function createInput(parentid, newelclass, newelid, type, placeholder) {
  let parentel = document.getElementById(parentid);
  let newel = document.createElement("input");
  if (newelid !=null){
    newel.id = newelid;
  }
  if (newelclass != null) {
    newel.className = newelclass;
  }
  newel.type = type;
  newel.placeholder = placeholder;
  return parentel.appendChild(newel);
}

function nextattributeid(index, str){
  return str + index.toString();
}

function addAllAttributes(){
  for (let i=1;i<=timescalled;i++){
    res = []
    let elem = document.getElementById(nextattributeid(i, "pillarAttr")).value;
    res.push(elem);
  }
}

let timescalled = 0;
var button = document.getElementById("addNewAttribute");
button.addEventListener("click",function(e){
    timescalled++;
    // button.disabled = "true";
    createElem("div", "newAttributesList", "form-group row m-b-15", nextattributeid(timescalled, "newattr"));
    createElem("label", nextattributeid(timescalled, "newattr"), "col-form-label col-md-3", "label", "Pillar attribute name: ");
    createElem("div", nextattributeid(timescalled, "newattr"), "col-md-9", nextattributeid(timescalled, "col"));
    createInput(nextattributeid(timescalled, "col"), "form-control m-b-5", nextattributeid(timescalled, "pillarAttr"), "text", "Pillar attributes*");
},false);

