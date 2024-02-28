<template>
  <div class="col-auto">
    <img
      @click="drawCards"
      id="tarot-deck"
      :class="{ 'pulsate-animation': deckClickable,
      'no-pointer-events': !deckClickable }"
      src="@/assets/tarot-cards/tarot_cover.png"
      alt="Tarot card cover"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  deckClickable: Boolean
});
const emit = defineEmits(['drawCards']);

function drawCards() {
  if (props.deckClickable) {
    emit('drawCards');
  }
}
</script>

<style scoped>

#tarot-deck {
  display: inline-block;
  height: 200px;
  border: 2px solid #000;
  border-radius: 10px;
  cursor: pointer;
}

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


.no-pointer-events {
  pointer-events: none;
}

@media (min-width: 576px) {
  #tarot-deck {
    height: 250px;
  }
}

@media (max-width: 576px) {
  #tarot-deck {
    height: 150px;
  }
}


@media (max-width: 360px) {

  #tarot-deck {
    height: 100px;
  }
}
</style>
