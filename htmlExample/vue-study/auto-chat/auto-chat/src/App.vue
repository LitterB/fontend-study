<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  *{
    margin: 0;
    padding: 0;
  }

  #app {
    width: 100%;
    height: 100%;
  }

  ul{
    padding: 0 0 46px 0;
  }

  li{
    padding: 6px 12px;
    list-style: none;
  }
</style>
