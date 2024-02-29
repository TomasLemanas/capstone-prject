import { describe, it, expect, beforeEach } from 'vitest'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { Card } from '@/components/TarotCards'
import { drawCards, handleSelectCard, closeModal, getInstructionText } from './CardOfTheDay'

describe('drawCards', () => {
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

  it('returns an empty array if deck is not clickable', () => {
    const result = drawCards(false, initialCards)
    expect(result).toEqual([])
  })

  it('returns 3 cards from the initial cards if deck is clickable', () => {
    const result = drawCards(true, initialCards)
    expect(result.length).toBe(3)
    result.forEach((card) => {
      expect(card).toHaveProperty('id')
      expect(card).toHaveProperty('name')
      expect(card).toHaveProperty('image')
      expect(card).toHaveProperty('past')
      expect(card).toHaveProperty('present')
      expect(card).toHaveProperty('future')
      expect(card).toHaveProperty('cardOfTheDayPrediction')
    })
  })
})

describe('handleSelectCard', () => {
  let selectedCard: Ref<Card | null>, cardSelected: Ref<boolean>, showModal: Ref<boolean>
  beforeEach(() => {
    selectedCard = ref<Card | null>(null)
    cardSelected = ref<boolean>(false)
    showModal = ref<boolean>(false)
  })
  it('selects a card if no card is currently selected', () => {
    const card: Card = {
      id: 1,
      name: 'Card 1',
      image: 'image1.png',
      past: 'past1',
      present: 'present1',
      future: 'future1',
      cardOfTheDayPrediction: 'prediction1'
    }
    const selectCard = handleSelectCard({ selectedCard, cardSelected, showModal })
    selectCard(card)
    expect(selectedCard.value).toEqual(card)
    expect(cardSelected.value).toBe(true)
    expect(showModal.value).toBe(false)
  })

  it('sets showModal to true if the same card is selected again', () => {
    const card: Card = {
      id: 1,
      name: 'Card 1',
      image: 'image1.png',
      past: 'past1',
      present: 'present1',
      future: 'future1',
      cardOfTheDayPrediction: 'prediction1'
    }

    selectedCard.value = card
    const selectCard = handleSelectCard({ selectedCard, cardSelected, showModal })
    selectCard(card)
    expect(showModal.value).toBe(true)
  })
})

describe('closeModal', () => {
  it('resets all provided reactive states', () => {
    const showModal = ref(true)
    const chatResponse = ref('Some response')
    const cardsDrawn = ref(true)
    const cardSelected = ref(true)
    const selectedCard = ref({})
    const deckClickable = ref(false)
    const cards = ref([
      {
        id: 1,
        name: 'Card 1',
        image: 'image1.png',
        past: 'past1',
        present: 'present1',
        future: 'future1',
        cardOfTheDayPrediction: 'prediction1'
      }
    ])

    closeModal(
      showModal,
      chatResponse,
      cardsDrawn,
      cardSelected,
      selectedCard,
      deckClickable,
      cards
    )

    expect(showModal.value).toBe(false)
    expect(chatResponse.value).toBe(null)
    expect(cardsDrawn.value).toBe(false)
    expect(cardSelected.value).toBe(false)
    expect(selectedCard.value).toBe(null)
    expect(deckClickable.value).toBe(true)
    expect(cards.value).toEqual([])
  })
})

describe('getInstructionText', () => {
  it('returns "Click the selected card to reveal your day" if a card is selected and modal is not shown', () => {
    const props = {
      cardSelected: ref(true),
      showModal: ref(false),
      cardsDrawn: ref(true)
    }

    const result = getInstructionText(props)
    expect(result).toBe('Click the selected card to reveal your day')
  })


  it('returns "Pick one card" if no card is selected but cards are drawn', () => {
    const props = {
      cardSelected: ref(false),
      showModal: ref(false),
      cardsDrawn: ref(true)
    }

    const result = getInstructionText(props)
    expect(result).toBe('Pick one card')
  })

  it('returns "Click the top card deck to see your future." if no cards are drawn', () => {
    const props = {
      cardSelected: ref(false),
      showModal: ref(false),
      cardsDrawn: ref(false)
    }

    const result = getInstructionText(props)
    expect(result).toBe('Click the top card deck to see your future.')
  })
})