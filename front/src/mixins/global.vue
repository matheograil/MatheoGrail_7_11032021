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
            getUserDataFunction(userId) {
                // Utilisation de l'API afin d'afficher les informations personnelles.
                const requestOptions = {
                    method: 'GET',
                    headers: { 'authorization_token': localStorage.getItem('authorizationToken'), 'user_id': localStorage.getItem('userId') }
                }
                fetch(`http://localhost:3000/api/accounts/details/${userId}`, requestOptions).then(response => response.json())
                    .then(data => {
                        if (!data.error) {
                            if (data.isAdmin === 1) {
                                data.isAdmin = 'Administrateur'
                            } else {
                                data.isAdmin = 'Utilisateur'
                            }
                            if (data.isDisabled === 1) {
                                data.isDisabled = 'Désactivé'
                            } else {
                                data.isDisabled = 'Activé'
                            }
                            return this.getUserData = data
                        }
                        console.log('Erreur lors de la récupération des données.')
                    }).catch(() => {
                        console.log('Erreur lors de la récupération des données.')
                    })
            }
        }
    }
</script>
