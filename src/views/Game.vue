<script>
import axios from "axios";
import { baseURL, headers } from "@/api/index";

export default {
  data() {
    return {
      game: null,
      socket: null,
      userId: sessionStorage.getItem("user_id"),
      userName: sessionStorage.getItem("user_name"),
      gameOver: false
    };
  },

  computed: {
    me() {
      if (!this.game) return null;

      return this.userId === this.game.owner_id
        ? this.game.owner
        : this.game.opponent;
    },

    opponent() {
      if (!this.game) return null;

      return this.userId === this.game.owner_id
        ? this.game.opponent
        : this.game.owner;
    }
  },

  methods: {
    waitForOpponentMove() {
      if (!this.game || !this.userId) {
        console.error("Impossible de lancer le WS");
        return;
      }

      this.socket = new WebSocket(
        "wss://morpion-api.edu.netlor.fr/websockets"
      );

      this.socket.onopen = () => {
        const payload = {
          action: "connect",
          game_id: this.game.id,
          player_id: this.userId
        };

        this.socket.send(JSON.stringify(payload));
      };

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Message WS :", data);
      };

      this.socket.onclose = () => {
        console.log("WebSocket fermé");
      };
    },
    play(index) {
      const row = Math.floor(index / 3) + 1;
      const col = (index % 3) + 1;

      axios
        .patch(
          `${baseURL}/api/games/${this.game.id}/play/${row}/${col}`,
          {},
          { headers }
        )
        .then((response) => {
          this.game = response.data;
          this.game.board = this.normalizeBoard(response.data);
        })
        .catch((error) => {
          console.error(error);
          alert(
            error.response?.data?.error ||
            "Coup invalide (case déjà jouée ?)"
          );
        });
    },
    goHome() {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
      this.$router.push("/");
    },
    normalizeBoard(game) {
      return [
        game.r1c1, game.r1c2, game.r1c3,
        game.r2c1, game.r2c2, game.r2c3,
        game.r3c1, game.r3c2, game.r3c3
      ];
    },
  },
  

  beforeRouteEnter(to, from, next) {
    axios
      .get(baseURL + "/api/games/" + to.params.id, { headers })
      .then((response) => {
        next((vm) => {
          vm.game = response.data;
          vm.game.board = vm.normalizeBoard(response.data);
          vm.waitForOpponentMove();
        });
      })
      .catch((error) => {
        console.error(error);
        alert("Erreur lors du chargement de la partie");
        next("/");
      });
  },

  beforeUnmount() {
    if (this.socket) {
      this.socket.close();
    }
  }
};
</script>

<template>
  <div v-if="game">
    <h2>Partie de Morpion</h2>

    <p><strong>Vous :</strong> {{ me?.name }}</p>
    <p><strong>Code de la partie :</strong> {{ game.code }}</p>

    <!-- Attente adversaire -->
    <div v-if="!game.opponent">
      <p>En attente d’un adversaire...</p>
    </div>

    <!-- Partie active -->
    <div v-else>
      <p><strong>Adversaire :</strong> {{ opponent?.name }}</p>

      <p v-if="game.next_player_id == userId">
        C’est à vous de jouer
      </p>
      <p v-else>
        Au tour de l’adversaire
      </p>

      <!-- Partie terminée -->
      <div v-if="game.state === 2">
        <h3>Partie terminée</h3>

        <p v-if="game.winner_id"> Gagnant : {{ game.winner_id == me.id ? me.name : opponent.name }}</p>

        <p v-else>
          Match nul
        </p>

        <button @click="goHome">
          Retour à l’accueil
        </button>
      </div>

      <!-- Partie en cours -->
      <div v-else class="grid">
        <div
          v-for="(cell, index) in game.board"
          :key="index"
          class="cell"
          :class="{ disabled: cell || game.next_player_id != userId }"
          @click="play(index)"
        >
          {{ cell === 1 ? 'X' : cell === 2 ? 'O' : '' }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 80px);
  gap: 10px;
  margin-top: 20px;
}

.cell {
  width: 80px;
  height: 80px;
  border: 2px solid #333;
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cell.disabled {
  pointer-events: none;
  background-color: #eee;
}
</style>
