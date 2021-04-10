<template>
    <div class='message'>
        <h2 class='message__title'>Message</h2>
        <div v-if='isInProgress === null'>
            <h3 class='message__title'>Voici le message sélectionné :</h3>
            <div class='messages'>
                <div class='messages__content'>
                    <div class='messages__more'>Publié par <strong><a v-bind:href='userProfile'>{{ author }}</a></strong> le {{ timestamp }} →</div>
                    {{ messageContent }}
                    <img class='messages__img' v-if='imageUrl' v-bind:src='imageUrl'/>
                    <a class='btn btn-primary' v-if='authorId == userId' v-on:click='isInProgress = 1'>Modifier</a>
                    <a class='btn btn-error' v-if='authorId == userId || isAdmin' v-on:click='removeMessage'>Supprimer</a>
                </div>
            </div>
            <h3 class='message__title'>Publiez un nouveau commentaire !</h3>
            <div class='form'>
                <div class='form__status' v-if="requestStatusPublishComment === 'success'">✅ Commentaire publié !</div>
                <div class='form__status' v-else-if="requestStatusPublishComment === 'failure'">❌ Informations incorrectes.</div>
                <div class='form__inputs'>
                    <textarea class='form__input' v-model='contentComment' placeholder='Commentaire' rows='5'></textarea>
                </div>
                <a class='btn btn-success' v-on:click='publishComment'>Publier</a>
            </div>
            <h3 class='message__title' v-if='comments && comments.length > 0' >Voici les derniers commentaires publiés :</h3>
            <div class='messages' v-for='comment in comments' v-bind:key='comment.id'>
                <div class='messages__content'>
                    <div class='messages__more'>Publié par <strong><a v-bind:href='comment.userProfile'>{{ comment.author }}</a></strong> le {{ comment.timestamp }} →</div>
                    {{ comment.content }}
                    <a class='btn btn-error' v-if='userId == comment.userId || isAdmin' v-on:click='removeComment(comment.id)'>Supprimer</a>
                </div>
            </div>
        </div>
        <div v-else>
            <h3 class='message__title'>Modifiez votre message !</h3>
            <div class='form'>
                <div class='form__status' v-if="requestStatuseditMessage === 'success'">✅ Message modifié, redirection dans quelques instants !</div>
                <div class='form__status' v-else-if="requestStatuseditMessage === 'failure'">❌ Informations incorrectes.</div>
                <div class='form__inputs'>
                    <textarea class='form__input' v-model='messageContent' placeholder='Message public' rows='10'></textarea>
                    <input type='file' id='file' accept='image/png, image/jpeg, image/jpg' v-on:change='processImage($event)'>
                </div>
                <a class='btn btn-success' v-on:click='editMessage'>Modifier</a>
                <a class='btn btn-primary' v-on:click='isInProgress = null'>Retour</a>
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
                userProfile: null,
                timestamp: null,
                messageContent: null,
                contentComment: null,
                imageUrl: null,
                authorId: null,
                isAdmin: null,
                isInProgress: null,
                requestStatuseditMessage: null,
                requestStatusPublishComment: null,
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
                            this.authorId = message.userId
                            this.timestamp = this.timeConverter(message.timestamp)
                            this.messageContent = message.content
                            this.imageUrl = message.imageUrl
                            this.userProfile = `/profile/${message.userId}`
                            this.getUserData(message.userId).then(user => {
                                this.author = user.firstName + ' ' + user.lastName
                            })
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
                fetch('http://localhost:3000/api/messages', requestOptions).then(response => response.json())
                    .then(messages => {
                        if (!messages.error) {
                            return this.loop(messages).then(messages => {
                                return this.messages = messages
                            })
                        }
                        this.logout()
                    }).catch(() => {
                        this.logout()
                    })

                fetch(`http://localhost:3000/api/comments/${this.$route.params.id}`, requestOptions).then(response => response.json())
                    .then(comments => {
                        if (!comments.error) {
                            return this.loop(comments).then(comments => {
                                return this.comments = comments
                            })
                        }
                        this.logout()
                    }).catch(() => {
                        this.logout()
                    })
            },
            // Suppression du message et de ses commentaires.
            removeMessage() {
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
            // Suppression d'un commentaire
            removeComment(id) {
                const requestOptions = {
                    method: 'DELETE',
                    headers: { 'authorization_token': this.authorizationToken, 'user_id': this.userId }
                }
                fetch(`http://localhost:3000/api/comments/${id}`, requestOptions).then(response => {
                    if (response.status === 200) {
                        return this.getComments()
                    }
                    this.logout()
                }).catch(() => {
                    this.logout()
                })
            },
            // Modification d'un message.
            editMessage() {
                const content = this.messageContent
                if (!content || typeof content !== 'string' || content.length > 3000) {
                    return this.requestStatuseditMessage = 'failure'
                } else if (this.image) {
                    if (this.image.size > 5000000 || (this.image.type !== 'image/jpeg' && this.image.type !== 'image/jpg' && this.image.type !== 'image/png')) {
                        return this.requestStatuseditMessage = 'failure'
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
                        this.messageContent = null
                        this.getMessage()
                        if (this.image) {
                            document.getElementById('file').value = null
                        }
                        setTimeout(() => {
                            this.isInProgress = null
                            this.requestStatuseditMessage = null
                        }, 3000)
                        return this.requestStatuseditMessage = 'success'
                    }
                    this.requestStatuseditMessage = 'failure'
                }).catch(() => {
                    this.requestStatuseditMessage = 'failure'
                })
            },
            // Publication d'un commentaire.
            publishComment() {
                const content = this.contentComment
                if (!content || typeof content !== 'string' || content.length > 3000) {
                    return this.requestStatusPublishComment = 'failure'
                }
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'authorization_token': this.authorizationToken, 'user_id': this.userId },
                    body: JSON.stringify({ linkedMessage: this.$route.params.id, content: content })
                }
                fetch('http://localhost:3000/api/comments', requestOptions).then(response => {
                    if (response.status === 200) {
                        this.contentComment = null
                        this.getComments()
                        return this.requestStatusPublishComment = 'success'
                    }
                    this.requestStatusPublishComment = 'failure'
                }).catch(() => {
                    this.requestStatusPublishComment = 'failure'
                })
            }
        }
    }
</script>
