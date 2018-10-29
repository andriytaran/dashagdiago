var handleSinglePlayerAttributes = (function() {
  "use strict";
  function getSinglePlayerAttributesData(response, playerId) {
    function getBasicPlayerInfo() {
      return {
        fname: response.player.fname,
        lname: response.player.lname,
        hometown: response.player.hometown,
        school: response.player.school,
        team: response.player.teamName,
        coach: response.player.id,
        scoutdate: response.player.fname,
        university: response.player.fname,
      };
    }
    function getAthletic() {
      return {
        value: response.athletic.touchdownsThrown.value,
        ftick: response.programBenchmark.touchdownsThrown.value,
        stick: response.agdiagoBenchmark.touchdownsThrown.value,
        name: "Touchdowns Thrown",
        field: "touchdownsThrown",
        range: [0, 100],
        style: "number",
        fractiondigits: 0
      };
    }
    function getStaffObservations() {
      return {
        value: response.athletic.forty.value,
        ftick: response.programBenchmark.forty.value,
        stick: response.agdiagoBenchmark.forty.value,
        name: "Forty",
        field: "forty",
        range: [0, 100],
        style: "number",
        fractiondigits: 0
      };
    }
    function getEmotionalIntel() {
      return {
        value: response.athletic.gamesPlayed.value,
        ftick: response.programBenchmark.gamesPlayed.value,
        stick: response.agdiagoBenchmark.gamesPlayed.value,
        name: "Games Played",
        field: "gamesPlayed",
        range: [0, 100],
        style: "number",
        fractiondigits: 0
      };
    }
    function getAcademic() {
      return {
        value: response.athletic.gamesStarted.value,
        ftick: response.programBenchmark.gamesStarted.value,
        stick: response.agdiagoBenchmark.gamesStarted.value,
        name: "Games Started",
        field: "gamesStarted",
        range: [0, 100],
        style: "number",
        fractiondigits: 0
      };
    }
    function getSocialProfile() {
      return {
        value: response.athletic.height.value,
        ftick: response.programBenchmark.height.value,
        stick: response.agdiagoBenchmark.height.value,
        name: "Height",
        field: "height",
        range: [0, 100],
        style: "number",
        fractiondigits: 0
      };
    }
    function getVertical() {
      return {
        value: response.athletic.vertical.value,
        ftick: response.programBenchmark.vertical.value,
        stick: response.agdiagoBenchmark.vertical.value,
        name: "Vertical",
        field: "vertical",
        range: [0, 100],
        style: "number",
        fractiondigits: 0
      };
    }
    function getPsychometrics() {
      return {
        value: response.athletic.weight.value,
        ftick: response.programBenchmark.weight.value,
        stick: response.agdiagoBenchmark.weight.value,
        name: "Weight",
        field: "weight",
        range: [0, 1000],
        style: "number",
        fractiondigits: 0
      };
    }
    function getFootballAccumen() {
      return {
        value: response.athletic.weight.value,
        ftick: response.programBenchmark.weight.value,
        stick: response.agdiagoBenchmark.weight.value,
        name: "Weight",
        field: "weight",
        range: [0, 1000],
        style: "number",
        fractiondigits: 0
      };
    }
    function getCulturalFit() {
      return {
        value: response.athletic.weight.value,
        ftick: response.programBenchmark.weight.value,
        stick: response.agdiagoBenchmark.weight.value,
        name: "Weight",
        field: "weight",
        range: [0, 1000],
        style: "number",
        fractiondigits: 0
      };
    }
    switch (playerId) {
      default:
        return [
          // getAthletic()
          getBasicPlayerInfo()
        ];
    }
  }

  function getTooltip(label) {
    switch (label) {
      case "forty":
        return "<h4>Competitiveness</h4><p class='dashboard-tooltip'>Highly competitive football athletes don’t just want to win — they need to win. Contests and matchups drive them to perform with excellence because their performance is clearly measured. These athletes possess a sense of confidence and are passionate about succeeding both on and off the field. They always strive to improve and they thrive on opportunities to put their talents to the test to claim the top prize.</p>";
      case "gamesPlayed":
        return "<h4>Mastery</h4><p class='dashboard-tooltip'>Athletes with a drive for mastery seek to continually build on their knowledge and refine their skills. They are fueled by learning opportunities and seek out information to stay up to date on their understanding of all elements of the game. In addition to using the knowledge they’ve acquired, these athletes assess their opponents to strategize their play on game day. Often, success is a result of their investment in and application of this ongoing learning.</p>";
      case "gamesStarted":
        return "<h4>Mastery</h4><p class='dashboard-tooltip'>Athletes with a drive for mastery seek to continually build on their knowledge and refine their skills. They are fueled by learning opportunities and seek out information to stay up to date on their understanding of all elements of the game. In addition to using the knowledge they’ve acquired, these athletes assess their opponents to strategize their play on game day. Often, success is a result of their investment in and application of this ongoing learning.</p>";
      case "height":
        return "<h4>Mastery</h4><p class='dashboard-tooltip'>Athletes with a drive for mastery seek to continually build on their knowledge and refine their skills. They are fueled by learning opportunities and seek out information to stay up to date on their understanding of all elements of the game. In addition to using the knowledge they’ve acquired, these athletes assess their opponents to strategize their play on game day. Often, success is a result of their investment in and application of this ongoing learning.</p>";
      case "vertical":
        return "<h4>Mastery</h4><p class='dashboard-tooltip'>Athletes with a drive for mastery seek to continually build on their knowledge and refine their skills. They are fueled by learning opportunities and seek out information to stay up to date on their understanding of all elements of the game. In addition to using the knowledge they’ve acquired, these athletes assess their opponents to strategize their play on game day. Often, success is a result of their investment in and application of this ongoing learning.</p>";
      case "weight":
        return "<h4>Mastery</h4><p class='dashboard-tooltip'>Athletes with a drive for mastery seek to continually build on their knowledge and refine their skills. They are fueled by learning opportunities and seek out information to stay up to date on their understanding of all elements of the game. In addition to using the knowledge they’ve acquired, these athletes assess their opponents to strategize their play on game day. Often, success is a result of their investment in and application of this ongoing learning.</p>";
      default:
        return "";
    }
  }

  return function handleSinglePlayerAttributes(id) {
    if ($("#player-info").length !== 0) {
      $.post(
        "/api/dashboard-data",
        {
          type: "single_player",
          playerId: id
        },
        function(response) {

          const data = getSinglePlayerAttributesData(response, id);
          drawplayerinfo(data,"#basic-player-info");
          function checkifnull(datael){
            if (datael.value === null){return true;}
            else{return false;}
          }
          {
            let elem = document.getElementById("athleticBlock");
            elem.style.display = "none";
          }
          // else {


          //   drawbarchart(
          //     data,
          //     "#player-info",
          //     position,
          //     getTooltip,
          //     getPlayersData
          //   );
          // }
        },
        "json"
      );
    }
  };
})();

function getUrlParameters(data) {
  let res = {};
  let urlParams = new URLSearchParams(window.location.search);
  let myParam = urlParams.get("id");
  if (myParam == null) {
    res.id = undefined;
    return res;
  } else {
    res.id = myParam.toUpperCase();
    return res;
  }
}

var handleDashboardGritterNotification = function() {
  $(window).on("load", function() {
    setTimeout(function() {
      $.gritter.add({
        title: "Welcome back, Admin!",
        text:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus lacus ut lectus rutrum placerat.",
        image: "../assets/img/user/user-2.jpg",
        sticky: true,
        time: "",
        class_name: "my-sticky-class"
      });
    }, 1000);
  });
};

var Dashboard = (function() {
  "use strict";
  return {
    //main function
    init: function() {
      handleDashboardGritterNotification();
      // drawplayerinfo();
      getUrlParameters();
      let urlParams = getUrlParameters();
      handleSinglePlayerAttributes(urlParams.id);
    }
  };
})();
