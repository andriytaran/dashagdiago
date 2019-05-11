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
