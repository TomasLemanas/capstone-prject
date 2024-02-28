<template>
  <div
    class="deck"
    :class="{ 'deck-disabled': deckDisabled, 'pulsate-animation': !deckDisabled }"
    @click="handleDeckClick"
  >
    <img src="../../assets/tarot-cards/tarot_cover.png" alt="Tarot Deck" class="tarot-card" />
  </div>
</template>

<script setup lang="ts">
const { deckDisabled } = defineProps({
  deckDisabled: Boolean
})

const emit = defineEmits(['deckClicked'])

function handleDeckClick() {
  if (!deckDisabled) {
    emit('deckClicked')
  }
}
</script>

<style scoped>
.deck {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 20px;
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

.deck-disabled {
  pointer-events: none;
}

.tarot-card {
  height: 200px;
  border: 2px solid #000;
  border-radius: 10px;
}
  .tarot-card:hover {
    box-shadow: 5px 6px 5px rgba(0, 0, 0, 0.3);
    cursor: pointer;
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
