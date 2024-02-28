<template>
  <div class="remove-btn-wrap">
    <button class="remove-btn" @click="handleRemoveClick">Remove</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  onRemoveClick: Function,
  identifier: [String, Number]
});

const emit = defineEmits(['removed']);

const handleRemoveClick = () => {
  if (props.onRemoveClick) {
    props.onRemoveClick(props.identifier);
    emit('removed');
  }
};
</script>

