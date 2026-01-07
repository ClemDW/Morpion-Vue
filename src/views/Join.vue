<script>
import axios from "axios";
import { baseURL, headers } from "@/api/index";

export default {
  data() {
    return {
      gameCode: "",
      error: null
    };
  },

  methods: {
    joinGame() {
      this.error = null;

      axios
        .patch(
          `${baseURL}/api/games/${this.gameCode}/join`,
          {},
          { headers }
        )
        .then((response) => {
          const game = response.data;

          // Redirection vers la partie
          this.$router.push(`/game/${game.id}`);
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.error) {
            this.error = err.response.data.error;
          } else {
            this.error = "Impossible de rejoindre la partie.";
          }
        });
    }
  }
};
</script>

<template>
  <div class="join">
    <h2>Rejoindre une partie</h2>

    <div class="form">
      <input
        type="text"
        v-model="gameCode"
        placeholder="Code de la partie"
      />

      <button @click="joinGame">
        Rejoindre
      </button>
    </div>

    <!-- Affichage des erreurs -->
    <p v-if="error" class="error">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
</style>
