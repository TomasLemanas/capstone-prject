<template>
  <button class="submit-btn" @click="handleClick">Submit Question</button>
</template>

<script setup lang="ts">
const emit = defineEmits(['submitQuestion']);

function handleClick() {
  emit('submitQuestion');
}
</script>

<style scoped>
.submit-btn {
  margin-top: 20px;
  border-radius: 2rem;
  padding: 10px 30px 10px;
  color: white;
  background-color: red;
  border-style: none;
}
</style>
