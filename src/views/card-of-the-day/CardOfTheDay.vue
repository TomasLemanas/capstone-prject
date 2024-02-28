<template>
  <main class="container py-4" id="home-wrap">
    <h1 id="card-of-the-day-title">Card Of The Day</h1>
    <div class="card-of-the-day-button-wrap">
      <p class="instructions">{{ getInstructionText() }}</p>
    </div>
    <div class="container">
      <div class="cards-of-the-day-wrap">
        <div class="row justify-content-center my-3">
          <CardOfTheDayDeck :deckClickable="deckClickable" @drawCards="drawCards" />
        </div>
        <div class="row justify-content-center my-3">
          <CardOfTheDayTarotCard
            v-for="(card, index) in cards"
            :key="index"
            :card="card"
            :coverCardImage="coverCardImage"
            :pulsate="!cardSelected"
            @selectCard="selectCard"
          />
        </div>
        <div class="row justify-content-center my-3" v-if="selectedCard">
          <div class="col-auto">
            <CardOfTheDaySelectedCard
              :card="selectedCard"
              :pulsateAnimation="!showModal"
              :noPointerEvents="showModal"
              @cardSelected="selectCard"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="card-of-the-day-button-wrap">
      <p class="instructions">{{ getInstructionText() }}</p>
    </div>
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <CardOfTheDayCloseBtn @close="closeModal" />
        <h2 class="modal-title">{{ selectedCard ? selectedCard.name : 'Card Details' }}</h2>
        <div class="container modal-inner-content">
          <div v-if="selectedCard" class="image-and-text">
            <img class="modal-card-image" :src="selectedCard.image" :alt="selectedCard.name" />
            <p>{{ selectedCard.cardOfTheDayPrediction }}</p>
          </div>
          <div>
            <SaveAndCloseBtn @saveAndClose="saveAndClose" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import CardOfTheDayDeck from './CardOfTheDayDeck.vue'
import CardOfTheDayTarotCard from './CardOfTheDayTarotCard.vue'
import CardOfTheDayCloseBtn from './CardOfTheDayCloseBtn.vue'
import SaveAndCloseBtn from './SaveAndCloseBtn.vue'
import CardOfTheDaySelectedCard from './CardOfTheDaySelectedCard.vue'
import { initialCards } from '@/components/TarotCards'
import type { Card } from '@/components/TarotCards'
import coverCardImage from '../../assets/tarot-cards/tarot_cover.png'


const cardsDrawn = ref(false)
const cards: Ref<Card[]> = ref([])
const selectedCard: Ref<Card | null> = ref(null)
const showModal: Ref<boolean> = ref(false)
const deckClickable = ref(true)
const cardSelected = ref(false)
const chatGptResponse: Ref<string | null> = ref(null)


function drawCards() {
  if (!deckClickable.value) return
  const shuffled = initialCards.sort(() => 0.5 - Math.random())
  cards.value = shuffled.slice(0, 3)
  cardsDrawn.value = true
  deckClickable.value = false
}

function selectCard(card: Card): void {
  if (selectedCard.value && card.id === selectedCard.value.id) {
    showModal.value = true
  } else {
    selectedCard.value = card
    cardSelected.value = true
  }
}

function closeModal() {
  showModal.value = false
  chatGptResponse.value = null
  cardsDrawn.value = false
  cardSelected.value = false
  selectedCard.value = null
  deckClickable.value = true
  cards.value = []
}

function saveAndClose() {
  if (selectedCard.value) {
    const currentReadings = JSON.parse(localStorage.getItem('cardOfTheDayReadings') || '[]')
    const newReading = {
      time: new Date().toISOString(),
      card: {
        id: selectedCard.value.id,
        name: selectedCard.value.name,
        prediction: selectedCard.value.cardOfTheDayPrediction
      }
    }
    currentReadings.push(newReading)
    localStorage.setItem('cardOfTheDayReadings', JSON.stringify(currentReadings))
    closeModal()
  }
}

function getInstructionText() {
  if (cardSelected.value && !showModal.value) {
    return 'Click the selected card to reveal your day'
  } else if (cardSelected.value && showModal.value) {
    return 'Click the selected card to reveal your day'
  } else if (cardsDrawn.value && !cardSelected.value) {
    return 'Pick one card'
  } else {
    return 'Click the top card deck to see your future.'
  }
}
</script>
