<template>
  <img
    class="tarot-card"
    :class="{
      'pulsate-animation': pulsateAnimation,
      'no-pointer-events': noPointerEvents
    }"
    :src="card.image"
    :alt="card.name"
    @click="handleClick"
  />
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  card: {
    type: Object,
    required: true,
  },
  pulsateAnimation: {
    type: Boolean,
    default: false,
  },
  noPointerEvents: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['cardSelected']);

function handleClick() {
  emit('cardSelected', props.card);
}
</script>

<style scoped>

.pulsate-animation {
  animation: pulsate 2s infinite;
}

@keyframes pulsate {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.tarot-card:hover {
  box-shadow: 5px 6px 5px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.no-pointer-events {
  pointer-events: none;
}

@media (min-width: 576px) {
  .tarot-card {
    height: 250px;
  }

}

@media (max-width: 576px) {
  .tarot-card {
    height: 150px;
  }
}

@media (max-width: 360px) {
  .tarot-card {
    height: 100px;
  }
}

</style>
