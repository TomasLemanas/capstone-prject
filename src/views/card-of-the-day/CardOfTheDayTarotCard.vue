<template>
  <div class="col-auto">
    <img
      v-if="card"
      class="tarot-card"
      :class="{
        'pulsate-animation': pulsate,
        'hidden-card': hidden,
        'no-pointer-events': noPointerEvents
      }"
      :src="imageSource"
      :alt="cardName"
      @click="handleClick"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    card?: {
      id: number
      name: string
      image: string
    }
    coverCardImage?: string
    selectedCard?: {
      id: number
      name: string
      image: string
    }
    pulsate?: boolean
  }>(),
  {
    card: undefined,
    coverCardImage: '',
    selectedCard: undefined,
    pulsate: false
  }
)

const hidden = computed(
  () => props.selectedCard && props.card && props.card.id === props.selectedCard.id
)
const noPointerEvents = computed(
  () => props.selectedCard && props.card && props.card.id === props.selectedCard.id
)
const imageSource = computed(() =>
  props.selectedCard && props.card && props.selectedCard.id === props.card.id
    ? props.card.image
    : props.coverCardImage
)
const cardName = computed(() => (props.card ? props.card.name : ''))

const emit = defineEmits(['selectCard'])

function handleClick() {
  if (props.card && !props.selectedCard) {
    emit('selectCard', props.card);
  }
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

.hidden-card {
  opacity: 0;
  pointer-events: none;
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
