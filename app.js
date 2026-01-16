"use strict";

const apiKey = "https://696517a8e8ce952ce1f424fd.mockapi.io/Players";

const startGameBtn = document.querySelector("#btnStartGame");
const endVoteBtn = document.querySelector("#btnEndVoting");
const resetBtn = document.querySelector("#btnReset");

const inputPlayerName = document.querySelector("#playerName");
const postPlayerBtn = document.querySelector("#btnSubmit");
const cancelEditBtn = document.querySelector("#btnCancel");

const playerList = document.querySelector("#playersList");

let players = [];
let editPlayerId = null;

async function postPlayer(player) {
  await fetch(apiKey, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(player),
  });
  getPlayers();
}

async function getPlayers() {
  const res = await fetch(apiKey);
  players = await res.json();
  updateList(players);
}

async function deletePlayer(playerId) {
  await fetch(`${apiKey}/${playerId}`, { method: "DELETE" });
  getPlayers();
}

async function votePlayer(playerId) {
  const res = await fetch(`${apiKey}/${playerId}`);
  const player = await res.json();

  await fetch(`${apiKey}/${playerId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vote: player.vote + 1 }),
  });

  getPlayers();
}

async function eliminatePlayer(playerId) {
  await fetch(`${apiKey}/${playerId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ alive: false }),
  });
  getPlayers();
}

async function editPlayer(playerId) {
  const res = await fetch(`${apiKey}/${playerId}`);
  const player = await res.json();

  inputPlayerName.value = player.name;
  editPlayerId = playerId;

  postPlayerBtn.textContent = "UPDATE Player";
  cancelEditBtn.classList.remove("hidden");
}

postPlayerBtn.addEventListener("click", async () => {
  const name = inputPlayerName.value.trim();

  if (name === "") {
    alert("the name is empty");
    return;
  }

  if (editPlayerId !== null) {
    await fetch(`${apiKey}/${editPlayerId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    resetForm();
    getPlayers();
    return;
  }

  await postPlayer({
    name,
    alive: true,
    vote: 0,
  });

  resetForm();
});

cancelEditBtn.addEventListener("click", resetForm);

function resetForm() {
  inputPlayerName.value = "";
  editPlayerId = null;
  postPlayerBtn.textContent = "POST Add Player";
  cancelEditBtn.classList.add("hidden");
}

function updateList(list) {
  playerList.innerHTML = "";
  list.forEach((user) => {
    playerList.innerHTML += `
      <div class="player-card">
        <h3>Name : ${user.name}</h3>
        <p>Alive: ${user.alive}</p>
        <p>Votes: ${user.vote}</p>
        <div class="card-actions">
          <button onclick="votePlayer(${user.id})">Vote</button>
          <button onclick="editPlayer(${user.id})">Edit</button>
          <button onclick="eliminatePlayer(${user.id})">Eliminate</button>
          <button class="danger" onclick="deletePlayer(${user.id})">Delete</button>
        </div>
      </div>
    `;
  });
}

getPlayers();
