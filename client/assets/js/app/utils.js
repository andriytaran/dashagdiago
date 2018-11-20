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
  if (!position) {
    res.position = undefined;
  } else {
    res.position = position.toUpperCase();
  }

  return res;
}
