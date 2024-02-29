import type { Ref } from 'vue'
import type { Card } from '@/components/TarotCards'

export function handleQuestionSubmit(
  userQuestion: Ref<string>,
  showQuestionModal: Ref<boolean>,
  showCards: Ref<boolean>,
  cardsToDisplay: Ref<Card[]>,
  initialCards: Card[]
): void {
  const trimmedQuestion = userQuestion.value.trim()

  if (!trimmedQuestion) {
    alert('Please enter a question.')
    return
  }

  showQuestionModal.value = false
  showCards.value = true
  cardsToDisplay.value = initialCards
    .map((card) => ({
      ...card,
      image: card.image,
      selected: false
    }))
    .sort(() => 0.5 - Math.random())
    .slice(0, 9)
}



export function closeAndReset(
  showCardMeaningsModal: Ref<boolean>,
  showQuestionModal: Ref<boolean>,
  showCards: Ref<boolean>,
  userQuestion: Ref<string>,
  selectedCards: Ref<Card[]>,
  cardsToDisplay: Ref<Card[]>,
  initialCards: Card[]
) {
  showCardMeaningsModal.value = false
  showQuestionModal.value = false
  showCards.value = false
  userQuestion.value = ''
  selectedCards.value = []
  cardsToDisplay.value = initialCards
    .map((card) => ({
      ...card,
      selected: false
    }))
    .sort(() => Math.random() - 0.5)
}


interface GetInstructionTextParams {
  isShowQuestionModal: boolean
  isShowCards: boolean
  selectedCardsLength: number
}

export function getInstructionText({
  isShowQuestionModal,
  isShowCards,
  selectedCardsLength
}: GetInstructionTextParams): string {
  if (isShowQuestionModal) {
    return 'Ask a question or focus on what you want to know, then submit to draw cards.'
  } else if (isShowCards && selectedCardsLength < 3) {
    return 'Select three cards to see your past, present, and future.'
  } else if (selectedCardsLength === 3) {
    return 'Press the button to reveal the meaning of your cards.'
  } else {
    return 'Click the top card deck to draw your cards.'
  }
}