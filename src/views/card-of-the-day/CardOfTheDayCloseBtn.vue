<template>
  <div @click="emitCloseEvent">
    <img src="../../assets/close.png" alt="close button" class="close-btn" />
  </div>
</template>

<script setup lang="ts">
const emitCloseEvent = () => {
  emit('close');
}

import { defineEmits } from 'vue';
const emit = defineEmits(['close']);
</script>

<style scoped>
.close-btn {
  position: absolute;
  top: -15px;
  right: -15px;
  cursor: pointer;
  width: 40px;
  height: 40px;
}
</style>
