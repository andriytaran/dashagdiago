const ComponentCoreAttributesSection = (function () {
  const template = `
        <div class="elLoader">
          <div class="loader"></div>
        </div>
`;

  function ComponentCoreAttributesSection(outputId, props) {
    this.outputId = outputId;
    this.position = props.position;
    this.playerId = props.id;
    this.id = uniqueId();

    this.onData = this.onData.bind(this);
  }

  ComponentCoreAttributesSection.prototype.mount = function mount() {
    const html = ejs.render(template, {});
    document.getElementById(this.outputId).innerHTML = html;
    if (this.playerId == null) { getCoreAttributesData(this.position, this.onData); }
    else { getPlayerCoreAttributesData(this.playerId, this.onData); }
  };

  ComponentCoreAttributesSection.prototype.onData = function onData(response) {
    const data = mapCoreAttributesForBarChart(response);
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

  return ComponentCoreAttributesSection;
})();
