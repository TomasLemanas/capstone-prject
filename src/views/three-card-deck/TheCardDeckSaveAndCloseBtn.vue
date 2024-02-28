<template>
  <div class="save-and-close-three-card-deck-btn-wrap">
    <button class="save-and-close-three-card-deck-btn" @click="emitSaveAndClose">
      Save and Close
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';

const emit = defineEmits(['saveAndClose']);

function emitSaveAndClose() {
  emit('saveAndClose');
}
</script>

<style scoped>
.save-and-close-three-card-deck-btn-wrap {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.save-and-close-three-card-deck-btn {
  border-radius: 2rem;
  padding: 10px 30px 10px;
  color: white;
  background-color: red;
  border-style: none;
}
</style>
