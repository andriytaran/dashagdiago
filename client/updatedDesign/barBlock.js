const tooltips = {
  coreAttributesCompetitiveness: 'Highly competitive football athletes don’t merely want to win – they need to win. Contests and matchups drive them to perform with excellence because their performance is clearly measured. These athletes bring a sense of confidence to their play and are passionate about succeeding in the game of football. They strive for constant improvement and thrive on opportunities to put their talent on the line to claim the top prize.',
  coreAttributesMastery: 'Athletes with a drive for mastery seek to continually build on their knowledge and upgrade their skills. They are fueled by learning opportunities and seek out information to stay up to date on their understanding of all elements of football. In addition to using the knowledge they’ve acquired, these athletes study up on opponents to strategize their play on game day. Success is a result of their investment in and application of this continual learning.',
  coreAttributesPersistence: 'Not everything in football comes easily and some games or plays can be difficult or more complicated than expected. In these situations, success comes from resiliency and an unwillingness to give up. Athletes with persistence persevere in the face of obstacles and do not give up easily. It’s in their nature to keep working and try harder to overcome adversity on and off the field. The natural intensity and resolve of these athletes allows them to find success.',
  coreAttributesTeamOrientation: 'Some athletes naturally bring a “team first” mindset, seeking to build collaboration that leads to team success. These athletes, high in team orientation, tend to be the glue that holds the team together, fostering positive relationships within the group. When there is work to be done, these athletes jump in to help others even when it means going beyond the scope of their own expectations. Seen as dependable, they take ownership for their work and follow through which builds trust and leads to strong relationships with their team members.',
  coreAttributesWorkEthic: 'Athletes with strong work ethic create structure in their lives to ensure follow through and success. These athletes are punctual, focused, and organized and create plans to ensure that they meet attendance and performance expectations. Naturally goal-oriented, they create priorities and tune out distractions in order to accomplish the objective. For athletes with work ethic, it’s in their nature to get the work done and to do it right.',
}

const attrBlockHtml = (title, agdiagoScore, playerScore, data, key)=>{

  const scale = 85 / Math.max(agdiagoScore, playerScore);

  const isBenchmarkRiched =  playerScore >=  agdiagoScore;
  const color = isBenchmarkRiched ? 'green' : 'orange';
  const text = isBenchmarkRiched ? 'Athlete has met School min benchmarks' : 'Athlete failed to meet School min benchmarks';
  const textClass = isBenchmarkRiched ? 'text-success' : 'text-warning';

  const { player, agdiago, program } = data.attributes || {};

  const keys = sortAttr(Object.keys(player));

  const attrHtml = keys.map(attr => {

    const count = player[attr];
    const black = agdiago[attr];
    const red = program[attr];

    const isBenchmarkRiched =  count >=  red;
    const color = isBenchmarkRiched ? 'green' : 'orange';
    const text = isBenchmarkRiched ? 'Athlete has met School min benchmarks' : 'Athlete failed to meet School min benchmarks';
    const textClass = isBenchmarkRiched ? 'text-success' : 'text-warning';

    const scale = 80 / Math.max(count, red, black);

    const tooltip = tooltips[attr] ? `data-placement="left" data-toggle="tooltip" data-html="true" title="<div class='text-info text-left'><p>${tooltips[attr]}</p></div>"` : "";

    return `<div class="attr__heading" >
											<p class="d-inline" ${tooltip}>${getAttrName(attr)}</p>
										</div>
										<div class="attr__ag-score" data-toggle="tooltip" data-html="true" title="<div class='${textClass}'><p>${text}</p></div>">
											<div class="attr__ag-score-progressbar ${color}" style="width: ${scale * count}%"></div>
											<div class="attr__benchmark-position black-point" style="width: ${scale * black}%"></div>
											<div class="attr__benchmark-position red-point" style="width: ${scale * red}%"></div>
											<div class="attr__ag-score-value">${Math.round(count * 100)/100}</div>
										</div>`
  }).join('');

  return `<div class="attr__block">
									<div class="attr__heading">
										${getAttrName(title)}
									</div>
									<div class="attr__ag-score" data-toggle="tooltip" data-html="true" title="<div class='${textClass}'><p>${text}</p></div>">
										<div class="attr__ag-score-progressbar ${color}" style="width: ${scale * playerScore}%"></div>
										<div class="attr__benchmark-position black-point" style="width: ${scale * agdiagoScore}%"></div>
										<div class="attr__ag-score-value">AG Score: ${Math.round(playerScore)}</div>
									</div>
									<button class="attr__more-btn" type="button" data-toggle="collapse"
										data-target="#${key}" aria-expanded="false"
										aria-controls="${key}">
										<span class="attr__more-btn-show">Show Sub Categories</span>
										<span class="attr__more-btn-hide">Hide Sub Categories</span>
										<div class="attr__more-btn-arrow">
											<img src="../updatedDesign/img/attr-arrow.svg" alt="">
										</div>
									</button>
									<div class="attr__more-block collapse" id="${key}"
										aria-labelledby="${key}">
										${attrHtml}
									</div>
								</div>`;
}
