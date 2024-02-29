import type { Ref } from 'vue'

interface Card {
  name: string
  description: string
  prediction: string
}

interface CardOfTheDay extends Card {
  prediction: string
}

export interface CardOfTheDayReading {
  time: string
  card: CardOfTheDay
}

export interface ThreeCardReadings {
  id: string
  question: string
  questionName: string
  cards: {
    past: CardReading | null
    present: CardReading | null
    future: CardReading | null
  }
}

export interface CardReading {
  name: string
  description: string
}

export function formatDate(time: string) {
  return new Date(time).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

interface LoadReadingsProps {
  threeCardDeckReadings: Ref<any[]>
  cardOfTheDayReadings: Ref<any[]>
  localStorage: Storage
}

export function loadReadings({
  threeCardDeckReadings,
  cardOfTheDayReadings,
  localStorage
}: LoadReadingsProps) {
  const savedThreeCardReadings = localStorage.getItem('threeCardDeckReadings')
  if (savedThreeCardReadings) {
    threeCardDeckReadings.value = JSON.parse(savedThreeCardReadings)
  }

  const savedCardOfTheDayReadings = localStorage.getItem('cardOfTheDayReadings')
  if (savedCardOfTheDayReadings) {
    cardOfTheDayReadings.value = JSON.parse(savedCardOfTheDayReadings)
  }
}


export function removeThreeCardDeckReading(threeCardDeckReadings: Ref<Array<{ id: string }>>, id: string): void {
  const updatedReadings = threeCardDeckReadings.value.filter(reading => reading.id !== id);
  localStorage.setItem('threeCardDeckReadings', JSON.stringify(updatedReadings));
  threeCardDeckReadings.value = updatedReadings;
}


export function removeCardOfTheDayReading(
  cardOfTheDayReadings: Ref<CardOfTheDayReading[]>,
  time: string
): void {
  cardOfTheDayReadings.value = cardOfTheDayReadings.value.filter((reading) => reading.time !== time)
  localStorage.setItem('cardOfTheDayReadings', JSON.stringify(cardOfTheDayReadings.value))
}