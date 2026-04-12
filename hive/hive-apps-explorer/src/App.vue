<template>
  <div id="app">
    <Header v-if='$route.name!="notFound"'/>
    <router-view/>
  </div>
</template>
<script>
import Header from '@/views/Header.vue'

export default {
  components: {
    Header
  },
  methods: {
    fetchLatestBlock () {
      this.$store.dispatch('fetchLatestBlock')
    }
  },
  created () {
    this.fetchLatestBlock()
  }
}
</script>
<style>
#vote{
  background: #ededee;
  border: none;
  border-bottom: 1px solid #d4d3d3;
  text-align: center;
  border-radius: 0;
  margin: 0;
}
</style>
