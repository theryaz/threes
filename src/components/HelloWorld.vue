<template>
  <div class="hello">
      columns: {{ columns }}
      rows: {{ rows }}
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String,
    columns: Number,
    rows: Number,
  },
  data:() => {
    return{
    }
  }
}
</script>

<style scoped>

</style>
