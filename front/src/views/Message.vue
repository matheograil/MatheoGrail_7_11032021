<template>
    <div class='message'>
        <h2 class='message__title'>Message</h2>
        <h3 class='message__title'>Voici le message sélectionné :</h3>
        <div class='messages' v-if='isInProgress === null'>
            <div class='messages__content'>
                <div class='messages__more'>Publié par <strong>{{ author }}</strong> le {{ timestamp }} →</div>
                {{ content }}
                <img class='messages__img' v-if='imageUrl' v-bind:src='imageUrl'/>
                <a class='btn btn-primary' v-if='authorId == this.userId' v-on:click='isInProgress = 1'>Modifier</a>
                <a class='btn btn-error' v-if='authorId == this.userId || isAdmin' v-on:click='remove'>Supprimer</a>
            </div>
        </div>
        <div class='form' v-else>
            <div class='form__status' v-if="requestStatus === 'success'">✅ Message modifié, redirection dans quelques instants !</div>
            <div class='form__status' v-else-if="requestStatus === 'failure'">❌ Informations incorrectes.</div>
            <div class='form__inputs'>
                <textarea class='form__input' v-model='content' placeholder='Message public' rows='10'></textarea>
                <input type='file' id='file' accept='image/png, image/jpeg, image/jpg' v-on:change='processImage($event)'>
            </div>
            <a class='btn btn-success' v-on:click='edit'>Modifier</a>
        </div>
        <h3 class='message__title' v-if='comments && comments.length > 0' >Voici les derniers commentaires publiés :</h3>
        <div class='messages' v-for='comment in comments' v-bind:key='comment.id'>
            <div class='messages__content'>
                <div class='messages__more'>Publié par <strong>{{ comment.author }}</strong> le {{ comment.timestamp }} →</div>
                {{ comment.content }}
            </div>
        </div>
    </div>
</template>

<script>
    import globalMixins from '../mixins/Global'

    export default {
        data: function () {
            return {
                author: null,
                timestamp: null,
                content: null,
                imageUrl: null,
                authorId: null,
                isAdmin: null,
                isInProgress: null,
                requestStatus: null,
                comments: null
            }
        },
        mixins: [globalMixins],
        created: function () {
            // On vérifie que l'utilisateur est connecté.
            if (this.isUserConnected() === false) {
                this.$router.push('/')
            }
            // Récupération du message.
            this.getMessage()
            // Récupération des commentaires.
            this.getComments()
        },
        methods: {
            // Retourne le message.
            getMessage() {
                const requestOptions = {
                    method: 'GET',
                    headers: { 'authorization_token': this.authorizationToken, 'user_id': this.userId }
                }
                fetch(`http://localhost:3000/api/messages/${this.$route.params.id}`, requestOptions).then(response => response.json())
                    .then(message => {
                        if (!message.error) {
                            this.getUserData(message.userId).then(user => {
                                this.author = user.firstName + ' ' + user.lastName
                            })
                            this.authorId = 1
                            this.timestamp = this.timeConverter(message.timestamp)
                            this.content = message.content
                            this.imageUrl = message.imageUrl
                        } else {
                            this.logout()
                        }
                    }).catch(() => {
                        this.logout()
                    })
            },
            // Retourne tous les commentaires.
            getComments() {
                const requestOptions = {
                    method: 'GET',
                    headers: { 'authorization_token': this.authorizationToken, 'user_id': this.userId }
                }
                fetch(`http://localhost:3000/api/comments/${this.$route.params.id}`, requestOptions).then(response => response.json())
                    .then(comments => {
                        if (!comments.error) {
                            let i
                            for (i in comments) {
                                comments[i].timestamp = this.timeConverter(comments[i].timestamp)
                                comments[i].url = `/message/${comments[i].id}`
                                comments[i].author = null
                                this.getUserData(comments[i].userId).then((user) => {
                                    comments[i].author = user.firstName + ' ' + user.lastName
                                })
                            }
                            return this.comments = comments
                        }
                        this.logout()
                    }).catch(() => {
                        this.logout()
                    })
            },
            // Suppression du message et de ses commentaires.
            remove() {
                const requestOptions = {
                    method: 'DELETE',
                    headers: { 'authorization_token': this.authorizationToken, 'user_id': this.userId }
                }
                fetch(`http://localhost:3000/api/messages/${this.$route.params.id}`, requestOptions).then(response => {
                    if (response.status === 200) {
                        return this.$router.push('/home')
                    }
                    this.logout()
                }).catch(() => {
                    this.logout()
                })
            },
            // Modification d'un message.
            edit() {
                const content = this.content
                if (!content || typeof content !== 'string' || content.length > 3000) {
                    return this.requestStatus = 'failure'
                } else if (this.image) {
                    if (this.image.size > 5000000 || (this.image.type !== 'image/jpeg' && this.image.type !== 'image/jpg' && this.image.type !== 'image/png')) {
                        return this.requestStatus = 'failure'
                    }
                }
                let requestOptions
                if (this.image) {
                    const formData = new FormData()
                    formData.append('image', this.image)
                    formData.append('content', content)
                    requestOptions = {
                        method: 'PUT',
                        headers: { 'authorization_token': this.authorizationToken, 'user_id': this.userId },
                        body: formData
                    }
                } else {
                    requestOptions = {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'authorization_token': this.authorizationToken, 'user_id': this.userId },
                        body: JSON.stringify({ content: content })
                    }
                }
                fetch(`http://localhost:3000/api/messages/${this.$route.params.id}`, requestOptions).then(response => {
                    if (response.status === 200) {
                        this.content = null
                        if (this.image) {
                            document.getElementById('file').value = null
                        }
                        setTimeout(() => {
                            this.isInProgress = null
                            this.requestStatus = null
                            this.getMessage()
                        }, 3000)
                        return this.requestStatus = 'success'
                    }
                    this.requestStatus = 'failure'
                }).catch(() => {
                    this.requestStatus = 'failure'
                })
            }
        }
    }
</script>
