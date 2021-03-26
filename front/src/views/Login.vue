<template>
    <div class="login">
        <Auth msg="Connectez-vous pour continuer..."/>
    </div>
</template>

<script>
    import Auth from '@/components/Auth.vue'

    export default {
        name: 'Login',
        components: {
            Auth
        }
    }
</script>
