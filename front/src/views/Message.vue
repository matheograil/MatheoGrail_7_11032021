<template>
    <div class='message'>
        <h2 class='message__title'>Message</h2>
        <div v-if='!selectedMessage && !selectedComment'>
            <h3 class='message__title'>Voici le message sélectionné :</h3>
            <div class='messages'>
                <div class='messages__content'>
                    <div class='messages__more'>Publié par <strong><a v-bind:href='messageUserProfile'>{{ messageAuthor }}</a></strong> le {{ messageDate }} →</div>
                    {{ messageContent }}
                    <img class='messages__img' v-if='messageImageUrl' v-bind:src='messageImageUrl'/>
                    <a class='btn btn-primary' v-if='messageAuthorId == userId' v-on:click='selectedMessage = true'>Modifier</a>
                    <a class='btn btn-error' v-if='messageAuthorId == userId || isAdmin' v-on:click='removeMessage'>Supprimer</a>
                </div>
            </div>
            <h3 class='message__title'>Publiez un nouveau commentaire !</h3>
            <div class='form'>
                <div class='form__status' v-if="requestStatusPublishComment === 'success'">✅ Commentaire publié !</div>
                <div class='form__status' v-else-if="requestStatusPublishComment === 'failure'">❌ Informations incorrectes.</div>
                <div class='form__inputs'>
                    <textarea class='form__input' v-model='commentContent' placeholder='Commentaire' rows='5'></textarea>
                </div>
                <a class='btn btn-success' v-on:click='publishComment'>Publier</a>
            </div>
            <h3 class='message__title' v-if='comments && comments.length > 0' >Voici les derniers commentaires publiés :</h3>
            <div class='messages' v-for='comment in comments' v-bind:key='comment.id'>
                <div class='messages__content'>
                    <div class='messages__more'>Publié par <strong><a v-bind:href='comment.profileUrl'>{{ comment.author }}</a></strong> le {{ comment.date }} →</div>
                    {{ comment.content }}
                    <a class='btn btn-primary' v-if='userId == comment.userId' v-on:click='selectedComment = comment.id, selectedCommentContent = comment.content'>Modifier</a>
                    <a class='btn btn-error' v-if='userId == comment.userId || isAdmin' v-on:click='removeComment(comment.id)'>Supprimer</a>
                </div>
            </div>
        </div>
        <div v-else-if='selectedMessage'>
            <h3 class='message__title'>Modifiez votre message !</h3>
            <div class='form'>
                <div class='form__status' v-if="requestStatuseditMessage === 'success'">✅ Message modifié, redirection dans quelques instants !</div>
                <div class='form__status' v-else-if="requestStatuseditMessage === 'failure'">❌ Informations incorrectes.</div>
                <div class='form__inputs'>
                    <textarea class='form__input' v-model='messageContent' placeholder='Message public' rows='10'></textarea>
                    <input type='file' id='file' accept='image/png, image/jpeg, image/jpg' v-on:change='processImage($event)'>
                </div>
                <a class='btn btn-success' v-on:click='editMessage'>Modifier</a>
                <a class='btn btn-primary' v-on:click='selectedMessage = null'>Retour</a>
            </div>
        </div>
        <div v-else-if='selectedComment'>
            <h3 class='message__title'>Modifiez votre commentaire !</h3>
            <div class='form'>
                <div class='form__status' v-if="requestStatusEditComment === 'success'">✅ Commentaire modifié, redirection dans quelques instants !</div>
                <div class='form__status' v-else-if="requestStatusEditComment === 'failure'">❌ Informations incorrectes.</div>
                <div class='form__inputs'>
                    <textarea class='form__input' v-model='selectedCommentContent' placeholder='Commentaire' rows='5'></textarea>
                </div>
                <a class='btn btn-success' v-on:click='editComment'>Modifier</a>
                <a class='btn btn-primary' v-on:click='selectedComment = null'>Retour</a>
            </div>
        </div>
    </div>
</template>

<script>
    import globalMixins from '../mixins/Global'

    export default {
        data: function () {
            return {
                messageAuthor: null,
                messageUserProfile: null,
                messageDate: null,
                messageContent: null,
                messageImageUrl: null,
                messageAuthorId: null,
                isAdmin: null,
                requestStatuseditMessage: null,
                requestStatusPublishComment: null,
                requestStatusEditComment: null,
                commentContent: null,
                comments: null,
                selectedMessage: null,
                selectedComment: null,
                selectedCommentContent: null
            }
        },
        mixins: [globalMixins],
        created: function () {
            // On vérifie que l'utilisateur est connecté.
            if (this.isUserConnected() === false) {
                return this.$router.push('/')
            }
            // Récupération du message.
            this.getMessage()
            // Récupération des commentaires.
            this.getComments()
            // L'utilisateur est-il administrateur ?
            this.getUserData(this.userId).then(user => {
                if (user.isAdmin) {
                    this.isAdmin = true
                }
            })
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
                            this.messageAuthorId = message.userId
                            this.messageDate = this.timeConverter(message.timestamp)
                            this.messageContent = message.content
                            this.messageImageUrl = message.imageUrl
                            this.messageUserProfile = `/profile/${message.userId}`
                            return this.getUserData(message.userId).then(user => {
                                this.messageAuthor = user.firstName + ' ' + user.lastName
                            })
                        }
                        console.log("Une erreur s'est produite.")
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
                            return this.loopUserData(comments).then(comments => {
                                this.comments = comments
                            })
                        }
                        console.log("Une erreur s'est produite.")
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
                    console.log("Une erreur s'est produite.")
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
                    console.log("Une erreur s'est produite.")
                })
            },
            // Modification d'un message.
            editMessage() {
                const content = this.messageContent,
                image = this.image
                if (!content || typeof content !== 'string' || content.length > 3000) {
                    return this.requestStatuseditMessage = 'failure'
                } else if (image) {
                    if (image.size > 5000000 || (image.type !== 'image/jpeg' && image.type !== 'image/jpg' && image.type !== 'image/png')) {
                        return this.requestStatuseditMessage = 'failure'
                    }
                }
                let requestOptions
                if (image) {
                    const formData = new FormData()
                    formData.append('image', image)
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
                        if (image) {
                            document.getElementById('file').value = null
                        }
                        setTimeout(() => {
                            this.selectedMessage = null
                            this.requestStatuseditMessage = null
                        }, 3000)
                        return this.requestStatuseditMessage = 'success'
                    }
                    this.requestStatuseditMessage = 'failure'
                })
            },
            // Publication d'un commentaire.
            publishComment() {
                const content = this.commentContent
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
                        this.commentContent = null
                        this.getComments()
                        return this.requestStatusPublishComment = 'success'
                    }
                    this.requestStatusPublishComment = 'failure'
                })
            },
            // Modification d'un commentaire.
            editComment() {
                const id = this.selectedComment,
                content = this.selectedCommentContent
                if (!content || typeof content !== 'string' || content.length > 3000) {
                    return this.requestStatusPublishComment = 'failure'
                }
                const requestOptions = {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'authorization_token': this.authorizationToken, 'user_id': this.userId },
                    body: JSON.stringify({ content: content })
                }
                fetch(`http://localhost:3000/api/comments/${id}`, requestOptions).then(response => {
                    if (response.status === 200) {
                        this.selectedCommentContent = null
                        this.getComments()
                        setTimeout(() => {
                            this.selectedComment = null
                            this.requestStatusEditComment = null
                        }, 3000)
                        return this.requestStatusEditComment = 'success'
                    }
                    this.requestStatusEditComment = 'failure'
                })
            }
        }
    }
</script>
