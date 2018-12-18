const ComponentAthleticAttributesSection = (function () {
  const template = `
        <div class="elLoader">
          <div class="loader"></div>
        </div>
`;

  function ComponentAthleticAttributesSection(outputId, props) {
    this.outputId = outputId;
    this.position = props.position;
    this.playerId = props.id;
    this.id = uniqueId();

    this.onData = this.onData.bind(this);
  }

  ComponentAthleticAttributesSection.prototype.mount = function mount() {
    const html = ejs.render(template, {});
    document.getElementById(this.outputId).innerHTML = html;
    if (this.playerId == null) { getAthleticAttributesData(this.position, this.onData); }
    else { getPlayerAthleticAttributesData(this.playerId, this.onData); }
  };

  ComponentAthleticAttributesSection.prototype.onData = function onData(response) {
    const data = mapAthleticAttributesForBarchart(response);
    console.log(data)
    function checkifnull(datael) {
      if (datael.value === null) { return true; }
      else { return false; }
    }
    if (data.every(checkifnull)) {
      let elem = document.getElementById(this.outputId);
      elem.innerHTML = "Not Available";
    } else {
      drawBarChart(
        data,
        "#" + this.outputId,
        this.playerId == null ? this.position : this.playerId,
        getTooltip,
        getPlayersData,
      );
    }

    function checkifnull(datael) {
      if (datael.value === null) {
        return true;
      } else {
        return false;
      }
    }
  };

  return ComponentAthleticAttributesSection;
})();
