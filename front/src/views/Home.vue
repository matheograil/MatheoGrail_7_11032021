<template>
    <div class='home'>
        <h2 class='home__title'>Bienvenue,</h2>
        <h3 class='home__title'>Commencez par publier un message !</h3>
        <div class='form'>
            <div class='form__status' v-if="requestStatus === 'success'">✅ Message publié !</div>
            <div class='form__status' v-else-if="requestStatus === 'failure'">❌ Informations incorrectes.</div>
            <div class='form__inputs'>
                <textarea class='form__input' v-model='content' placeholder='Message public' rows='10'></textarea>
                <input type='file' accept='image/png, image/jpeg, image/jpg' v-on:change='processImage($event)'>
            </div>
            <a class='btn btn-success' v-on:click='publish' type='button'>Publier</a>
        </div>
        <hr>
        <h3 class='home__title'>Et voici les derniers messages publiés :</h3>
    </div>
</template>

<script>
    import globalMixins from '../mixins/Global'

    const authorizationToken = localStorage.getItem('authorizationToken'),
    userId = localStorage.getItem('userId')

    export default {
        data: function () {
            return {
                content: null,
                requestStatus: null
            }
        },
        mixins: [globalMixins],
        created: function () {
            // On vérifie que l'utilisateur est connecté.
            if (this.isUserConnected === false) {
                // Redirection.
                window.location.href = '/'
            }
        },
        methods: {
            publish() {
                // Déclaration des variables.
                const content = this.content

                // Vérification des variables.
                if (!content || typeof content !== 'string' || content.length > 3000) {
                    return this.requestStatus = 'failure'
                } else if (this.image) {
                    if (this.image.size > 5000000 || (this.image.type !== 'image/jpeg' && this.image.type !== 'image/jpg' && this.image.type !== 'image/png')) {
                        return this.requestStatus = 'failure'
                    }
                }

                // Utilisation de l'API.
                let requestOptions
                if (this.image) {
                    const formData = new FormData()
                    formData.append('image', this.image)
                    formData.append('content', content)
                    requestOptions = {
                        method: 'POST',
                        headers: { 'authorization_token': authorizationToken, 'user_id': userId },
                        body: formData
                    }
                } else {
                    requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'authorization_token': authorizationToken, 'user_id': userId },
                        body: JSON.stringify({ content: content })
                    }
                }
                fetch('http://localhost:3000/api/messages', requestOptions).then(response => {
                    if (response.status === 200) {
                        // Nettoyage du formulaire.
                        this.content = null
                        
                        return this.requestStatus = 'success'
                    }
                    this.requestStatus = 'failure'
                }).catch(() => {
                    this.requestStatus = 'failure'
                })
            },
            processImage(event) {
                this.image = event.target.files[0]
            }
        }
    }
</script>
