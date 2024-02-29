import type { Card } from '@/components/TarotCards'
import type { Ref } from 'vue'

export function drawCards(deckClickable: boolean, initialCards: Card[]): Card[] {
  if (!deckClickable) return []
  const shuffled = [...initialCards].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, 3)
}

interface handleSelectCardProps {
  selectedCard: Ref<Card | null>
  cardSelected: Ref<boolean>
  showModal: Ref<boolean>
}

export function handleSelectCard({ selectedCard, cardSelected, showModal }: handleSelectCardProps) {
  return function selectCard(card: Card): void {
    if (selectedCard.value && card.id === selectedCard.value.id) {
      showModal.value = true
    } else {
      selectedCard.value = card
      cardSelected.value = true
    }
  }
}

export function closeModal(
  showModal: Ref<boolean>,
  chatResponse: Ref<string | null>,
  cardsDrawn: Ref<boolean>,
  cardSelected: Ref<boolean>,
  selectedCard: Ref<any | null>,
  deckClickable: Ref<boolean>,
  cards: Ref<any[]>
): void {
  showModal.value = false
  chatResponse.value = null
  cardsDrawn.value = false
  cardSelected.value = false
  selectedCard.value = null
  deckClickable.value = true
  cards.value = []
}

interface InstructionTextProps {
  cardSelected: Ref<boolean>
  showModal: Ref<boolean>
  cardsDrawn: Ref<boolean>
}

export function getInstructionText({
  cardSelected,
  showModal,
  cardsDrawn
}: InstructionTextProps): string {
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