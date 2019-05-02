const barBlock = (title, mainScore, agdiagoScore, compName, parentId, res) => {
  const { player, agdiago, program } = res.attributes || {};

  const keys = Object.keys(player);
  const mainScoreScale = 70 / Math.max(agdiagoScore, mainScore)
  const mainScoreColor = mainScore <  agdiagoScore ? 'blue' : 'orange';

  const html = keys.map(key => {

    const count = player[key];
    const red = agdiago[key]
    const black = program[key]

    const color = count <  black ? 'blue' : 'orange';

    const scale = 90 / Math.max(count, red, black)

    return `<div class="core-attr__heading">
                  ${attributesNamesMatches[key] || key}
                </div>
                <div class="core-attr__ag-score">
                  <div class="core-attr__ag-score-progressbar ${color}" style="width: ${count * scale}%"></div>
                  <div style="position: absolute;height: 100%;width: 5px;background: red;left: ${red * scale}%;z-index: 100;"></div>
                  <div style="position: absolute;height: 100%;width: 5px;background: black;left: ${black * scale}%;z-index: 100;"></div>
                  <div class="core-attr__ag-score-value">${Math.round(player[key])}</div>
                </div>`
  }).join('');

  const attrBlock = `<div class="core-attr__block">
              <div class="core-attr__heading">
                ${title}
              </div>
              <div class="core-attr__ag-score">
                <div class="core-attr__ag-score-progressbar ${mainScoreColor}" style="width: ${mainScoreScale * mainScore}%"></div>
                  <div style="position: absolute;height: 100%;width: 5px;background: black;left: ${mainScoreScale * agdiagoScore}%;z-index: 100;"></div>

                <div class="core-attr__ag-score-value">AG Score: ${Math.round(mainScore)}</div>
              </div>
              <button class="core-attr__more-btn" type="button" data-toggle="collapse"
                      data-target="#${compName}" aria-expanded="false"
                      aria-controls="${compName}">
                <span class="core-attr__more-btn-show">Show Sub Categories</span>
                <span class="core-attr__more-btn-hide">Hide Sub Categories</span>
                <div class="core-attr__more-btn-arrow">
                  <img src="../updatedDesign/img/core-attr-arrow.svg" alt="">
                </div>
              </button>
              <div class="core-attr__more-block collapse" id="${compName}"
                   aria-labelledby="${compName}">
                   ${html}
              </div>
            </div>`

  $(`#${parentId}`).append(attrBlock);

}
