<script>
import { reactive } from 'vue'
import { baseURL, headers } from '@/api/index'
import axios from 'axios'

export default {

    setup() {
        
        const User = reactive({
            id: sessionStorage.getItem("user_id") || "",
            uname: sessionStorage.getItem("user_name") || "",
            email: sessionStorage.getItem("user_email") || ""
        })

        function updateUser() {
            axios.put(baseURL+"/api/profile", {name: User.uname, email: User.email}, {headers: headers})
            .then((response) => {
                console.log(response)
                alert("Profil mis à jour !")
            })
            .catch((error) => {
                console.log(error)
                alert("Erreur lors de la mise à jour")
            })
        }

        return {
            User,
            updateUser
        }
    },

    beforeRouteEnter(to, from, next) {
        axios.get(baseURL + "/api/profile", {headers: headers})
        .then(response => {
            next(vm => {
                vm.User.id = response.data.id
                vm.User.uname = response.data.name
                vm.User.email = response.data.email
            })
        })
        .catch(error => {
            console.log(error)
            alert("Erreur lors de la récupération du profil")
            next();
        })
    }

}


</script>

<template>
    <h1>Profil</h1>
    <h3>Modifier le nom</h3>
    <input type="text" v-model="User.uname" :placeholder="User.uname">
    <h3>Modifier l'adresse mail</h3>
    <input type="email" v-model="User.email" :placeholder="User.email">
    <button @click="updateUser">Modifier</button>
</template>