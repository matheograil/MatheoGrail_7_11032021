<script>
    export default {
        created: function () {
            this.isUserConnected()
        },
        methods: {
            isUserConnected() {
                if (!localStorage.getItem('userId') || !localStorage.getItem('authorizationToken')) {
                    this.isUserConnected = false
                }
            },
            logout() {
                // Suppresion de la session.
                localStorage.clear()

                // Redirection.
                window.location.href = '/'
            }
        }
    }
</script>
