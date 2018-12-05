const ComponentOverallScoreSection = (function () {
  const template = `
    <!-- begin panel -->
    <div class="panel panel-inverse">
      <div class="panel-heading">
        <h4 class="panel-title">overall scores</h4>
      </div>
      <div class="panel-body">
        <div class="elLoader">
          <div class="loader"></div>
        </div>
      </div>
    </div>
    <!-- end panel -->
`;

  function ComponentOverallScoreSection(outputId, props) {
    this.outputId = outputId;
    this.position = props.position;
    this.playerId = props.id;
    this.id = uniqueId();

    this.onData = this.onData.bind(this);
  }

  ComponentOverallScoreSection.prototype.mount = function mount() {
    const html = ejs.render(template, {});
    document.getElementById(this.outputId).innerHTML = html;
    getOverallScoresData(this.position, this.onData);
  };

  ComponentOverallScoreSection.prototype.onData = function onData(response) {
    const data = mapOverallScoresForBarchart(response);

    let elem = document.getElementById(this.outputId);
    if (data.every(checkifnull)) {
      elem.style.display = "none";
    } else {
      const body = elem.querySelector(".panel-body");
      const accordionId = "accordion-" + this.id;
      body.innerHTML = "<div id='" + accordionId + "'></div>";
      drawOverall(
        data,
        "#" + accordionId,
        {
          position: this.position,
          id: this.playerId
        },
        getTooltip,
        undefined
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

  return ComponentOverallScoreSection;
})();
