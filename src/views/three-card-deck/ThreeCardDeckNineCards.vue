<template>
  <div v-for="(card, index) in cards" :key="index" class="nine-cards" @click="handleCardClick(card)">
    <img
      src="../../assets/tarot-cards/tarot_cover.png"
      alt="Card face down"
      class="tarot-card"
      :class="{
        'pulsate-animation': !selectedCards.includes(card) && selectedCards.length < 3,
        'hidden-card': selectedCards.includes(card),
        'no-pointer-events': selectedCards.length === 3
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

// Directly define props without assigning them to a variable if not used
defineProps<{
  cards: Array<any>, // Replace 'any' with your card type
  selectedCards: Array<any> // Replace 'any' with your card type
}>();

const emit = defineEmits(['cardSelected']);

function handleCardClick(card: any) { // Replace 'any' with your card type
  emit('cardSelected', card);
}
</script>


<style scoped>

.nine-cards {
    display: flex;
    align-items: center;
    justify-content: center;
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

.hidden-card {
  opacity: 0;
  pointer-events: none;
}

.no-pointer-events {
  pointer-events: none;
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
