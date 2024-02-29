import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { handleQuestionSubmit, getInstructionText } from './ThreeCardDeck'
import type { Card } from '@/components/TarotCards'

describe('handleQuestionSubmit', () => {
  it('should update states correctly on valid question submission', () => {
    const userQuestion = ref('')
    const showQuestionModal = ref(true)
    const showCards = ref(false)
    const cardsToDisplay = ref<Card[]>([])
    const initialCards = [
      {
        id: 1,
        name: 'Card 1',
        image: 'image1.png',
        past: 'past1',
        present: 'present1',
        future: 'future1',
        cardOfTheDayPrediction: 'prediction1'
      },
      {
        id: 2,
        name: 'Card 2',
        image: 'image2.png',
        past: 'past2',
        present: 'present2',
        future: 'future2',
        cardOfTheDayPrediction: 'prediction2'
      },
      {
        id: 3,
        name: 'Card 3',
        image: 'image3.png',
        past: 'past3',
        present: 'present3',
        future: 'future3',
        cardOfTheDayPrediction: 'prediction3'
      },
      {
        id: 4,
        name: 'Card 4',
        image: 'image4.png',
        past: 'past4',
        present: 'present4',
        future: 'future4',
        cardOfTheDayPrediction: 'prediction4'
      },
      {
        id: 5,
        name: 'Card 5',
        image: 'image5.png',
        past: 'past5',
        present: 'present5',
        future: 'future5',
        cardOfTheDayPrediction: 'prediction5'
      }
    ]

    userQuestion.value = 'Test question?'
    handleQuestionSubmit(userQuestion, showQuestionModal, showCards, cardsToDisplay, initialCards)

    expect(showQuestionModal.value).toBe(false)
    expect(showCards.value).toBe(true)
    expect(cardsToDisplay.value.length).toBeGreaterThan(0)
  })
})

describe('getInstructionText', () => {

  it('returns instruction text for asking a question when isShowQuestionModal is true', () => {
    const result = getInstructionText({
      isShowQuestionModal: true,
      isShowCards: false,
      selectedCardsLength: 0
    })
    expect(result).toBe(
      'Ask a question or focus on what you want to know, then submit to draw cards.'
    )
  })

  it('returns instruction text for selecting cards when isShowCards is true and selectedCardsLength is less than 3', () => {
    const result = getInstructionText({
      isShowQuestionModal: false,
      isShowCards: true,
      selectedCardsLength: 2
    })
    expect(result).toBe('Select three cards to see your past, present, and future.')
  })

  it('returns instruction text for revealing card meanings when selectedCardsLength is 3', () => {
    const result = getInstructionText({
      isShowQuestionModal: false,
      isShowCards: true,
      selectedCardsLength: 3
    })
    expect(result).toBe('Press the button to reveal the meaning of your cards.')
  })

  it('returns default instruction text when none of the conditions are met', () => {
    const result = getInstructionText({
      isShowQuestionModal: false,
      isShowCards: false,
      selectedCardsLength: 0
    })
    expect(result).toBe('Click the top card deck to draw your cards.')
  })
})