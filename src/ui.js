export function createUi(actions) {
  const dom = {
    startPanel: document.querySelector("#startPanel"),
    upgradePanel: document.querySelector("#upgradePanel"),
    gameOverPanel: document.querySelector("#gameOverPanel"),
    upgradeGrid: document.querySelector("#upgradeGrid"),
    hpText: document.querySelector("#hpText"),
    sectorText: document.querySelector("#sectorText"),
    scoreText: document.querySelector("#scoreText"),
    heatText: document.querySelector("#heatText"),
    finalText: document.querySelector("#finalText"),
    startButton: document.querySelector("#startButton"),
    restartButton: document.querySelector("#restartButton"),
    restartTop: document.querySelector("#restartTop"),
  };

  dom.startButton.addEventListener("click", actions.startRun);
  dom.restartButton.addEventListener("click", actions.startRun);
  dom.restartTop.addEventListener("click", actions.startRun);

  return {
    hidePanels() {
      dom.startPanel.hidden = true;
      dom.startPanel.classList.remove("is-visible");
      dom.upgradePanel.hidden = true;
      dom.gameOverPanel.hidden = true;
    },
    showGameOver(score) {
      dom.finalText.textContent = `최종 점수 ${score}`;
      dom.gameOverPanel.hidden = false;
    },
    showUpgrades(choices) {
      dom.upgradeGrid.replaceChildren();
      choices.forEach((upgrade, index) => {
        const button = document.createElement("button");
        button.className = "upgrade-card";
        button.type = "button";
        button.innerHTML = `<strong>${index + 1}. ${upgrade.title}</strong><span>${upgrade.description}</span><small>${upgrade.tag}</small>`;
        button.addEventListener("click", () => actions.chooseUpgrade(index));
        dom.upgradeGrid.append(button);
      });
      dom.upgradePanel.hidden = false;
    },
    hideUpgrade() {
      dom.upgradePanel.hidden = true;
    },
    updateHud(state) {
      dom.hpText.textContent = `HP ${Math.max(0, Math.ceil(state.player.hp))}/${state.player.maxHp}`;
      dom.sectorText.textContent = `섹터 ${state.sector}`;
      dom.scoreText.textContent = `${state.score}`;
      dom.heatText.textContent = state.player.heat > state.player.fireDelay * 0.5 ? "재장전" : "안정";
    },
  };
}
