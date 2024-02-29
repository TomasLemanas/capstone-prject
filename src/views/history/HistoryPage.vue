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
          <button class="remove-btn" @click.stop="handleRemoveThreeCardDeckReading(reading.id)">Remove</button>
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
          <button class="remove-btn" @click.stop="handleRemoveCardOfTheDayReading(reading.time)">Remove</button>
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
import type {
  CardOfTheDayReading,
  ThreeCardReadings
  } from './HistoryPage'
import {
  formatDate,
  loadReadings,
  removeThreeCardDeckReading,
  removeCardOfTheDayReading
} from './HistoryPage';


const threeCardDeckReadings = ref<ThreeCardReadings[]>([]);
const cardOfTheDayReadings = ref<CardOfTheDayReading[]>([]);
const expandedReadingId = ref<string | null>(null);
const expandedCardOfTheDay = ref<string | null>(null);

onMounted(() => {
  loadReadings({
    threeCardDeckReadings,
    cardOfTheDayReadings,
    localStorage,
  });
});

onMounted(() => {
  const storedReadings = localStorage.getItem('threeCardDeckReadings');
  if (storedReadings) {
    threeCardDeckReadings.value = JSON.parse(storedReadings);
  }
});

function handleRemoveThreeCardDeckReading(id: string) {
  removeThreeCardDeckReading(threeCardDeckReadings, id);
}

function handleRemoveCardOfTheDayReading(time: string) {
  removeCardOfTheDayReading(cardOfTheDayReadings, time);
}

function toggleExpanded(id: string) {
  expandedReadingId.value = expandedReadingId.value === id ? null : id;
}

function toggleCardOfTheDay(time: string) {
  expandedCardOfTheDay.value = expandedCardOfTheDay.value === time ? null : time;
}


</script>