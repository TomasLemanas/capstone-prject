interface CardReading {
  name: string
  description: string
}

export interface threeCardReadings {
  id: string
  question: string
  questionName: string
  cards: {
    past: CardReading | null
    present: CardReading | null
    future: CardReading | null
  }
}
