`use strict`;

console.log(`api`);

const apiKey = `https://696517a8e8ce952ce1f424fd.mockapi.io/Players`;

const startGameBtn = document.querySelector("#btnStartGame");
const endVoteBtn = document.querySelector("#btnEndVoting");
const resetBtn = document.querySelector("#btnReset");

const inputPlayerName = document.querySelector("#playerName");
const postPlayerBtn = document.querySelector("#btnSubmit");
const cancelEditBtn = document.querySelector("#btnCancel");

async function postPlayer(player) {
  fetch(apiKey, {
    method: `POST`,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(player),
  }).then(getPlayers());
}

async function getPlayers() {
  const players = [];
  fetch(apiKey)
    .then((res) => res.json())
    .then((res) => console.log(res));
}
async function test() {}
async function deletePlayer(player) {}

postPlayerBtn.addEventListener(`click`, () => {
  getPlayers();
  const name = inputPlayerName.value;
  if (name.trim() === "") alert(`the name is empty`);
  else {
    const player = {
      name: name,
      alive: true,
      vote: 0,
      isVoted: false,
      isMafia: false,
    };
    postPlayer(player);
  }
});
