const ComponentEmotionalIntelAttributesSection = (function () {
  const template = `
        <div class="elLoader">
          <div class="loader"></div>
        </div>
`;

  function ComponentEmotionalIntelAttributesSection(outputId, props) {
    this.outputId = outputId;
    this.position = props.position;
    this.playerId = props.id;
    this.id = uniqueId();

    this.onData = this.onData.bind(this);
  }

  ComponentEmotionalIntelAttributesSection.prototype.mount = function mount() {
    const html = ejs.render(template, {});
    document.getElementById(this.outputId).innerHTML = html;
    if (this.playerId == null) { getEmotionalIntelAttributesData(this.position, this.onData); }
    else { getPlayerEmotionalIntelAttributesData(this.playerId, this.onData); }
  };

  ComponentEmotionalIntelAttributesSection.prototype.onData = function onData(response) {
    const data = mapEmotionalIntelAttributesForBarChart(response);
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

  return ComponentEmotionalIntelAttributesSection;
})();
