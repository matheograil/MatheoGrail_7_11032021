<script>
    export default {
        created: function () {
            this.isUserConnected()
        },
        methods: {
            isUserConnected() {
                if (!JSON.parse(localStorage.getItem('userId')) || !JSON.parse(localStorage.getItem('token'))) {
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
