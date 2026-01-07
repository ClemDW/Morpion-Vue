<script>
import { RouterLink } from 'vue-router';
import axios from 'axios';
import { baseURL, headers } from '@/api/index';

export default {
    methods: {
        createGame() {
            axios.post(baseURL + '/api/games', {}, { headers })
                .then((response) => {
                    console.log("Partie créée : ", response.data);
                    this.$router.push({ name: 'game', params: { id: response.data.id } });
                })
                .catch((error) => {
                    console.error("Erreur lors de la création de la partie", error);
                    alert("Impossible de créer une partie.");
                });
        }
    }
}
</script>

<template>
    <div>
        <nav>
            <button @click="createGame">Jouer</button>
            <router-link to="/profile">Editer le profil</router-link>
            <router-link to="join">Rejoindre une partie</router-link>
        </nav>
    </div>
</template>