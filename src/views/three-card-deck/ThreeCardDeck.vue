<template>
  <main class="container py-4" id="home-wrap">
    <div>
      <h1 id="three-card-deck-title">Three Card Tarot Reading</h1>
      <div class="top-instruction-wrap">
        <p class="instructions">{{ instructionText }}</p>
      </div>
      <div @click="!showCards && drawCardsForThreeCardDeck()">
        <ThreeCardDecTarotkDeck
          :deckDisabled="showCards"
          @deckClicked="drawCardsForThreeCardDeck"
        />
      </div>
    </div>
    <div v-if="showQuestionModal" class="question-modal">
      <div class="question-modal-content">
        <h2>Ask a Question</h2>
        <textarea
          v-model="userQuestion"
          placeholder="What do you want to know?"
          rows="4"
          class="question-text-area"
        ></textarea>
        <ThreeCardSubmitBtn @submitQuestion="submitQuestion" />
      </div>
    </div>
    <div v-if="showCards" class="nine-card-grid">
      <ThreeCardDeckNineCards
        :cards="cardsToDisplay"
        :selectedCards="selectedCards"
        @cardSelected="selectCard"
      />
    </div>
    <div v-if="selectedCards.length" class="selected-cards-display">
      <ThreeCardDeckSelectedCards :selectedCards="selectedCards" />
      <div v-if="selectedCards.length === 3" class="reveal-meanings"></div>
      <div class="reveal-card-meaning-btn-wrap" v-if="selectedCards.length === 3">
        <ThreeCardDeckRevealMeaningsBtn @revealMeanings="revealCardMeaningsInModal" />
      </div>
    </div>
    <div class="instruction-wrap">
      <p class="instructions">{{ instructionText  }}</p>
    </div>
    <div v-if="showCardMeaningsModal" class="meaning-modal-overlay">
      <div class="meaning-modal-content">
        <TheCardDeckMeaningModalCloseBtn @closeModal="handleCloseAndReset" />
        <h2>Card Meanings</h2>
        <div class="card-meaning-wrap">
          <div class="meaning-modal-question">
            <p>Question: {{ userQuestion }}</p>
          </div>
          <div v-for="(card, index) in selectedCards" :key="card.id" class="card-meaning">
            <div class="meaning-modal-image-wrap">
              <img :src="card.image" :alt="card.name" class="tarot-card-modal" />
            </div>
            <div>
              <h3>{{ selectionOrder[index] }}: {{ card.name }}</h3>
              <div class="meaning-in-modal">
                <p v-if="index === 0">{{ card.past }}</p>
                <p v-if="index === 1">{{ card.present }}</p>
                <p v-if="index === 2">{{ card.future }}</p>
              </div>
            </div>
          </div>
          <TheCardDeckSaveAndCloseBtn @saveAndClose="saveReadingAndClose" />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import ThreeCardDecTarotkDeck from './ThreeCardDeckTarotDeck.vue'
import ThreeCardSubmitBtn from './ThreeCardDeckSubmitBtn.vue'
import ThreeCardDeckNineCards from './ThreeCardDeckNineCards.vue'
import ThreeCardDeckSelectedCards from './ThreeCardDeckSelectedCards.vue'
import ThreeCardDeckRevealMeaningsBtn from './ThreeCardDeckRevealMeaningsBtn.vue'
import TheCardDeckMeaningModalCloseBtn from './TheCardDeckMeaningModalCloseBtn.vue'
import TheCardDeckSaveAndCloseBtn from './TheCardDeckSaveAndCloseBtn.vue';
import { initialCards } from '@/components/TarotCards'
import type { Card } from '@/components/TarotCards'
import type { threeCardReadings } from './ThreeCardDeckInterface'
import { handleQuestionSubmit, closeAndReset, getInstructionText  } from './ThreeCardDeck';


const showQuestionModal = ref(false)
const showCards = ref(false)
const userQuestion = ref('')
const selectedCards = ref<Card[]>([])
const selectionOrder = ['Past', 'Present', 'Future']
const showCardMeaningsModal = ref(false)
const cardsToDisplay = ref(
  initialCards.map((card) => ({
    ...card,
    selected: false
  }))
)
const readingsHistory = ref<threeCardReadings[]>([])

const instructionText = computed(() => getInstructionText({
  isShowQuestionModal: showQuestionModal.value,
  isShowCards: showCards.value,
  selectedCardsLength: selectedCards.value.length
}));

function drawCardsForThreeCardDeck() {
  showQuestionModal.value = true
}

const submitQuestion = () => {
  handleQuestionSubmit(userQuestion, showQuestionModal, showCards, cardsToDisplay, initialCards);
};

function selectCard(selectedCard: Card) {
  if (
    selectedCards.value.length < 3 &&
    !selectedCards.value.find((c) => c.id === selectedCard.id)
  ) {
    selectedCards.value.push(selectedCard)
  }
}


function handleCloseAndReset() {
  closeAndReset(
    showCardMeaningsModal,
    showQuestionModal,
    showCards,
    userQuestion,
    selectedCards,
    cardsToDisplay,
    initialCards
  );
}

function revealCardMeaningsInModal() {
  showCardMeaningsModal.value = true
}

function saveReadingAndClose() {
  if (selectedCards.value.length === 3) {
    const currentReading: threeCardReadings = {
      id: `reading-${Date.now()}`,
      question: userQuestion.value,
      questionName: userQuestion.value.substring(0, 20) + '...',
      cards: {
        past: selectedCards.value[0]
          ? { name: selectedCards.value[0].name, description: selectedCards.value[0].past }
          : null,
        present: selectedCards.value[1]
          ? { name: selectedCards.value[1].name, description: selectedCards.value[1].present }
          : null,
        future: selectedCards.value[2]
          ? { name: selectedCards.value[2].name, description: selectedCards.value[2].future }
          : null
      }
    }
    readingsHistory.value.push(currentReading)
  }

  closeAndReset(showCardMeaningsModal,
    showQuestionModal,
    showCards,
    userQuestion,
    selectedCards,
    cardsToDisplay,
    initialCards)
}

watch(
  readingsHistory,
  (newHistory) => {
    localStorage.setItem('threeCardDeckReadings', JSON.stringify(newHistory))
  },
  { deep: true }
)
const storedHistory = localStorage.getItem('threeCardDeckReadings')
if (storedHistory) {
  readingsHistory.value = JSON.parse(storedHistory) as threeCardReadings[]
}
</script>
