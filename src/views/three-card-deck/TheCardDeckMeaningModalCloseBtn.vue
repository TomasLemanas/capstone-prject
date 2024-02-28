<template>
  <div class="meaning-modal-close-btn-wrap">
    <img
      class="meaning-modal-close-btn"
      @click="emitClose"
      src="../../assets/close.png"
      alt="close button"
    />
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';

const emit = defineEmits(['closeModal']);

function emitClose() {
  emit('closeModal');
}
</script>

<style scoped>

</style>
