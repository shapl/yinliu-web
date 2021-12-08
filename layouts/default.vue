<template>
    <div class="layouts">
        <Header></Header>
        <Nuxt />
        <Footer></Footer>
    </div>
</template>

<style lang="less">
body {
    background: #ecedf0 url("@/static/images/page-bg.png");
    background-repeat: repeat;
    min-height: 100vh;
    margin: 0;
}
[v-cloak] {
    display: none !important;
}
</style>