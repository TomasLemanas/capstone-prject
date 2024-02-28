<template>
  <button class="save-and-close-btn" @click="handleSaveAndClose">
    Save and Close
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits(['saveAndClose']);

const handleSaveAndClose = () => {
  emit('saveAndClose');
};
</script>

<style scoped>
.save-and-close-btn {
  border-radius: 2rem;
  padding: 10px 30px 10px;
  color: white;
  background-color: red;
  border-style: none;
}
</style>
