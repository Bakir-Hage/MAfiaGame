`use strict`;

console.log(`api`);

const apiKey = `https://696517a8e8ce952ce1f424fd.mockapi.io/Players`;

const startGameBtn = document.querySelector("#btnStartGame");
const endVoteBtn = document.querySelector("#btnEndVoting");
const resetBtn = document.querySelector("#btnReset");

const inputPlayerName = document.querySelector("#playerName");
const postPlayerBtn = document.querySelector("#btnSubmit");
const cancelEditBtn = document.querySelector("#btnCancel");

const playerList = document.querySelector("#playersList");

let players = []

async function postPlayer(player) {
    await fetch(apiKey, {
        method: `POST`,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(player),
    })
    getPlayers();
}
async function getPlayers() {
    await fetch(apiKey)
        .then((res) => res.json())
        .then((res) => {
            players = res
            updateList(res)}
        );
}

async function deletePlayer(playerId) {
    await fetch(`${apiKey}/${playerId}`, {
        method: `DELETE`
    }
    )
    getPlayers()
}

async function votePlayer(playerId) {
    const res = await fetch(`${apiKey}/${playerId}`)
    const player = await res.json();
    const newVote = player.vote + 1;
    try {
        await fetch(`${apiKey}/${playerId}`, {
            method: `PUT`,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({vote:newVote}),
        })
        getPlayers()
    } catch (e) {
        console.log(e)
    }
    
}

postPlayerBtn.addEventListener(`click`, () => {
    const name = inputPlayerName.value;
    if (name.trim() === "") {
        alert(`the name is empty`);
        getPlayers();
    }
    else {
        const player = {
            name: name,
            alive: true,
            vote: 0,
            isVoted: false,
            isMafia: false,
        };
    }
});

function updateList(list) {
    console.log(list)
    list.forEach(user => {
        const currentList = playerList.innerHTML
        playerList.innerHTML = `${currentList}
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
        </div>`
    });

}

getPlayers();
