<script>
    export default {
        // Variables globales.
        data: function () {
            return {
                emailRegex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                authorizationToken: localStorage.getItem('authorizationToken'),
                userId: localStorage.getItem('userId')
            }
        },
        methods: {
            // Permet de savoir si un utilisateur est connecté.
            isUserConnected() {
                if (!this.userId || !this.authorizationToken) {
                    return false
                }
            },
            // Permet de déconnecter un utilisateur.
            logout() {
                localStorage.clear()
                window.location.href = '/'
            },
            // Permet de rendre un timestamp compréhensible.
            timeConverter(UNIX_timestamp) {
                let start = new Date(UNIX_timestamp * 1000)
                let months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
                let year = start.getFullYear()
                let month = months[start.getMonth()]
                let date = start.getDate()
                let hour = start.getHours()
                let min = start.getMinutes()
                let time = date + ' ' + month + ' ' + year + ' à ' + hour + ':' + min
                return time
            },
            // Retourne les données d'un utilisateur.
            getUserData(userId) {
                const requestOptions = {
                    method: 'GET',
                    headers: { 'authorization_token': this.authorizationToken, 'user_id': this.userId }
                }
                return fetch(`http://localhost:3000/api/accounts/details/${userId}`, requestOptions).then(response => response.json())
                    .then(user => {
                        if (!user.error) {
                            return user
                        }
                        console.log('Erreur lors de la récupération des données.')
                    }).catch(() => {
                        console.log('Erreur lors de la récupération des données.')
                    })
            }
        }
    }
</script>
