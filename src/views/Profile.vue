<script>
import { reactive, ref } from 'vue'
import { baseURL, headers } from '@/api/index'
import axios from 'axios'

export default {

    setup() {
        
        const User = reactive({
            id: sessionStorage.getItem("user_id") || "",
            uname: sessionStorage.getItem("user_name") || "",
            email: sessionStorage.getItem("user_email") || ""
        })

        const errors = ref([])

        function updateUser() {
            errors.value = []
            axios.put(baseURL+"/api/profile", {name: User.uname, email: User.email}, {headers: headers})
            .then((response) => {
                console.log(response)
                alert("Profil mis à jour !")
            })
            .catch((error) => {
                console.log(error)
                if(error.response && error.response.data) {
                    if(error.response.data.errors) {
                        errors.value = Object.values(error.response.data.errors).flat()
                    } else if (error.response.data.message) {
                        errors.value = [error.response.data.message]
                    } else {
                        errors.value = ["Une erreur est survenue lors de la mise à jour."]
                    }
                } else {
                     errors.value = ["Impossible de contacter le serveur."]
                }
            })
        }

        return {
            User,
            updateUser,
            errors
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
    <input type="text" v-model="User.uname">
    <h3>Modifier l'adresse mail</h3>
    <input type="email" v-model="User.email">
    <button @click="updateUser">Modifier</button>
    
    <div v-if="errors.length" style="color: red; margin-top: 20px;">
        <ul>
            <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
    </div>
</template>

<style scoped>
        
</style>