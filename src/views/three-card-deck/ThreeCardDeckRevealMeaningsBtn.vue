<template>
  <button class="reveal-card-meaning-btn" @click="emitRevealMeanings">
    Reveal Card Meanings
  </button>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';

const emit = defineEmits(['revealMeanings']);

function emitRevealMeanings() {
  emit('revealMeanings');
}
</script>

<style scoped>
.reveal-card-meaning-btn{
  border-radius: 2rem;
  padding: 10px 30px 10px;
  color: white;
  background-color: red;
  border-style: none;
}
</style>
