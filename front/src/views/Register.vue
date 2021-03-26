<template>
    <div class="register">
        <Auth msg="Vous pouvez aussi vous inscrire !"/>
    </div>
</template>

<script>
    import Auth from '@/components/Auth.vue'

    export default {
        name: 'Register',
        components: {
            Auth
        }
    }
</script>
