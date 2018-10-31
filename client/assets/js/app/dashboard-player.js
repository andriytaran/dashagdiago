var handleSinglePlayer = (function() {
  "use strict";
  function getSinglePlayerData(response, playerId) {
    debugger;
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
        value: response.scores.athletic,
        ftick: response.programScores.athletic,
        stick: response.agdiagoScores.athletic,
        name: "Athletic",
        field: "athletic",
        range: [0, 200],
        style: "percent",
        fractiondigits: 1
      };
    }
    function getEmotionalIntel() {
      return {
        value: response.scores.emotionalIntel,
        ftick: response.programScores.emotionalIntel,
        stick: response.agdiagoScores.emotionalIntel,
        name: "Emotional Intel",
        field: "emotionalIntel",
        range: [0, 200],
        style: "percent",
        fractiondigits: 1
      };
    }
    function getAcademic() {
      return {
        value: response.scores.academic,
        ftick: response.programScores.academic,
        stick: response.agdiagoScores.academic,
        name: "Academic",
        field: "academic",
        range: [0, 200],
        style: "percent",
        fractiondigits: 1
      };
    }
    function getSocialProfile() {
      return {
        value: response.scores.socialProfile,
        ftick: response.programScores.socialProfile,
        stick: response.agdiagoScores.socialProfile,
        name: "Social Profile",
        field: "socialProfile",
        range: [0, 200],
        style: "percent",
        fractiondigits: 1
      };
    }
    function getCoreAttributes() {
      return {
        value: response.scores.coreAttributes,
        ftick: response.programScores.coreAttributes,
        stick: response.agdiagoScores.coreAttributes,
        name: "Core Attributes",
        field: "coreAttributes",
        range: [0, 200],
        style: "percent",
        fractiondigits: 1
      };
    }

    return {
      playerInfo: getBasicPlayerInfo(),
      playerAttributes: [
        getAthletic(),
        getEmotionalIntel(),
        getAcademic(),
        getSocialProfile(),
        getCoreAttributes()
      ]
    };
  }

  function getTooltip(label) {
    switch (label) {
      case "academic":
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

  return function handleSinglePlayer(id) {
    if ($("#player-attributes").length !== 0 && $("#basic-player-info").length !== 0) {
      $.post(
        "/api/dashboard-data",
        {
          type: "single_player",
          playerId: id
        },
        function(response) {
          const data = getSinglePlayerData(response, id);
          drawplayerinfo(data.playerInfo,"#basic-player-info");

          function checkifnull(datael){
            if (datael.value === null){return true;}
            else{return false;}
          }

          if (data.playerAttributes.every(checkifnull)) {
            let elem = document.getElementById("playerAttributesBlock");
            elem.style.display = "none";
          } else {
            drawbarchart(
              data.playerAttributes,
              "#player-attributes",
              undefined,
              getTooltip,
              undefined
            );
          }
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
      getUrlParameters();
      let urlParams = getUrlParameters();
      handleSinglePlayer(urlParams.id);
    }
  };
})();
