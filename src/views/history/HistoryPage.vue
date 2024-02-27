<template>
  <div class="container">
  <div class="history-page">
    <h2>Reading History</h2>
    <section class="history-section">
  <h3>Three Card Deck Readings</h3>
  <div class="question-history-wrap">
    <div class="question-history" v-for="(reading, index) in threeCardDeckReadings" :key="'three-' + index">
      <div @click="toggleExpanded(reading.id)" class="toggle-wrapper">
        <p>{{ reading.questionName }}</p>
        <span class="expand-icon">{{ expandedReadingId === reading.id ? '-' : '+' }}</span>
      </div>
      <div v-if="expandedReadingId === reading.id">
        <p>Question: {{ reading.question }}</p>
        <p>Past: {{ reading.cards.past?.name }} - {{ reading.cards.past?.description }}</p>
        <p>Present: {{ reading.cards.present?.name }} - {{ reading.cards.present?.description }}</p>
        <p>Future: {{ reading.cards.future?.name }} - {{ reading.cards.future?.description }}</p>
        <div class="remove-btn-wrap">
          <button class="remove-btn" @click.stop="removeThreeCardDeckReading(reading.id)">Remove</button>
        </div>
      </div>
    </div>
  </div>
</section>
    <section class="history-section" id="card-of-the-day-section">
  <h3>Card of the Day Readings</h3>
  <div class="question-history-wrap">
    <div class="question-history" v-for="(reading, index) in cardOfTheDayReadings" :key="'day-' + index">
      <div @click="toggleCardOfTheDay(reading.time)" class="toggle-wrapper">
        <p>{{ formatDate(reading.time) }}</p>
        <span class="expand-icon">{{ expandedCardOfTheDay === reading.time ? '-' : '+' }}</span>
      </div>
      <div v-if="expandedCardOfTheDay === reading.time">
        <p>{{ reading.card.name }} - {{ reading.card.prediction }}</p>
        <div class="remove-btn-wrap">
          <button class="remove-btn" @click.stop="removeCardOfTheDayReading(reading.time)">Remove</button>
        </div>
      </div>
    </div>
  </div>
</section>
  </div>
  </div>
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue';

interface Card {
  name: string;
  description: string;
  prediction: string;
}

interface CardOfTheDay extends Card {
  prediction: string;
}

interface CardOfTheDayReading {
  time: string;
  card: CardOfTheDay;
}

interface ThreeCardReadings {
  id: string;
  question: string;
  questionName: string;
  cards: {
    past: CardReading | null;
    present: CardReading | null;
    future: CardReading | null;
  };
}

interface CardReading {
  name: string;
  description: string;
}

const threeCardDeckReadings = ref<ThreeCardReadings[]>([]);
const cardOfTheDayReadings = ref<CardOfTheDayReading[]>([]);
const expandedReadingId = ref<string | null>(null);
const expandedCardOfTheDay = ref<string | null>(null);

function loadReadings() {
  const savedThreeCardReadings = localStorage.getItem('threeCardDeckReadings');
  if (savedThreeCardReadings) {
    threeCardDeckReadings.value = JSON.parse(savedThreeCardReadings);
  }

  const savedCardOfTheDayReadings = localStorage.getItem('cardOfTheDayReadings');
  if (savedCardOfTheDayReadings) {
    cardOfTheDayReadings.value = JSON.parse(savedCardOfTheDayReadings);
  }
}
onMounted(loadReadings);

function removeThreeCardDeckReading(id: string) {
  threeCardDeckReadings.value = threeCardDeckReadings.value.filter(reading => reading.id !== id);
  localStorage.setItem('threeCardDeckReadings', JSON.stringify(threeCardDeckReadings.value));
}

function removeCardOfTheDayReading(time: string) {
  cardOfTheDayReadings.value = cardOfTheDayReadings.value.filter(reading => reading.time !== time);
  localStorage.setItem('cardOfTheDayReadings', JSON.stringify(cardOfTheDayReadings.value));
}

function toggleExpanded(id: string) {
  expandedReadingId.value = expandedReadingId.value === id ? null : id;
}

function toggleCardOfTheDay(time: string) {
  expandedCardOfTheDay.value = expandedCardOfTheDay.value === time ? null : time;
}

function formatDate(time: string) {
  return new Date(time).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
}

</script>