<template>
  <main class="container py-4" id="home-wrap">
    <h1 id="card-of-the-day-title">Card Of The Day</h1>
    <div class="card-of-the-day-button-wrap">
      <p class="instructions">{{ getInstructionText() }}</p>
    </div>
    <div class="container">
      <div class="cards-of-the-day-wrap">
        <div class="row justify-content-center my-3">
          <div class="col-auto">
            <img
              @click="drawCards()"
              id="tarot-deck"
              :class="{ 'pulsate-animation': deckClickable,
              'no-pointer-events': !deckClickable }"
              src="../../assets/tarot-cards/tarot_cover.png"
              alt="Tarot card cover"
            />
          </div>
        </div>
        <div class="row justify-content-center my-3">
          <div class="col-auto" v-for="(card, index) in cards" :key="index">
            <img
              class="tarot-card"
              :class="{
                'pulsate-animation': !cardSelected,
                'hidden-card': selectedCard && card.id === selectedCard.id,
                'no-pointer-events': cardSelected || (selectedCard && card.id === selectedCard.id)
              }"
              :src="selectedCard && selectedCard.id === card.id ? card.image : coverCardImage"
              :alt="card.name"
              @click="!cardSelected && selectCard(card)"
            />
          </div>
        </div>
        <div class="row justify-content-center my-3" v-if="selectedCard">
          <div class="col-auto">
            <img
              class="tarot-card"
              :class="{
                'pulsate-animation': !showModal,
                'no-pointer-events': showModal
              }"
              :src="selectedCard.image"
              :alt="selectedCard.name"
              @click="selectCard(selectedCard)"
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
        <img class="close-btn" @click="closeModal" src="../../assets/close.png" alt="close button" />
        <h2 class="modal-title">{{ selectedCard ? selectedCard.name : 'Card Details' }}</h2>
        <div class="container modal-inner-content">
        <div v-if="selectedCard" class="image-and-text">
          <img class="modal-card-image" :src="selectedCard.image" :alt="selectedCard.name" />
          <p>{{ selectedCard.cardOfTheDayPrediction }}</p>
          </div>
          <div>
          <button class="save-and-close-btn" @click="saveAndClose">Save and Close</button>
        </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'

import deathCardImage from '../../assets/tarot-cards/tarot_death.png'
import judgementCardImage from '../../assets/tarot-cards/tarot_judgement.png'
import justiceCardImage from '../../assets/tarot-cards/tarot_justice.png'
import strengthCardImage from '../../assets/tarot-cards/tarot_strength.png'
import temperanceCardImage from '../../assets/tarot-cards/tarot_temperance.png'
import coverCardImage from '../../assets/tarot-cards/tarot_cover.png'
import theChariotImage from '../../assets/tarot-cards/tarot_the_chariot.png'
import theDevilImage from '../../assets/tarot-cards/tarot_the_devil.png'
import theEmperorImage from '../../assets/tarot-cards/tarot_the_emperor.png'
import theEmpressImage from '../../assets/tarot-cards/tarot_the_empress.png'
import theFoolImage from '../../assets/tarot-cards/tarot_the_fool.png'
import theHangedManImage from '../../assets/tarot-cards/tarot_the_hanged_man.png'
import theHermitImage from '../../assets/tarot-cards/tarot_the_hermit.png'
import theHierophantImage from '../../assets/tarot-cards/tarot_the_hierophant.png'
import theHighPriestessImage from '../../assets/tarot-cards/tarot_the_high_priestess.png'
import theLoversImage from '../../assets/tarot-cards/tarot_the_lovers.png'
import theMagicianImage from '../../assets/tarot-cards/tarot_the_magician.png'
import theMoonImage from '../../assets/tarot-cards/tarot_the_moon.png'
import theStarImage from '../../assets/tarot-cards/tarot_the_star.png'
import theSunImage from '../../assets/tarot-cards/tarot_the_sun.png'
import theWheelOfFortuneImage from '../../assets/tarot-cards/tarot_the_wheel_of_fortune.png'
import theWorldImage from '../../assets/tarot-cards/tarot_the_world.png'
import TowerImage from '../../assets/tarot-cards/tarot_tower.png'



interface Card {
  id: number
  name: string
  image: string
  cardOfTheDayPrediction: string
}


const cardsDrawn = ref(false)
const cards: Ref<Card[]> = ref([])
const selectedCard: Ref<Card | null> = ref(null)
const showModal: Ref<boolean> = ref(false)
const deckClickable = ref(true)
const cardSelected = ref(false)
const chatGptResponse: Ref<string | null> = ref(null);

