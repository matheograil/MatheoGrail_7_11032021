<script>
    export default {
        created: function () {
            this.isUserConnected()
        },
        methods: {
            isUserConnected() {
                if (!JSON.parse(localStorage.getItem('userId')) || !JSON.parse(localStorage.getItem('token'))) {
                    return this.isUserConnected = false
                }
                // Redirection.
                setTimeout(() => {  window.location.href = '/home' }, 2000)
            }
        }
    }
</script>
