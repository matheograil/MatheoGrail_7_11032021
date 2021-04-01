<script>
    export default {
        created: function () {
            this.isUserConnected()
        },
        methods: {
            isUserConnected() {
                if (!localStorage.getItem('userId') || !localStorage.getItem('authorizationToken')) {
                    return this.isUserConnected = false
                }
            },
            logout() {
                // Suppresion de la session.
                localStorage.clear()

                // Redirection.
                window.location.href = '/'
            },
            getUserData(userId) {
                // Utilisation de l'API afin d'afficher les informations personnelles.
                const requestOptions = {
                    method: 'GET',
                    headers: { 'authorization_token': localStorage.getItem('authorizationToken'), 'user_id': localStorage.getItem('userId') }
                }
                fetch(`http://localhost:3000/api/accounts/details/${userId}`, requestOptions).then(response => response.json())
                    .then(data => {
                        if (!data.error) {
                            // Modification des variables.
                            this.firstName = data.firstName
                            this.lastName = data.lastName
                            this.email = data.email
                            this.description = data.description
                            this.isAdmin = data.isAdmin
                            this.isDisabled = data.isDisabled

                            if (this.isAdmin === 1) {
                                this.isAdmin = 'Administrateur'
                            } else {
                                this.isAdmin = 'Utilisateur'
                            }
                            if (this.isDisabled === 1) {
                                this.isDisabled = 'Désactivé'
                            } else {
                                this.isDisabled = 'Activé'
                            }
                        } else {
                            console.log('Erreur lors de la récupération des données.')
                        }
                    }).catch(() => {
                        console.log('Erreur lors de la récupération des données.')
                    })
            }
        }
    }
</script>
