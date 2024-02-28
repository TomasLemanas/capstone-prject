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