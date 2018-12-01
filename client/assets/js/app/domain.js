function getTooltip(term, {color} ) {
  let res = "";
  switch (color){
    case "green":
      res = res + "<p class='dashboard-tooltip' style='color:green;'><strong>Green Bar: Athlete has met School and Agdiago min benchmarks</strong>";
      break;
    case "orange":
      res = res + "<p class='dashboard-tooltip' style='color:orange;'><strong>Orange Bar: Athlete failed to meet School and Agdiago min benchmarks</strong>";
      break;
  }
  switch (term) {
    case "coreAttributesCompetitiveness":
      res = res + "<hr>Highly competitive football athletes don’t just want to win — they need to win. Contests and matchups drive them to perform with excellence because their performance is clearly measured. These athletes possess a sense of confidence and are passionate about succeeding both on and off the field. They always strive to improve and they thrive on opportunities to put their talents to the test to claim the top prize.</p>";
      break;
    case "coreAttributesMastery":
      res = res + "<hr>Athletes with a drive for mastery seek to continually build on their knowledge and refine their skills. They are fueled by learning opportunities and seek out information to stay up to date on their understanding of all elements of the game. In addition to using the knowledge they’ve acquired, these athletes assess their opponents to strategize their play on game day. Often, success is a result of their investment in and application of this ongoing learning.</p>";
      break;
    case "coreAttributesPersistence":
      res = res + "<hr>Not everything in football comes easily and some games or plays can be difficult or more complicated than expected. In these situations, success comes from resiliency and an unwillingness to give up. Athletes with persistence persevere in the face of obstacles and do not give up. It’s in their nature to keep working and try harder to overcome adversity in whatever they do. Their natural intensity and resolve allow them to find success.</p>";
      break;
    case "coreAttributesTeamOrientation":
      res = res + "<hr>Some athletes naturally possess a “team first” mindset, seeking to build collaboration that leads to success. These individuals are often the glue that holds the team together, fostering positive relationships within the group. When there is work to be done, these athletes jump in to help others even when it means going beyond the scope of their own expectations. Seen as dependable, they take ownership for their work and follow through, which builds trust and leads to close relationships with their team members.</p>";
      break;
    case "coreAttributesWorkEthic":
      res = res + "<hr>Athletes with strong work ethic create structure in their lives to ensure follow through and success. These individuals are punctual, focused and organized; they often create plans to ensure that they meet attendance and performance expectations. Naturally goal-oriented, they set priorities and tune out distractions to accomplish the objectives. For athletes with work ethic, they believe in getting the work done and doing it right.</p>";
      break;
    default:
      res = res + "</p>";
      break;
  }
  return res;
}
