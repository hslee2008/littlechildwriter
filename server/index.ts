export default defineNuxtRouteMiddleware((to) => {
    const { params } = to

    const book: string = params.book
    const school: string = params.school
    const local: string = params.local as string


    return `http://152.69.227.191:3000?book=${book}&school=${school}&local=${local}`
})