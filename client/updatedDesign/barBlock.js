const attrBlockHtml = (title, agdiagoScore, playerScore, data, key)=>{

  const scale = 85 / Math.max(agdiagoScore, playerScore);

  const color = agdiagoScore <  playerScore ? 'green' : 'orange';

  const { player, agdiago, program } = data.attributes || {};

  const keys = Object.keys(player).sort();


  const attrHtml = keys.map(attr => {

    const count = player[attr];
    const black = agdiago[attr];
    const red = program[attr];

    const color = count <  red ? 'orange' : 'green';

    const scale = 80 / Math.max(count, red, black);

    return `<div class="attr__heading">
											${getAttrName(attr)}
										</div>
										<div class="attr__ag-score">
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
									<div class="attr__ag-score">
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