const initialCards: Card[] = [
  { id: 1, name: 'Death', image: deathCardImage, cardOfTheDayPrediction: "Today, the Death card symbolizes a significant transformation and the closing of one chapter to begin another. Embrace change as it comes, knowing it's an essential part of life's cycle. Let go of what no longer serves you to make room for new opportunities and perspectives. This card is a reminder that with every ending comes the promise of a fresh start and rebirth. Trust the process, and approach transitions with an open heart and mind." },
  { id: 2, name: 'Judgement', image: judgementCardImage, cardOfTheDayPrediction: "The Judgement card today calls for self-reflection and evaluation. It's a time to assess your past actions and decisions, understanding their impact on your present and future. This card encourages you to rise to your higher calling and realize your full potential. Forgiveness and healing are also highlighted, suggesting that it's time to release past grievances and move forward with clarity and purpose. Listen to your inner voice, and make choices that align with your true self." },
  { id: 3, name: 'Justice', image: justiceCardImage, cardOfTheDayPrediction: "Today, the Justice card represents fairness, balance, and the need for accountability. It suggests that your actions will have consequences, so it's important to approach situations with honesty and integrity. This card advises you to weigh your decisions carefully, considering all sides before coming to a conclusion. Justice also speaks to the law of karma, reminding you that what you put out into the universe will eventually come back to you. Seek truth and strive for equilibrium in your daily interactions." },
  { id: 4, name: 'Strength', image: strengthCardImage, cardOfTheDayPrediction: "The Strength card today signals courage, patience, and inner power. It reminds you that true strength comes not from dominance or force, but from compassion, resilience, and the mastery of emotions. Face challenges with grace and perseverance, trusting in your ability to overcome obstacles. This card encourages you to harness your inner strength to deal with situations gently yet firmly. Remember, kindness and courage can move mountains." },
  { id: 5, name: 'Temprance', image: temperanceCardImage, cardOfTheDayPrediction: "Today, the Temperance card foretells a day of finding balance and harmony in your life. You may find yourself seeking equilibrium between your work and personal life or trying to balance your emotional needs with your practical responsibilities. It's a day for moderation and patience, where excessive behavior or extreme decisions might disrupt the peace you're striving for. Embrace compromise and diplomacy in your interactions, and remember that a calm, measured approach will lead to the best outcomes. Temperance encourages you to blend different aspects of your life seamlessly, promoting a sense of well-being and contentment." },
  { id: 6, name: 'The Chariot', image: theChariotImage, cardOfTheDayPrediction: "The Chariot today signifies a day of determination, focus, and triumph over obstacles. It's a time to take control and steer your life in the direction you desire, using willpower and discipline to push through challenges. The Chariot encourages you to assert your independence and confidence, maintaining balance and commitment to your goals. It's a day for action and perseverance, reminding you that success is within reach if you remain steadfast and motivated. Embrace the journey, and let your inner strength and determination guide you to victory." },
  { id: 7, name: 'The Devil', image: theDevilImage, cardOfTheDayPrediction: "The presence of The Devil card today suggests a confrontation with your shadows and the chains that bind you. This could manifest as a struggle against habits or dependencies that are holding you back from your true potential. Be mindful of situations or relationships that may feel confining or toxic. It's a day to recognize and question the material and emotional bonds that restrict you, with an opportunity to break free from negative patterns. Empowerment comes from acknowledging these challenges and taking conscious steps towards liberation and self-improvement." },
  { id: 8, name: 'The Emperor', image: theEmperorImage, cardOfTheDayPrediction: "Today, The Emperor heralds a day of asserting control and order in your life. You may find yourself in a position where leadership and decisiveness are required. Whether it's in your professional environment or personal life, the call is to stand firm, set boundaries, and establish clear structures. It's a day for making plans and sticking to them, showing discipline, and taking responsibility for your actions. The Emperor encourages you to embody strength and stability, providing a foundation upon which you and others can build." },
  { id: 9, name: 'The Fool', image: theFoolImage, cardOfTheDayPrediction: "The Fool indicates a day filled with new beginnings and the potential for a fresh start. Approach the day with an open heart and mind, ready to embrace new experiences and adventures. This might be the perfect time to take a leap of faith into something you've been hesitating about. The Fool encourages you to trust in the journey and the process, even if the destination is not yet clear. Let go of preconceived notions and allow yourself to be surprised by life's endless possibilities. Today, be spontaneous and find joy in the unexpected." },
  { id: 10, name: 'The Hanged Man', image: theHangedManImage, cardOfTheDayPrediction: "On this day, The Hanged Man suggests a period of pause and contemplation. You may find yourself in a situation where progress seems stalled, prompting you to look at things from a different angle. This is a time for introspection and reassessment of your values and beliefs. Sacrifices or letting go of something significant might be necessary to move forward. Embrace this period of suspension as an opportunity to gain new insights and wisdom. Today, allow yourself to release control and trust in the flow of life, understanding that sometimes, delays can lead to valuable lessons and growth." },
  { id: 11, name: 'The Hermit', image: theHermitImage, cardOfTheDayPrediction: "Today, The Hermit foretells a journey inward, suggesting a day for solitude and reflection. You may find yourself seeking quiet moments to contemplate your life's path and your next steps. It's a day to listen to your inner voice and seek wisdom that lies within. The Hermit encourages you to embrace the value of solitude, allowing you to reconnect with your true self. Personal insights and enlightenment can be found in the stillness. Look for guidance from within, and consider taking a break from the social whirl to focus on your personal growth and understanding." },
  { id: 12, name: 'The Hierophant', image: theHierophantImage, cardOfTheDayPrediction: "The Hierophant today indicates a connection with tradition and shared values. You might find yourself seeking advice from a mentor or being drawn to institutions with established beliefs and systems. It's a day for learning and adhering to cultural or spiritual norms, finding comfort and guidance within the wisdom of the past. The Hierophant encourages you to explore your spiritual roots and traditions, possibly re-affirming your faith in established systems. Embrace the role of student or teacher, and consider how shared knowledge and experiences can guide you on your path." },
  { id: 13, name: 'The High Priestess', image: theHighPriestessImage, cardOfTheDayPrediction: "Today, The High Priestess suggests a day of intuition and mystery. You are encouraged to trust your inner instincts and to look beyond the obvious to find deeper truths. The High Priestess symbolizes the subconscious mind and the secrets it holds. Pay attention to your dreams and the subtle signs around you. It's a day for introspection and connecting with your inner wisdom. Let your intuition guide your decisions, and be open to the messages the universe is sending you." },
  { id: 14, name: 'The Lovers', image: theLoversImage, cardOfTheDayPrediction: "The Lovers card today signifies a day of important choices, especially concerning personal relationships. It's a time for evaluating your values and deciding what truly matters to you. The Lovers highlight harmony and the union of opposites, suggesting that partnerships and close relationships will be prominent. Whether it's choosing a partner, deepening a relationship, or finding balance within yourself, today calls for commitment and honesty in your connections with others. Embrace love in all its forms, and remember the power of meaningful choices." },
  { id: 15, name: 'The Magician', image: theMagicianImage, cardOfTheDayPrediction: "Today, The Magician brings a message of manifestation and resourcefulness. You have all the tools and abilities needed to realize your goals and desires. It's a day to take action and to trust in your ability to bring about change. The Magician encourages you to focus your will and intent, utilizing your skills and resources to shape your reality. Be confident in your capabilities and act with purpose. Today is a day for creativity, initiative, and the power to make things happen." },
  { id: 16, name: 'The Moon', image: theMoonImage, cardOfTheDayPrediction: "The Moon card today warns of a day filled with illusions and uncertainty. It suggests that things may not be as they seem, urging you to trust your intuition to navigate through confusion and deception. The Moon encourages you to confront your fears and to be aware of hidden truths lurking in the shadows. This is a time for introspection, to face the subconscious and the unknown. Pay attention to your dreams and the subtle cues your intuition offers, guiding you towards clarity and understanding in the midst of ambiguity." },
  { id: 17, name: 'The Star', image: theStarImage, cardOfTheDayPrediction: "Today, The Star shines with hope, inspiration, and renewal. After a period of hardship, it signifies a time of healing and positive energy. The Star encourages you to keep faith in the future and to believe in your dreams. It's a day for optimism and looking forward, where the universe is aligned to offer support and guidance. Let go of past burdens and focus on new goals with confidence. The Star is a reminder that, even in darkness, there is light ahead promising renewal and bright prospects." },
  { id: 18, name: 'The Sun', image: theSunImage, cardOfTheDayPrediction: "Today, The Sun illuminates your path with joy, success, and vitality. It promises a day filled with clarity and the achievement of goals. The Sun encourages you to bask in the warmth of positive energies that surround you, fostering growth and happiness in your endeavors. It's a time to celebrate your accomplishments and enjoy the simple pleasures of life. Relationships may flourish under this radiant energy, and personal projects are likely to prosper. Embrace optimism and confidence, for The Sun heralds a period of light-heartedness and fulfillment." },
  { id: 19, name: 'The Wheel of Fortune', image: theWheelOfFortuneImage, cardOfTheDayPrediction: "The Wheel of Fortune today signifies a day of change and cycles. It reminds you that life is constantly in motion, and today could bring unexpected turns of fate. This card encourages you to remain adaptable and to trust that the universe has a plan. Whether the wheel turns in your favor or challenges you, there's a lesson to be learned and an opportunity for growth. Embrace the cycles of life, knowing that every phase has its purpose. Today, be open to the twists and turns that come your way, as they lead you toward your destiny." },
  { id: 20, name: 'The World', image: theWorldImage, cardOfTheDayPrediction: "Today, The World signals a day of completion and fulfillment. It suggests that you are reaching the end of a significant phase, culminating in a sense of accomplishment and unity. The World invites you to reflect on your journey, acknowledging the lessons and experiences that have brought you to this point. It's a time for celebration and recognition of your achievements. Consider how you can share your successes and wisdom with others. Embrace the interconnectedness of all things and the sense of wholeness that comes from having traversed your path fully." },
  { id: 21, name: 'Tower', image: TowerImage, cardOfTheDayPrediction: "The Tower today warns of a day of upheaval and revelation. It suggests that structures or beliefs you thought were stable may be challenged or dismantled. While this may be unsettling, The Tower ultimately serves to clear away illusions and false foundations, making way for truth and new beginnings. Embrace the transformative energy of this day, understanding that destruction often precedes renewal. Be open to change and the liberation that comes from releasing outdated attachments. Today, focus on resilience and the opportunity to rebuild on firmer ground." },
  { id: 22, name: 'The Empress', image: theEmpressImage, cardOfTheDayPrediction: "Today, The Empress brings a message of nurturing, abundance, and creativity. It's a day to embrace the beauty around you and to connect deeply with your senses. The Empress encourages you to nurture yourself and others, fostering growth and harmony in your relationships. It's a time for creativity and bringing ideas to fruition, supported by the fertile energy of this card. Embrace your caring and compassionate nature, allowing your love and creativity to flow freely. The Empress symbolizes the richness of life, reminding you to appreciate and cultivate the abundance that surrounds you." },
]

