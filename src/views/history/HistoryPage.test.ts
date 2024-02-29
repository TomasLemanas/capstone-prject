import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import {
  loadReadings,
  formatDate,
  removeThreeCardDeckReading,
  removeCardOfTheDayReading,
} from './HistoryPage'

import type { CardOfTheDayReading } from './HistoryPage'

describe('loadReadings', () => {
  it('loads readings from localStorage', () => {
    const threeCardDeckReadings = ref([])
    const cardOfTheDayReadings = ref([])
    const mockLocalStorage = {
      getItem: vi.fn((key) =>
        key === 'threeCardDeckReadings'
          ? JSON.stringify([{ id: '1' }])
          : JSON.stringify([{ time: 'now' }])
      )
    } as unknown as Storage

    loadReadings({
      threeCardDeckReadings,
      cardOfTheDayReadings,
      localStorage: mockLocalStorage
    })

    expect(threeCardDeckReadings.value).toEqual([{ id: '1' }])
    expect(cardOfTheDayReadings.value).toEqual([{ time: 'now' }])
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('threeCardDeckReadings')
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('cardOfTheDayReadings')
  })
})


describe('formatDate', () => {
  it('formats date strings into a readable format', () => {
    const date = '2024-01-01T00:00:00Z'
    const expected = new Date(date).toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
    const result = formatDate(date)
    expect(result).toBe(expected)
  })
});

it('correctly formats the end of the year', () => {
  const date = '2023-12-31T00:00:00Z'
  const expected = new Date(date).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
  const result = formatDate(date)
  expect(result).toBe(expected)
})

it('returns "Invalid Date" for an invalid date input', () => {
  const date = 'not a real date'
  const result = formatDate(date)
  expect(result).toBe('Invalid Date')
})

describe('removeThreeCardDeckReading', () => {
  it('removes a reading by id and updates localStorage', () => {
    const mockLocalStorageSetItem = vi.spyOn(Storage.prototype, 'setItem')
    const threeCardDeckReadings = ref([{ id: '1' }, { id: '2' }])

    removeThreeCardDeckReading(threeCardDeckReadings, '1')

    expect(threeCardDeckReadings.value).toEqual([{ id: '2' }])
    expect(mockLocalStorageSetItem).toHaveBeenCalledWith(
      'threeCardDeckReadings',
      JSON.stringify([{ id: '2' }])
    )

    mockLocalStorageSetItem.mockRestore()
  })
})

describe('removeCardOfTheDayReading', () => {
  it('removes the reading with the specified time', () => {
    const mockLocalStorageSetItem = vi.spyOn(Storage.prototype, 'setItem')
    const readings = ref<CardOfTheDayReading[]>([
      {
        time: '2024-01-01T00:00:00.000Z',
        card: {
          name: 'The Fool',
          prediction: 'text',
          description: 'text'
        }
      },
      {
        time: '2024-01-02T00:00:00.000Z',
        card: {
          name: 'The Magician',
          prediction: 'text',
          description: 'text.'
        }
      }
    ])

    removeCardOfTheDayReading(readings, '2024-01-01T00:00:00.000Z')

    expect(readings.value.length).toBe(1)
    expect(readings.value[0].time).toBe('2024-01-02T00:00:00.000Z')
    expect(mockLocalStorageSetItem).toHaveBeenCalledWith(
      'cardOfTheDayReadings',
      JSON.stringify(readings.value)
    )

    mockLocalStorageSetItem.mockRestore()
  })
})