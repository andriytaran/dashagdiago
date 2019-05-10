const AgdiagoScoreHtml = (score) => {
  return `<div class="s-multiple-player__score player-info">
                <div class="player-info__heading small-desc">Agdiago Score</div>
                <div class="player-info__box red">
                  <div class="row">
                    <div class="col-md-5 d-flex align-items-center">
                      <div class="player-info__score-icon">
                        <img src="../updatedDesign/img/score-icon.svg" alt="">
                      </div>
                    </div>
                    <div class="col-md-7">
                      <div class="player-info__score-content">
                        <div class="player-info__score-number">${score}</div>
                        <div class="player-info__score-based-on">Based on registered benchmarks</div>
                      </div>
                    </div>
                  </div>
                </div>
             </div>`
}

const CardHtml = (player) => {
  const { hometown, school, fname, lname, position } = player || {}

  return `<div class="s-multiple-player__info player-info">
                  <div class="player-info__box green">
                    <div class="row">
                      <div class="col-md-4">
                        <div class="player-info__photo">
                          <img src="../updatedDesign/img/player-photo.jpg" alt="">
                        </div>
                      </div>
                      <div class="col-md-8">
                        <div class="player-info__name">${fname} ${lname}</div>
                        <div class="player-info__additional-info">Hometown: ${hometown}</div>
                        <div class="player-info__additional-info">Atheletic Coach: Not Available
                        </div>
                        <div class="player-info__additional-info">Scout Date: Not Available
                        </div>
                        <div class="player-info__additional-info">High School: ${school}</div>
                      </div>
                    </div>
                  </div>
                </div>`
}

const AttrHtml = (attrs) => {

  const attrsHtml = attrs.map(attr=>{
    return `<div id="${attr}" class="attr__block-wrap"></div>`
  }).join("");

  return `<div class="s-multiple-player__attr attr">
                  <div class="attr__header">
                    Player Attributes
                  </div>
                  ${attrsHtml}
                </div>`
}


const AttrBlock = (key, agdiagoScore, playerScore, data) => {


  const scale = 85 / Math.max(agdiagoScore, playerScore);

  const color = agdiagoScore <  playerScore ? 'green' : 'orange';

  const { player, agdiago, program } = data.attributes || {};

  const keys = Object.keys(player);

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
												<div class="attr__ag-score-progressbar green" style="width: 60%">
												</div>
												<div class="attr__ag-score-value">AG Score: ${Math.round(black)}</div>
											</div>`
  }).join('');

  const blockHtml = `<div class="attr__block-wrap">
										<div class="attr__heading">
											${getAttrName(key)}
										</div>
										<div class="attr__ag-score">
											<div class="attr__ag-score-progressbar orange" style="width: 80%">
											</div>
											<div class="attr__ag-score-value">AG Score: 133</div>
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
									</div>`

  $(`#${key}`).html(blockHtml);


}