function drawCards() {
  if (!deckClickable.value) return
  const shuffled = initialCards.sort(() => 0.5 - Math.random())
  cards.value = shuffled.slice(0, 3)
  cardsDrawn.value = true
  deckClickable.value = false
}

function selectCard(card: Card): void {
  if (selectedCard.value && card.id === selectedCard.value.id) {
    showModal.value = true;
  } else {
    selectedCard.value = card;
    cardSelected.value = true;
  }
}


function closeModal() {
  showModal.value = false;
  chatGptResponse.value = null;
  cardsDrawn.value = false;
  cardSelected.value = false;
  selectedCard.value = null;
  deckClickable.value = true;
  cards.value = [];
}

function saveAndClose() {
  if (selectedCard.value) {
    // Get current readings from local storage or initialize an empty array if none
    const currentReadings = JSON.parse(localStorage.getItem('cardOfTheDayReadings') || '[]');
    
    // Create a new reading object with the current timestamp and selected card details
    const newReading = {
      time: new Date().toISOString(), // ISO string for universal time format, or you can format it as you like
      card: {
        id: selectedCard.value.id,
        name: selectedCard.value.name,
        prediction: selectedCard.value.cardOfTheDayPrediction
      }
    };
    
    // Append the new reading to the current readings array
    currentReadings.push(newReading);
    
    // Save the updated readings array back to local storage
    localStorage.setItem('cardOfTheDayReadings', JSON.stringify(currentReadings));
    
    // Close the modal and reset the component state
    closeModal();
  }
}

function getInstructionText() {
  if (cardSelected.value && !showModal.value) {
    return 'Click the selected card to reveal your day';
  }
  else if (cardSelected.value && showModal.value) {
    return 'Click the selected card to reveal your day';
  }
  else if (cardsDrawn.value && !cardSelected.value) {
    return 'Pick one card';
  }
  else {
    return 'Click the top card deck to see your future.';
  }
}


</script>
