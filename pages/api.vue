<template>
    <div>
        <p>Redirecting ...</p>
    </div>
</template>
    
<script>

export default {
    async asyncData(context, {route}) {
        const {book, school, local} = route.params
     
        if (book && school &&   local) {
           context.redirect( `http://152.69.227.191:3000?book=${book}&school=${school}&local=${local}`)
        } else {
            console.log('No parms')
        }
    }
}
</script>