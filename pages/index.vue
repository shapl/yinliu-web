<template>
  <h1>{{ title }}</h1>
</template>

<script>
export default {
    head() {
        return {
            title: '在线引流',
            meta: [
                {
                    name: 'description',
                    content: 'My custom description'
                },
                {
                    name: 'keyword',
                    content: 'My custom keyword'
                }
            ]
        }
    },
    data() {
        return {
            title: 'Hello World!'
        }
    },
}
</script>