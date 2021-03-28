<template>
    <div class='home'>
        <h2 class='home__title'>Ceci est un accès réservé aux utilisateurs connectés.</h2>
    </div>
</template>

<script>
    if (!JSON.parse(localStorage.getItem('userId')) || !JSON.parse(localStorage.getItem('token'))) {
        window.location.href = '/login'
    }
</script>
