<script>
import axios from "axios";
import { baseURL, headers } from "@/api/index";

export default {
  data() {
    return {
      game: null,
      socket: null,
      userId: sessionStorage.getItem("user_id"),
      userName: sessionStorage.getItem("user_name")
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

        switch (data.action) {
          case "opponent-join":
            this.game.opponent = data.opponent;
            break;

          case "opponent-play":
            this.game.board = data.board;
            this.game.next_player_id = data.next_player_id;
            break;

          case "opponent-quit":
            alert("Votre adversaire a quitté la partie");
            this.game.opponent = null;
            break;
        }
      };

      this.socket.onclose = () => {
        console.log("WebSocket fermé");
      };
    }
  },

  beforeRouteEnter(to, from, next) {
    axios
      .get(baseURL + "/api/games/" + to.params.id, { headers })
      .then((response) => {
        next((vm) => {
          vm.game = response.data;
          if (!vm.game.board) {
            vm.game.board = Array(9).fill(null);
          }
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

      <!-- Grille -->
      <div class="grid">
        <div
          v-for="(cell, index) in game.board"
          :key="index"
          class="cell"
        >
          {{ cell }}
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
</style>
