const uniqueId = (function () {
  let id = 0;

  return function uniqueId (prefix) {
    return prefix + '-' + id++;
  };
})();

function getUrlParameters() {
  let res = {};
  let urlParams = new URLSearchParams(window.location.search);

  let id = urlParams.get("id");
  if (id == null || id === "") {
    res.id = undefined;
  } else {
    res.id = id.toUpperCase();
  }

  let position = urlParams.get("position");
  let category = urlParams.get("category");
  if (!position) {
    res.position = undefined;
  }
  else {
    res.position = position.toUpperCase();
  }


  if (!category) {
    res.category = undefined;
  } else {
    res.category = category.toUpperCase();
  }

  return res;
}

function getDataRange(value, ftick, stick) {
  let res = [0];
  let i = 0;
  do { i = i + 100; }
  while (i < value || i < ftick || i < stick)
  res.push(i);
  return res;
}

function drawloader(selector) {
  let parent = d3.select(selector);
  parent.selectAll("*").remove();
  let elLoader = parent.append("div");
  elLoader.attr("class", "elLoader");
  let loader = elLoader.append("div");
  loader.attr("class", "loader");
}
