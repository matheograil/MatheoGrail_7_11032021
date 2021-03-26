<template>
    <div class="auth">
        <h2>{{ msg }}</h2>
    </div>
</template>

<script>
    export default {
        name: 'Auth',
        props: {
            msg: String
        }
    }
</script>
