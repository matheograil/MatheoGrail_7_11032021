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
            timeConverter(UNIX_timestamp) {
                let a = new Date(UNIX_timestamp * 1000)
                let months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
                let year = a.getFullYear()
                let month = months[a.getMonth()]
                let date = a.getDate()
                let hour = a.getHours()
                let min = a.getMinutes()
                let time = date + ' ' + month + ' ' + year + ' à ' + hour + ':' + min
                return time
            },
            getUserData(userId) {
                // Utilisation de l'API afin d'afficher les informations personnelles.
                const requestOptions = {
                    method: 'GET',
                    headers: { 'authorization_token': localStorage.getItem('authorizationToken'), 'user_id': localStorage.getItem('userId') }
                }
                return fetch(`http://localhost:3000/api/accounts/details/${userId}`, requestOptions).then(response => response.json())
                    .then(data => {
                        if (!data.error) {
                            return data
                        }
                        console.log('Erreur lors de la récupération des données.')
                    }).catch(() => {
                        console.log('Erreur lors de la récupération des données.')
                    })
            }
        }
    }
</script>
