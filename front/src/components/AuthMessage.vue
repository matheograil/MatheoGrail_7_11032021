<template>
    <div class="authMessage">
        <h2>{{ msg }}</h2>
    </div>
</template>

<script>
    export default {
        name: 'AuthMessage',
        props: {
            msg: String
        }
    }
</script>
