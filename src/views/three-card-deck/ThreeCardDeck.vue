<template>
  <main class="container py-4" id="home-wrap">
    <div>
      <h1 id="three-card-deck-title">Three Card Tarot Reading</h1>
      <div class="card-of-the-day-button-wrap">
        <p class="instructions">{{ getInstructionText() }}</p>
      </div>
      <div class="" @click="!showCards && drawCardsForThreeCardDeck()">
        <div class="deck" :class="{ 'deck-disabled': showCards, 'pulsate-animation': !showCards }">
          <img src="../../assets/tarot-cards/tarot_cover.png" alt="Tarot Deck" class="tarot-card" />
        </div>
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
        <button class="submit-btn" @click="handleQuestionSubmit">Submit Question</button>
      </div>
    </div>
    <div v-if="showCards" class="nine-card-grid">
      <div
        class="nine-cards"
        v-for="(card, index) in cardsToDisplay"
        :key="index"
        :class="{
          'pulsate-animation': !selectedCards.includes(card) && selectedCards.length < 3,
          'hidden-card': selectedCards.includes(card),
          'no-pointer-events': selectedCards.length === 3
        }"
        @click="selectCard(card)"
      >
        <img
          src="../../assets/tarot-cards/tarot_cover.png"
          alt="Card face down"
          class="tarot-card"
        />
      </div>
    </div>
    <div v-if="selectedCards.length" class="selected-cards-display">
      <div v-for="card in selectedCards" :key="card.id">
        <div>
          <img :src="card.image" :alt="card.name" class="revealed-tarot-card" />
        </div>
      </div>
      <div v-if="selectedCards.length === 3" class="reveal-meanings"></div>
      <div class="reveal-card-meaning-btn-wrap" v-if="selectedCards.length === 3">
        <button class="reveal-card-meaning-btn" @click="revealCardMeaningsInModal">
          Reveal Card Meanings
        </button>
      </div>
    </div>
    <div class="instruction-wrap">
      <p class="instructions">{{ getInstructionText() }}</p>
    </div>
    <div v-if="showCardMeaningsModal" class="meaning-modal-overlay">
      <div class="meaning-modal-content">
        <div class="meaning-modal-close-btn-wrap">
          <img
            class="meaning-modal-close-btn"
            @click="closeAndReset"
            src="../../assets/close.png"
            alt="close button"
          />
        </div>
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
          <div class="save-and-close-three-card-deck-btn-wrap">
            <button class="save-and-close-three-card-deck-btn" @click="saveReadingAndClose">
              Save and Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import deathCardImage from '../../assets/tarot-cards/tarot_death.png'
import judgementCardImage from '../../assets/tarot-cards/tarot_judgement.png'
import justiceCardImage from '../../assets/tarot-cards/tarot_justice.png'
import strengthCardImage from '../../assets/tarot-cards/tarot_strength.png'
import temperanceCardImage from '../../assets/tarot-cards/tarot_temperance.png'
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
  past: string
  present: string
  future: string
  cardOfTheDayPrediction: string
}

interface CardReading {
  name: string
  description: string
}

interface threeCardReadings {
  id: string
  question: string
  questionName: string
  cards: {
    past: CardReading | null
    present: CardReading | null
    future: CardReading | null
  }
}

const initialCards: Card[] = [
  {
    id: 1,
    name: 'Death',
    image: deathCardImage,
    past: 'Death in the past position signifies a significant ending or transformation that has had a profound impact on your life. This period was marked by the closure of one chapter, leading to the painful but necessary process of letting go. The end may have come in various forms—relationships, careers, beliefs, or personal identities—that no longer served your growth. Reflecting on this time, you understand that although the experience was challenging, it was essential for your evolution. This card suggests that the ending paved the way for new beginnings, teaching you about the cyclical nature of life and the importance of releasing the past to make room for the future. The lessons learned during this transformative phase have been crucial in shaping who you are today, offering clarity, renewal, and a deeper appreciation for the process of change.',
    present:
      "Currently, Death indicates you are going through or about to undergo a significant transformation. This card signifies a time of endings and beginnings, where letting go of the old is necessary to welcome new opportunities and growth. You may be facing a situation that requires you to release outdated aspects of your life, whether it's a relationship, a job, or a long-held belief. Death in the present asks you to embrace change, however daunting it may seem, understanding that renewal and rebirth are on the other side of this transition. It's a period of shedding what no longer serves you, making way for a new phase of your life. This card encourages you to confront the inevitability of change with courage and openness, allowing yourself to be transformed by the experiences you are going through. Recognize this time as a chance for profound personal development and spiritual awakening, knowing that the process of ending and beginning anew is a natural and necessary part of life's journey.",
    future:
      'In the future position, Death foretells a coming period of transformation and renewal. This card predicts significant changes ahead that will require you to let go of the past and embrace a new phase of your life. The future brings an opportunity for profound personal growth, as you will be challenged to release what no longer serves your highest good, making way for new beginnings. Death in the future position is a powerful reminder that endings are not to be feared but embraced as essential for personal development and renewal. Prepare for this transformative phase with an open heart and mind, ready to welcome the new possibilities and experiences that await you, knowing that every ending is a chance for a new and beautiful beginning.',
    cardOfTheDayPrediction:
      "Today, the Death card symbolizes a significant transformation and the closing of one chapter to begin another. Embrace change as it comes, knowing it's an essential part of life's cycle. Let go of what no longer serves you to make room for new opportunities and perspectives. This card is a reminder that with every ending comes the promise of a fresh start and rebirth. Trust the process, and approach transitions with an open heart and mind."
  },
  {
    id: 2,
    name: 'Judgement',
    image: judgementCardImage,
    past: 'The Judgment card in the past position signifies a period of rebirth and awakening that has significantly shaped your current path. This phase involved a moment of profound realization or a call to action that urged you to leave behind old ways and embrace a new phase of your life. Reflecting on this time, you understand it was a crucial turning point where you were asked to evaluate your past actions, decisions, and their consequences, leading to a deep, personal transformation. Judgment in the past suggests you answered a higher calling or recognized your true purpose, allowing you to rise above past limitations and to start anew with a clear sense of direction and renewed vitality.',
    present:
      "Currently, Judgment indicates you are experiencing a time of self-evaluation and reflection, where you're being called to assess your life's journey and to make significant changes. This card suggests a moment of awakening, where you're urged to let go of the past and to embrace your future with a renewed sense of purpose. Judgment in the present position is a reminder to listen to your inner calling and to make choices that align with your true self and highest potential. It's a time to release what no longer serves you and to rise from the ashes of your former self, embracing the transformation that leads to a new phase of your life.",
    future:
      "In the future position, Judgment foretells a coming time of self-realization and rebirth. This card predicts an important phase of awakening where you will be called to review your life's path, make pivotal decisions, and embrace your true purpose. The future brings an opportunity for profound transformation, urging you to let go of past regrets and to move forward with clarity and conviction. Judgment in the future is a reminder that your life is a result of your decisions and actions, encouraging you to live in alignment with your highest ideals. Prepare for a moment of reckoning that propels you towards a fulfilling new chapter, where you fully embrace your calling and manifest your true destiny.",
    cardOfTheDayPrediction:
      "The Judgement card today calls for self-reflection and evaluation. It's a time to assess your past actions and decisions, understanding their impact on your present and future. This card encourages you to rise to your higher calling and realize your full potential. Forgiveness and healing are also highlighted, suggesting that it's time to release past grievances and move forward with clarity and purpose. Listen to your inner voice, and make choices that align with your true self."
  },
  {
    id: 3,
    name: 'Justice',
    image: justiceCardImage,
    past: 'Justice in the past position reflects a period of your life where decisions, fairness, and accountability played significant roles. This phase involved critical judgments or the need for balance and integrity, possibly relating to legal matters, ethical dilemmas, or personal relationships. It represents a time when you were called upon to act with honesty and fairness, making choices that aligned with your sense of justice and morality. Reflecting on this period, you understand the consequences of your actions and decisions, learning the importance of truth, balance, and the law of cause and effect. This card in the past position reminds you of the value of maintaining ethical standards and the impact of your choices on your life and the lives of others, teaching you lessons of responsibility and the importance of making decisions with a clear and equitable mind.',
    present:
      "Justice in the present suggests that you are currently facing a situation that requires balance, fairness, and clear judgment. This card indicates a time of decision-making, where your actions and choices must be guided by integrity and the pursuit of fairness. It's a call to weigh your options carefully, considering all sides of a situation before coming to a conclusion. Justice encourages you to seek equilibrium in your life, addressing any imbalances or injustices that may be present. This is a period to reflect on your personal values and to act in alignment with what you believe to be right and just. Whether you are dealing with legal matters, resolving conflicts, or making significant life choices, Justice reminds you of the importance of accountability and the impact of your decisions on your future and the well-being of others. Approach your current challenges with a commitment to fairness and truth, knowing that the choices you make now will shape your path forward.",
    future:
      "In the future position, Justice foretells a coming period where issues of fairness, balance, and accountability will come to the forefront. This card predicts a time when you will be called upon to stand up for what is right, possibly facing decisions or situations that test your commitment to justice and integrity. The future will bring opportunities to correct imbalances and to address matters that require clear and honest judgment. Justice in the future position suggests that your actions and decisions will have significant consequences, emphasizing the importance of acting with a sense of responsibility and ethical consideration. It's a reminder that the choices you make will shape your destiny, urging you to consider the principles of fairness and balance in all you do. This period may involve resolving conflicts, dealing with legal matters, or making choices that reflect your deepest values and beliefs. Embrace this time as an opportunity to demonstrate your commitment to justice and to contribute to a fairer and more equitable world.",
    cardOfTheDayPrediction:
      "Today, the Justice card represents fairness, balance, and the need for accountability. It suggests that your actions will have consequences, so it's important to approach situations with honesty and integrity. This card advises you to weigh your decisions carefully, considering all sides before coming to a conclusion. Justice also speaks to the law of karma, reminding you that what you put out into the universe will eventually come back to you. Seek truth and strive for equilibrium in your daily interactions."
  },
  {
    id: 4,
    name: 'Strength',
    image: strengthCardImage,
    past: 'In the past position, Strength indicates a period where you faced challenges with courage, compassion, and inner resolve. This phase of your life required you to summon your inner strength to overcome obstacles, not through force or aggression, but with patience and understanding. You may have dealt with situations that tested your spirit, but these challenges helped you to discover the depth of your resilience and the power of a gentle approach. Reflecting on this time, you realize that true strength lies in your ability to remain calm and compassionate, even in the face of adversity. Your experiences taught you the importance of self-control, the power of kindness, and the strength that comes from facing your fears with a heart full of courage.',
    present:
      "Currently, Strength suggests you are in a phase where your inner fortitude and character are being tested. It's a time to stand firm in your convictions, showing grace under pressure. The challenges you face now require you to draw upon your inner reserves of strength, patience, and compassion. This card encourages you to approach your current situation with a blend of courage and kindness, harnessing your emotional and spiritual power to navigate through difficulties. It's a reminder that strength isn't always about physical force; sometimes, it's about the quiet power of a steady heart and a gentle hand. Embrace this period as an opportunity to demonstrate your resilience and to influence situations positively with your inner calm and determination.",
    future:
      "In the future position, Strength foretells a coming time when your inner resilience and moral fortitude will lead you to overcome obstacles and achieve harmony. This future phase will challenge you to maintain your composure and to use your inner strength to face life's trials with courage and grace. It suggests that your ability to remain compassionate, patient, and understanding, even under pressure, will be key to navigating future challenges. The Strength card in this position is a promising sign that, through self-control and inner power, you will triumph over adversities and emerge stronger. It's a reminder to trust in your inner capabilities and to approach future obstacles with confidence and a gentle resolve. This period will highlight the strength of your character and the impact of a kind heart, reinforcing the idea that true power comes from within and that love and strength go hand in hand in overcoming life's hurdles.",
    cardOfTheDayPrediction:
      'The Strength card today signals courage, patience, and inner power. It reminds you that true strength comes not from dominance or force, but from compassion, resilience, and the mastery of emotions. Face challenges with grace and perseverance, trusting in your ability to overcome obstacles. This card encourages you to harness your inner strength to deal with situations gently yet firmly. Remember, kindness and courage can move mountains.'
  },
  {
    id: 5,
    name: 'Temprance',
    image: temperanceCardImage,
    past: 'The Temperance card in the past position reflects a period of your life characterized by balance, moderation, and harmony. This phase likely involved finding the middle ground in challenging situations or blending diverse elements together to create something new and valuable. It represents a time when you learned the importance of patience, self-control, and the careful integration of opposing forces. Reflecting on this period, you understand how these experiences taught you the value of compromise and the strength found in blending versatility with stability. Temperance in the past suggests that your ability to maintain equilibrium during this time has laid a foundation for personal growth and inner peace, showing you the power of a balanced approach in life.',
    present:
      "Currently, Temperance signifies a moment in your life where balance and harmony are crucial. You are being called to practice moderation and to find a middle way through any extremes you are facing. This card encourages you to blend various aspects of your life seamlessly, promoting a sense of well-being and equilibrium. It's a time for healing, where carefully adjusting your approach to challenges can lead to a peaceful resolution. Temperance in the present advises patience and the careful consideration of how different elements in your life can work together more harmonically. Embrace this period as an opportunity to cultivate balance within yourself, leading to lasting stability and clarity in your external circumstances.",
    future:
      'In the future position, Temperance foretells a period where achieving balance and maintaining moderation will be key to your success and well-being. This card predicts a time when you will need to harmonize opposing aspects of your life, requiring patience, adaptability, and a holistic approach. The future brings an opportunity to apply the lessons of moderation and equilibrium, suggesting that a balanced and thoughtful approach to upcoming challenges will lead to personal growth and harmony. Temperance in the future is a reminder of the importance of staying centered and grounded, encouraging you to integrate different parts of your life and your being in a cohesive and healthy manner. Prepare to embrace a path of balance, where your ability to maintain tranquility and moderation will open doors to new levels of understanding and peace.',
    cardOfTheDayPrediction:
      "Today, the Temperance card foretells a day of finding balance and harmony in your life. You may find yourself seeking equilibrium between your work and personal life or trying to balance your emotional needs with your practical responsibilities. It's a day for moderation and patience, where excessive behavior or extreme decisions might disrupt the peace you're striving for. Embrace compromise and diplomacy in your interactions, and remember that a calm, measured approach will lead to the best outcomes. Temperance encourages you to blend different aspects of your life seamlessly, promoting a sense of well-being and contentment."
  },
  {
    id: 6,
    name: 'The Chariot',
    image: theChariotImage,
    past: "The appearance of The Chariot in the past position signifies a period in your life characterized by determination, control, and the overcoming of obstacles through willpower and discipline. This phase likely involved a significant challenge or situation that required you to assert your dominance and direction, steering through adversity with focus and resilience. It was a time when your ambition drove you to pursue success, possibly leading to a pivotal victory or achievement. However, this card also suggests that the triumphs came with lessons on the importance of balancing aggression with understanding, and force with direction. Reflecting on this period, you can appreciate the growth that came from navigating through complexities with confidence and strength, teaching you the value of harnessing opposing forces to move forward in your life's journey.",
    present:
      "Currently, The Chariot indicates a moment of your life where you are, or soon will be, asserting your will and authority to achieve your goals. It represents a call to take the reins and direct your path with intention and conviction. The challenges you face now require a blend of inner strength, determination, and control. This card suggests that success is attainable through perseverance and a clear sense of direction. You may find yourself at a crossroads, faced with decisions that test your resolve and ambition. The Chariot encourages you to stay focused on your objectives, harnessing your personal power to navigate through any adversities. It's a time to remain disciplined, using your willpower to maintain momentum. Consider how you can balance opposing forces in your life, whether they are internal conflicts or external pressures, to drive forward towards your goals. Embrace this period as an opportunity to demonstrate your leadership and capability to overcome, reminding yourself that the journey is as significant as the destination.",
    future:
      "In the future position, The Chariot foretells a coming phase of your life where determination, control, and victory will be central themes. This card predicts a period where your resolve will be tested, requiring you to harness all of your inner strength and courage to pursue your ambitions. The challenges ahead will demand a disciplined approach and a strong will, pushing you to assert yourself and take decisive action to overcome obstacles. The Chariot's message for your future is one of encouragement to maintain your focus and direct your energy efficiently. It suggests that the key to navigating the upcoming challenges lies in your ability to stay driven and balanced, steering your life with confidence and purpose. As you move forward, remember the lessons of The Chariot: success comes from a combination of hard work, control, and the harmonious alignment of opposing forces. This period will be an opportunity to demonstrate your leadership qualities and to achieve significant progress towards your goals, ultimately leading to a triumphant advance in your personal or professional life.",
    cardOfTheDayPrediction:
      "The Chariot today signifies a day of determination, focus, and triumph over obstacles. It's a time to take control and steer your life in the direction you desire, using willpower and discipline to push through challenges. The Chariot encourages you to assert your independence and confidence, maintaining balance and commitment to your goals. It's a day for action and perseverance, reminding you that success is within reach if you remain steadfast and motivated. Embrace the journey, and let your inner strength and determination guide you to victory."
  },
  {
    id: 7,
    name: 'The Devil',
    image: theDevilImage,
    past: "The Devil in the past position signifies a period marked by bondage, materialism, and possibly self-destructive patterns. This phase of your life involved situations where you felt trapped by your desires, fears, or attachments, leading to a cycle of dependency or limitation. Reflecting on this time, you recognize how these experiences highlighted the importance of confronting your shadows and acknowledging the chains you've imposed on yourself. The Devil teaches that liberation comes from understanding and facing these attachments, encouraging you to learn from past entrapments and to seek freedom from self-imposed bonds.",
    present:
      "Currently, The Devil indicates that you may be experiencing a phase of temptation, materialism, or feeling trapped by certain habits or beliefs. This card suggests a moment where you're confronting your shadows, challenging you to recognize and break free from the chains that bind you. It's a call to examine your attachments, dependencies, and the ways you might be giving away your power. The Devil in the present position urges you to assert your autonomy, encouraging you to liberate yourself from unhealthy patterns or relationships. Embrace this time as an opportunity for empowerment, understanding that true freedom comes from acknowledging and overcoming your limitations.",
    future:
      'In the future position, The Devil warns of a potential phase where you could face challenges related to bondage, materialism, or unhealthy attachments. This card predicts a time when being mindful of the traps of dependency and the illusions of external power will be crucial. The future invites you to stay vigilant against the temptations that may lead you away from your true path, suggesting that awareness and self-discipline are keys to maintaining your freedom. The Devil in the future position is a reminder that your power lies in your ability to choose liberation over limitation, encouraging you to confront and overcome any bonds that threaten to hold you back from your highest potential.',
    cardOfTheDayPrediction:
      "The presence of The Devil card today suggests a confrontation with your shadows and the chains that bind you. This could manifest as a struggle against habits or dependencies that are holding you back from your true potential. Be mindful of situations or relationships that may feel confining or toxic. It's a day to recognize and question the material and emotional bonds that restrict you, with an opportunity to break free from negative patterns. Empowerment comes from acknowledging these challenges and taking conscious steps towards liberation and self-improvement."
  },
  {
    id: 8,
    name: 'The Emperor',
    image: theEmperorImage,
    past: "The Emperor in the past position signifies a period in your life where structure, authority, and discipline played a crucial role. Reflecting on this time, you understand it was marked by the presence or influence of a powerful figure or your own need to establish control and order in your environment. This phase likely involved setting firm foundations, creating rules, and asserting leadership to achieve your goals. The Emperor teaches the importance of stability and the strength found in authority, whether it was you embodying these qualities or someone else who provided guidance and structure. This period was essential for your growth, offering lessons in responsibility, the power of a strong will, and the benefits of a disciplined approach to life's challenges.",
    present:
      "Currently, The Emperor indicates a call to embrace authority, structure, and discipline in your life. This card suggests a need for order and control, urging you to take charge of your circumstances with confidence and determination. The Emperor in the present position encourages you to assert your power, establish clear boundaries, and pursue your goals with a structured plan. It's a reminder of the strength found in leadership and the importance of a solid foundation upon which to build your future. Embrace this time as an opportunity to demonstrate your capability to lead and to create stability in your life and the lives of those around you, understanding that true authority comes from a place of wisdom and responsibility.",
    future:
      'In the future position, The Emperor foretells a coming phase where leadership, structure, and discipline will be key to your success. This card predicts a time when your ability to assert control and to establish order will lead to significant achievements. The future holds opportunities for you to embody the qualities of The Emperor, urging you to prepare for a role that requires strength, authority, and a strategic approach. The Emperor in the future is a reminder that your leadership will be tested, and your capacity to create stability and to guide others will be crucial. Prepare to step into a position of power, knowing that the foundations you lay now will support your future endeavors. Embrace the challenges ahead with confidence, understanding that your ability to lead with integrity and discipline will bring about lasting results and respect from those around you.',
    cardOfTheDayPrediction:
      "Today, The Emperor heralds a day of asserting control and order in your life. You may find yourself in a position where leadership and decisiveness are required. Whether it's in your professional environment or personal life, the call is to stand firm, set boundaries, and establish clear structures. It's a day for making plans and sticking to them, showing discipline, and taking responsibility for your actions. The Emperor encourages you to embody strength and stability, providing a foundation upon which you and others can build."
  },
  {
    id: 9,
    name: 'The Fool',
    past: "In the past position, The Fool represents a time of naivety, spontaneity, and embarking on a new journey with a sense of optimism and adventure. This phase in your life was characterized by taking risks and stepping into the unknown without fear, driven by pure curiosity and the desire for new experiences. Reflecting on this period, you recognize the importance of these moments of uninhibited exploration, which were essential for your personal growth and discovery. The Fool suggests that, despite any challenges faced, this willingness to leap into the unknown has shaped you into a more adaptable and open-minded individual, teaching you the value of trusting the journey and embracing life's uncertainties with a positive spirit.",
    present:
      "Currently, The Fool indicates you are at the brink of a new beginning, urging you to embrace the unknown with an open heart and mind. This card suggests a moment ripe with potential for new adventures and opportunities, encouraging you to take a leap of faith into uncharted territories. The Fool in the present position is a reminder to let go of preconceived notions and fears, and to approach life with the innocence and wonder of a beginner. It's a time to trust in the universe and your path, recognizing that every journey starts with a single step of faith. Embrace this period of new beginnings with optimism, knowing that it offers a chance for growth, learning, and the discovery of untapped potentials.",
    future:
      'In the future position, The Fool foretells an upcoming adventure or a fresh start, inviting you to step forward with courage and openness. This card predicts a period of exploration, where embracing new experiences and the unknown will lead to significant personal growth and development. The future holds the promise of new paths and possibilities, urging you to maintain an adventurous spirit and a willingness to venture beyond your comfort zone. The Fool in the future is a reminder that life is a journey of continuous discovery, and the best way to navigate it is with a heart full of curiosity and an unwavering trust in the process. Prepare to embark on a new chapter of your life, filled with learning, growth, and the joy of exploration, embracing each moment with the fearless spirit of a pioneer.',
    image: theFoolImage,
    cardOfTheDayPrediction:
      "The Fool indicates a day filled with new beginnings and the potential for a fresh start. Approach the day with an open heart and mind, ready to embrace new experiences and adventures. This might be the perfect time to take a leap of faith into something you've been hesitating about. The Fool encourages you to trust in the journey and the process, even if the destination is not yet clear. Let go of preconceived notions and allow yourself to be surprised by life's endless possibilities. Today, be spontaneous and find joy in the unexpected."
  },
  {
    id: 10,
    name: 'The Hanged Man',
    past: 'The Hanged Man in the past position signifies a period of suspension, sacrifice, and seeing things from a new perspective. This phase in your life was marked by a time of voluntary or forced pause, where progress seemed halted, compelling you to look at your situation from a different angle. It was a period of introspection and, perhaps, relinquishment, where letting go of previous beliefs, expectations, or desires was necessary for spiritual or personal growth. Reflecting on this time, you recognize that the seeming standstill was a valuable lesson in patience, surrender, and the importance of viewing challenges through a new lens. This card suggests that the sacrifices made or the delays experienced were crucial for developing a deeper understanding of yourself and your path, teaching you that sometimes, strength lies in vulnerability and that wisdom often comes from unexpected places.',
    present:
      'Presently, The Hanged Man indicates that you are in a phase of contemplation and reevaluation, where taking a step back and viewing your life from a different perspective is essential. This card suggests a period of pause, perhaps even a feeling of being stuck or in limbo, which serves as a valuable moment for introspection and spiritual enlightenment. It encourages you to let go of the need to control outcomes and to embrace the art of surrender, allowing you to release outdated beliefs or practices. This is a time for reassessment, where you are called to sacrifice immediate gratification for longer-term benefits. The Hanged Man in the present asks you to explore the value of patience and to consider alternative approaches to your current challenges. Embrace this period of suspension as an opportunity to gain new insights and to approach life with a renewed perspective, understanding that sometimes, the best action is non-action, and the greatest progress comes from looking within.',
    future:
      "In the future position, The Hanged Man foretells a forthcoming phase where you may find yourself in a state of suspension, prompting a shift in perspective or a reconsideration of your current path. This card suggests that the future will bring a period of pause, one that invites introspection and potentially, a significant spiritual or personal revelation. It's a time where letting go of conventional expectations and embracing a new way of thinking will be crucial for your growth and progress. The Hanged Man in the future advises you to prepare for a phase where surrendering to the flow of life and accepting what cannot be changed will lead to deeper wisdom and understanding. It signifies a period of sacrifice, where what you give up will ultimately lead to greater gains in terms of personal development and insight. Embrace the upcoming time of reflection as a gift, allowing yourself to see your life from a different angle and to emerge with a clearer vision of where you truly wish to go. This card is a reminder that sometimes, the most powerful transformations occur not through action, but through stillness and surrender.",
    image: theHangedManImage,
    cardOfTheDayPrediction:
      'On this day, The Hanged Man suggests a period of pause and contemplation. You may find yourself in a situation where progress seems stalled, prompting you to look at things from a different angle. This is a time for introspection and reassessment of your values and beliefs. Sacrifices or letting go of something significant might be necessary to move forward. Embrace this period of suspension as an opportunity to gain new insights and wisdom. Today, allow yourself to release control and trust in the flow of life, understanding that sometimes, delays can lead to valuable lessons and growth.'
  },
  {
    id: 11,
    name: 'The Hermit',
    image: theHermitImage,
    past: "The Hermit in the past position reflects a period of introspection and solitude that played a significant role in your personal development. This was a time when you may have felt compelled to withdraw from the external world to seek wisdom and understanding within yourself. It represents a phase of your life where the pursuit of deeper truths and self-reflection were paramount, leading to significant insights about your life's direction and purpose. This introspective journey was crucial for your growth, offering you a clearer perspective on your path and enabling you to find inner peace and clarity. The lessons learned during this time have shaped your approach to life, emphasizing the value of inner guidance and the importance of listening to your own voice amidst the noise of the world.",
    present:
      "Currently, The Hermit indicates a phase of your life where solitude and reflection are necessary for your growth and understanding. It suggests that now is the time to turn inward, seeking answers within rather than from external sources. This card encourages you to embrace a period of self-discovery, where you can contemplate your values, goals, and the path you wish to follow. It's a call to seek solitude for meditation, contemplation, and rejuvenation of your spirit. The Hermit advises you to take this time to reflect deeply on your life, allowing you to connect with your inner wisdom and find guidance from your own experiences. This period of introspection will provide you with clarity and insight, helping you to navigate your life with a renewed sense of purpose and direction.",
    future:
      "In the future position, The Hermit foretells a coming period of introspection and personal discovery that will lead to significant insights and spiritual growth. This card suggests that you will seek, or be required to seek, solitude and quiet to contemplate your life's direction and deeper purpose. The future holds a phase where turning inward and focusing on your personal journey will be more beneficial than external pursuits. The Hermit in this position indicates that through solitude, you will gain wisdom, clarity, and a better understanding of your true self and your path in life. It's a reminder that sometimes, stepping back from the noise of the world and seeking silence is necessary to connect with your inner guidance and to make choices that are aligned with your deepest truths. This period of reflection will be a powerful and transformative experience, offering you the opportunity to emerge with a profound sense of clarity and purpose, ready to approach life with a renewed perspective.",
    cardOfTheDayPrediction:
      "Today, The Hermit foretells a journey inward, suggesting a day for solitude and reflection. You may find yourself seeking quiet moments to contemplate your life's path and your next steps. It's a day to listen to your inner voice and seek wisdom that lies within. The Hermit encourages you to embrace the value of solitude, allowing you to reconnect with your true self. Personal insights and enlightenment can be found in the stillness. Look for guidance from within, and consider taking a break from the social whirl to focus on your personal growth and understanding."
  },
  {
    id: 12,
    name: 'The Hierophant',
    image: theHierophantImage,
    past: 'In the past position, The Hierophant signifies a period in your life heavily influenced by tradition, established norms, and seeking wisdom from conventional sources. Reflecting on this time, you recognize it as a phase when guidance from authoritative figures or institutions played a crucial role in shaping your beliefs and values. This card suggests that adherence to cultural or spiritual traditions provided you with a sense of identity and belonging, possibly through education, religious practices, or community involvement. The Hierophant in the past underscores the importance of the lessons learned from these experiences, highlighting how they have contributed to your understanding of the world and your place within it. It was a time for embracing shared knowledge and values, fostering a connection to something larger than yourself and laying a foundation for your future growth.',
    present:
      "Currently, The Hierophant indicates a phase where tradition, conventional wisdom, and the guidance of mentors or institutions are of significance. This card suggests that you may be seeking clarity or validation from established systems of belief or looking to deepen your connection to cultural or spiritual roots. The Hierophant in the present position calls you to explore the wisdom of the past and to consider how it applies to your current circumstances. It's a reminder of the value of collective knowledge and the power of shared experiences, urging you to find guidance within the structures that have stood the test of time. Embrace this period as an opportunity to learn from the teachings of others, understanding that adherence to shared principles can bring a sense of order and purpose to your life.",
    future:
      'In the future position, The Hierophant foretells a coming time when tradition, established norms, and guidance from authoritative figures or institutions will play a pivotal role in your journey. This card predicts an upcoming phase where embracing or questioning traditional values and beliefs will be central to your growth and decision-making processes. The future holds opportunities for you to either reaffirm your commitment to existing systems or to seek a deeper understanding of your personal beliefs in relation to the collective wisdom. The Hierophant in the future is a reminder that your connection to tradition and the wisdom of the past can serve as a guiding light, offering stability and direction. Prepare to engage with the teachings and values that resonate with you, knowing that your spiritual and moral growth will be influenced by the balance you find between individual insight and the wisdom of the collective.',
    cardOfTheDayPrediction:
      "The Hierophant today indicates a connection with tradition and shared values. You might find yourself seeking advice from a mentor or being drawn to institutions with established beliefs and systems. It's a day for learning and adhering to cultural or spiritual norms, finding comfort and guidance within the wisdom of the past. The Hierophant encourages you to explore your spiritual roots and traditions, possibly re-affirming your faith in established systems. Embrace the role of student or teacher, and consider how shared knowledge and experiences can guide you on your path."
  },
  {
    id: 13,
    name: 'The High Priestess',
    image: theHighPriestessImage,
    past: 'In the past position, The High Priestess symbolizes a period where intuition, mystery, and understanding the unseen played a significant role in your journey. Reflecting on this time, you recognize it as a phase when you were more in touch with your inner voice and the subtle energies around you. This was a period of deep introspection and possibly seeking knowledge that lies beneath the surface. The High Priestess in the past suggests that you had moments of profound insight and psychic awareness, leading to a deeper understanding of yourself and your place in the world. It was a time when you might have felt a strong connection to the divine or the subconscious, guiding you to uncover hidden truths and to listen closely to the whispers of your intuition.',
    present:
      "Currently, The High Priestess indicates you are in a phase where intuition, secrecy, and looking beyond the obvious are crucial. This card suggests a call to trust your inner guidance and to pay attention to the dreams and symbols that your subconscious mind is presenting to you. The High Priestess in the present position urges you to embrace the mysteries of life, encouraging a deeper exploration of your spiritual path and inner knowledge. It's a reminder to listen to your intuition and to seek understanding beyond the material world, indicating that the answers you seek are found within. This is a time for reflection and meditation, allowing yourself to connect with the vast wisdom that resides in the silence and the shadows.",
    future:
      "In the future position, The High Priestess foretells a coming period marked by enhanced intuition, spiritual growth, and accessing deeper layers of knowledge and understanding. This card predicts an awakening of your psychic abilities and a deepening connection to your inner self and the universe. The future holds opportunities for significant insights and revelations that will guide you on your path. The High Priestess in the future is a reminder that the journey ahead requires you to trust in the unseen and to believe in the power of your intuition. Prepare to embark on a path of discovery, where the mysteries of life and the knowledge hidden in the depths of your soul will illuminate your way. Embrace this time as an opportunity to explore the inner landscapes of your being, understanding that the wisdom you uncover will bring clarity and guidance to your life's journey.",
    cardOfTheDayPrediction:
      "Today, The High Priestess suggests a day of intuition and mystery. You are encouraged to trust your inner instincts and to look beyond the obvious to find deeper truths. The High Priestess symbolizes the subconscious mind and the secrets it holds. Pay attention to your dreams and the subtle signs around you. It's a day for introspection and connecting with your inner wisdom. Let your intuition guide your decisions, and be open to the messages the universe is sending you."
  },
  {
    id: 14,
    name: 'The Lovers',
    image: theLoversImage,
    past: 'In the past position, The Lovers card signifies a pivotal moment of choice that deeply influenced your personal development and the direction of your life. Reflecting on this period, you recognize it as a time when you faced a significant decision regarding a relationship, your values, or a moral dilemma. This choice might have involved choosing between two paths, reflecting a deep exploration of your desires and commitments. The Lovers in the past suggests that your decision was not just about external circumstances but also about understanding your own heart and what truly matters to you. It was a moment that called for honesty and authenticity, teaching you about the power of love and the importance of alignment with your true self. This period likely set the stage for profound personal growth, emphasizing the interconnectedness of your relationships and your individual journey.',
    present:
      "Currently, The Lovers indicates that you are at a crossroads, facing a choice that could significantly affect your personal life or values. This card suggests that your decision is not merely practical but deeply emotional and spiritual, requiring you to consider what you truly value and desire. The Lovers in the present position calls for harmony within yourself and in your relationships, urging you to choose paths that reflect your authenticity and integrity. It's a reminder to listen to your heart and to recognize the power of your connections with others, understanding that love—whether romantic, platonic, or self-love—is a guiding force in making these choices. Embrace this moment as an opportunity to deepen your relationships and to align more closely with your true self, making choices that resonate with your deepest values.",
    future:
      'In the future position, The Lovers foretells an upcoming decision that will have significant implications for your personal growth and relationships. This card predicts a moment when you will need to choose between paths that reflect different aspects of your life or values, emphasizing the importance of making decisions that are true to your heart. The future brings opportunities for deeper connections and understanding, urging you to consider the role of love and values in shaping your destiny. The Lovers in the future is a reminder that your choices will not only influence your external circumstances but also your understanding of yourself and your capacity for love. Prepare to embrace this period with an open heart, knowing that the decisions you make will lead to profound learning and the strengthening of your relationships. Trust in the power of love to guide you, recognizing that true harmony comes from aligning your actions with your deepest values and desires.',
    cardOfTheDayPrediction:
      "The Lovers card today signifies a day of important choices, especially concerning personal relationships. It's a time for evaluating your values and deciding what truly matters to you. The Lovers highlight harmony and the union of opposites, suggesting that partnerships and close relationships will be prominent. Whether it's choosing a partner, deepening a relationship, or finding balance within yourself, today calls for commitment and honesty in your connections with others. Embrace love in all its forms, and remember the power of meaningful choices."
  },
  {
    id: 15,
    name: 'The Magician',
    image: theMagicianImage,
    past: 'The Magician in the past position signifies a time when you harnessed your skills, resources, and potential to create new beginnings and opportunities for yourself. This phase was marked by innovation, action, and the realization that you possess the power to shape your reality. Reflecting on this period, you recognize how your confidence and ability to manifest your desires played a crucial role in your achievements. The Magician teaches that through determination and a belief in your own capabilities, you were able to turn ideas into reality, learning the value of initiative and the power of your will.',
    present:
      "Currently, The Magician suggests you are in a position of power, with all the resources and skills necessary to achieve your goals. This card indicates a period of action and creation, where you are called to take the initiative and use your abilities to manifest your desires. The Magician in the present position is a reminder of your potential to shape your future, encouraging you to focus your will and resources with intention and clarity. It's a time to believe in your capacity for transformation and to act with confidence, knowing that you have the tools and the talent to bring about the changes you seek.",
    future:
      'In the future position, The Magician foretells a period of opportunity and manifestation, where your skills and determination will lead to the realization of your goals. This card predicts a time when you will be fully equipped to turn your visions into reality, emphasizing the importance of clear intention and the focused application of your abilities. The Magician in the future is a reminder that you possess the power to shape your destiny, encouraging you to prepare for a phase of active creation and success. Embrace this forthcoming period with confidence, knowing that your creativity and resourcefulness will be the keys to unlocking your potential and achieving your desires.',
    cardOfTheDayPrediction:
      "Today, The Magician brings a message of manifestation and resourcefulness. You have all the tools and abilities needed to realize your goals and desires. It's a day to take action and to trust in your ability to bring about change. The Magician encourages you to focus your will and intent, utilizing your skills and resources to shape your reality. Be confident in your capabilities and act with purpose. Today is a day for creativity, initiative, and the power to make things happen."
  },
  {
    id: 16,
    name: 'The Moon',
    image: theMoonImage,
    past: 'In the past position, The Moon signifies a period of confusion, illusion, and navigating through uncertainty. This phase of your life was characterized by emotional fluctuations and perhaps a time when you felt misled or unsure of the truth. Reflecting on this period, you realize that navigating through the shadows was a journey towards understanding your own subconscious and confronting hidden fears. The Moon teaches that while the path may have been unclear, this time of introspection and facing the unknown was crucial for your emotional growth and spiritual awakening. It highlights the importance of trusting your intuition to guide you through darkness, leading to a deeper awareness of your inner landscape and the external realities you face.',
    present:
      'Currently, The Moon suggests you are in a phase of uncertainty where not everything is as it seems. You might be experiencing confusion, doubts, or misleading perceptions. This card encourages you to trust your intuition and to look beyond the surface of situations, acknowledging that your path may be filled with illusions that need to be dispelled. The Moon in the present position is a reminder to pay attention to your dreams and the messages from your subconscious, as they offer guidance during this unclear time. Embrace the journey through the unknown, understanding that this is a time for introspection and discovering deeper truths about yourself and your circumstances.',
    future:
      "In the future position, The Moon forewarns of an upcoming period where you may face uncertainty, confusion, and the need to navigate through emotional and psychological complexity. This card predicts a time when clarity may be elusive, and you'll be encouraged to trust your intuition to find your way through the fog. The future holds lessons in understanding the deeper, often hidden aspects of yourself and your situation, urging you to confront your fears and to seek clarity amidst deception. The Moon in the future is a reminder that while the path ahead may seem uncertain, your inner guidance and intuition are reliable compasses. Prepare to face the mysteries with courage, knowing that this phase of exploration and introspection will ultimately lead to greater personal insight and enlightenment.",
    cardOfTheDayPrediction:
      'The Moon card today warns of a day filled with illusions and uncertainty. It suggests that things may not be as they seem, urging you to trust your intuition to navigate through confusion and deception. The Moon encourages you to confront your fears and to be aware of hidden truths lurking in the shadows. This is a time for introspection, to face the subconscious and the unknown. Pay attention to your dreams and the subtle cues your intuition offers, guiding you towards clarity and understanding in the midst of ambiguity.'
  },
  {
    id: 17,
    name: 'The Star',
    image: theStarImage,
    past: 'The Star in the past position reflects a period of healing, hope, and inspiration that followed a time of hardship. This phase in your life was marked by a sense of renewal and the comforting feeling that the universe was guiding you towards a brighter future. Reflecting on this time, you recognize how the challenges you faced led you to a deeper understanding of yourself and your place in the world. The Star teaches that even in the darkest nights, there are points of light that can guide you forward, emphasizing the importance of faith and the rejuvenating power of hope.',
    present:
      "Currently, The Star suggests that you are in a phase of healing and optimism, where you have the opportunity to focus on personal growth and the realization of your dreams. This card indicates a period of calm after the storm, where you can see the path ahead more clearly and feel supported by the universe in your endeavors. It's a time to embrace hope and to trust in the journey, knowing that you are being guided towards your highest good. The Star in the present advises you to remain open to inspiration and to believe in the possibility of a brighter future, recognizing that this is a moment for spiritual growth and inner peace.",
    future:
      'In the future position, The Star foretells a coming phase of hope, inspiration, and guidance from the universe. This card predicts a period where you will feel aligned with your true purpose and supported in your aspirations. The future holds the promise of healing and renewal, suggesting that your dreams are within reach and that you should maintain faith in your path. The Star in the future is a reminder to stay optimistic and to trust in the benevolent forces that guide you, encouraging you to follow your heart with confidence. Embrace this time as an opportunity to shine brightly, knowing that the universe is conspiring to bring you fulfillment and joy.',
    cardOfTheDayPrediction:
      "Today, The Star shines with hope, inspiration, and renewal. After a period of hardship, it signifies a time of healing and positive energy. The Star encourages you to keep faith in the future and to believe in your dreams. It's a day for optimism and looking forward, where the universe is aligned to offer support and guidance. Let go of past burdens and focus on new goals with confidence. The Star is a reminder that, even in darkness, there is light ahead promising renewal and bright prospects."
  },
  {
    id: 18,
    name: 'The Sun',
    image: theSunImage,
    past: 'The Sun in the past position reflects a period of joy, success, and clarity that has had a significant impact on your life. This phase was marked by vitality, optimism, and the achievement of goals, bringing light and warmth into your world. Reflecting on this time, you recognize the importance of embracing positivity and the role of clear vision in overcoming obstacles. The Sun teaches that happiness and success are cultivated through confidence and a bright outlook, reminding you of the growth and enlightenment you experienced during this radiant phase of your life.',
    present:
      'Currently, The Sun indicates a moment of joy, fulfillment, and success in your life. You are likely experiencing a period of clarity and vitality, where your endeavors are flourishing, and you feel a deep sense of satisfaction. This card encourages you to bask in the warmth of your achievements and to enjoy the positive energy that surrounds you. The Sun in the present position is a reminder to express gratitude for the abundance and happiness in your life, recognizing that this is a time for celebration and optimism. Embrace the light, knowing that your confidence and positive outlook are attracting even more joy and success into your world.',
    future:
      'In the future position, The Sun promises a forthcoming period of joy, success, and clarity. This card foretells a time when you will feel vibrant and full of life, with your efforts leading to significant achievements and fulfillment. The future holds bright prospects, encouraging you to maintain a positive attitude and to look forward to the happiness and abundance that await you. The Sun in the future is a reminder that optimism, confidence, and a clear vision will illuminate your path, leading to personal growth and satisfaction. Prepare to welcome a phase of radiance and enlightenment, where your inner light shines brightly, inspiring others and attracting prosperity and joy into your life.',
    cardOfTheDayPrediction:
      "Today, The Sun illuminates your path with joy, success, and vitality. It promises a day filled with clarity and the achievement of goals. The Sun encourages you to bask in the warmth of positive energies that surround you, fostering growth and happiness in your endeavors. It's a time to celebrate your accomplishments and enjoy the simple pleasures of life. Relationships may flourish under this radiant energy, and personal projects are likely to prosper. Embrace optimism and confidence, for The Sun heralds a period of light-heartedness and fulfillment."
  },
  {
    id: 19,
    name: 'The Wheel of Fortune',
    image: theWheelOfFortuneImage,
    past: "The Wheel of Fortune in the past position reflects a period marked by significant changes and pivotal moments that have shaped your current circumstances. This phase of your life was characterized by the cyclical nature of fortune, where unexpected events led to new opportunities or challenges. It represents a time when you experienced the ebb and flow of life, learning valuable lessons about the transient nature of success and adversity. Reflecting on this period, you understand that every twist of fate, whether perceived as good or bad, contributed to your growth and development, teaching you to adapt and to embrace the unpredictability of life. This card in the past position reminds you of the importance of maintaining perspective and finding balance amidst life's inevitable changes, encouraging you to view each turn of the wheel as a chance for evolution and transformation.",
    present:
      "Currently, The Wheel of Fortune suggests that you are in a phase of transition, where the forces of change are at play, shaping your life in unexpected ways. This card signifies that the present moment is marked by the potential for significant shifts in your direction or circumstances. It's a reminder to stay adaptable and open to the possibilities that come with change, trusting that the universe has a plan for you. The Wheel of Fortune encourages you to let go of the desire for control and to embrace the journey, acknowledging that life's ups and downs are part of a larger cycle of growth and renewal. This is a time to remain optimistic and to see the opportunities in every situation, understanding that what goes around comes around, and that you have the power to influence your destiny through positive thoughts and actions.",
    future:
      "In the future position, The Wheel of Fortune indicates an upcoming phase of significant change and evolution in your life. This card predicts that the future holds transformative experiences that will alter your path in ways you may not currently anticipate. It's a reminder that the wheel continues to turn, bringing new cycles of opportunities and challenges. The Wheel of Fortune in the future position encourages you to prepare for the unexpected and to remain flexible, knowing that change is the only constant in life. It suggests that by embracing the cyclical nature of your journey, you can navigate the future with resilience and optimism. This period will test your ability to adapt and to maintain faith in the universe, reminding you that every turn of the wheel is an opportunity for growth, learning, and progression. Keep an open heart and mind, ready to welcome the new phases of your life with grace and anticipation.",
    cardOfTheDayPrediction:
      "The Wheel of Fortune today signifies a day of change and cycles. It reminds you that life is constantly in motion, and today could bring unexpected turns of fate. This card encourages you to remain adaptable and to trust that the universe has a plan. Whether the wheel turns in your favor or challenges you, there's a lesson to be learned and an opportunity for growth. Embrace the cycles of life, knowing that every phase has its purpose. Today, be open to the twists and turns that come your way, as they lead you toward your destiny."
  },
  {
    id: 20,
    name: 'The World',
    image: theWorldImage,
    past: "The World in the past position indicates a cycle of completion and achievement that has left a lasting impact on your life. This phase marked the culmination of a significant journey, bringing a sense of fulfillment and wholeness. Reflecting on this period, you recognize the journey's lessons and the growth it fostered, understanding how it prepared you for the next phase of your life. The World suggests that you successfully navigated through challenges and embraced the opportunities for development, leading to a rich sense of accomplishment and an enhanced connection with the universal flow of life.",
    present:
      'Currently, The World signifies a moment of completion, satisfaction, and celebration. You may be experiencing the successful conclusion of a project, phase, or journey, bringing a sense of wholeness and achievement. This card encourages you to acknowledge your accomplishments and to recognize the interconnectedness of your experiences, understanding how they have contributed to your growth. The World in the present position is a reminder to celebrate your successes and to embrace the sense of fulfillment they bring, preparing you for the next cycle of growth and exploration with confidence and gratitude.',
    future:
      'In the future position, The World foretells a forthcoming period of completion, achievement, and celebration. This card predicts the successful conclusion of a significant phase or project in your life, bringing a profound sense of fulfillment and wholeness. The future holds a promise of accomplishment and the start of a new cycle of growth and exploration. The World in the future is a reminder that your efforts and perseverance will lead to meaningful achievements, encouraging you to continue on your path with determination and optimism. Prepare to embrace the rewards of your hard work, knowing that each end is a new beginning, offering endless possibilities for personal development and connection with the universal flow.',
    cardOfTheDayPrediction:
      "Today, The World signals a day of completion and fulfillment. It suggests that you are reaching the end of a significant phase, culminating in a sense of accomplishment and unity. The World invites you to reflect on your journey, acknowledging the lessons and experiences that have brought you to this point. It's a time for celebration and recognition of your achievements. Consider how you can share your successes and wisdom with others. Embrace the interconnectedness of all things and the sense of wholeness that comes from having traversed your path fully."
  },
  {
    id: 21,
    name: 'Tower',
    image: TowerImage,
    past: "The Tower in the past position signifies a period of sudden upheaval and transformation that dramatically changed your life's landscape. This phase likely involved an unexpected event or revelation that shattered previous beliefs, structures, or relationships, forcing you to confront the instability of what you thought was secure. Reflecting on this time, you understand how these moments of chaos were necessary for breaking down illusions and prompting significant personal growth. The Tower teaches that while destruction can be shocking and painful, it also clears the way for new foundations to be built, highlighting the importance of resilience and the opportunity for renewal that comes after a fall.",
    present:
      "Currently, The Tower indicates that you are experiencing or about to encounter a sudden change or disruption that challenges the foundation of your life. This card suggests a moment of revelation or upheaval that may feel destabilizing but is essential for breaking free from limiting structures. It's a time to embrace the chaos as an opportunity for transformation, understanding that the dismantling of old forms makes room for new growth. The Tower in the present advises you to remain flexible and open to change, recognizing that while the process may be turbulent, the end result is the liberation and clarity that comes from releasing outdated attachments.",
    future:
      'In the future position, The Tower foretells a forthcoming period of significant upheaval or revelation that will challenge existing structures in your life. This card predicts an event that may initially seem destructive or unsettling but ultimately serves to free you from longstanding constraints. The future brings a call to brace for impact, preparing for the necessary process of transformation that follows the dismantling of what no longer serves you. The Tower in the future is a reminder that true growth often comes from periods of disruption, encouraging you to find strength and resilience amidst the chaos. Embrace this phase as an opportunity for a profound personal breakthrough, leading to a deeper understanding of yourself and a renewed foundation on which to build your future.',
    cardOfTheDayPrediction:
      'The Tower today warns of a day of upheaval and revelation. It suggests that structures or beliefs you thought were stable may be challenged or dismantled. While this may be unsettling, The Tower ultimately serves to clear away illusions and false foundations, making way for truth and new beginnings. Embrace the transformative energy of this day, understanding that destruction often precedes renewal. Be open to change and the liberation that comes from releasing outdated attachments. Today, focus on resilience and the opportunity to rebuild on firmer ground.'
  },
  {
    id: 22,
    name: 'The Empress',
    image: theEmpressImage,
    past: 'The Empress in the past position symbolizes a period of fertility, creativity, and nurturing that has had a lasting impact on your life. Reflecting on this time, you see it as a phase of growth and abundance, where you were deeply connected to your senses and the natural world. This period likely involved embracing your creative power, experiencing or providing care and support, and enjoying the pleasures of life. The Empress teaches the importance of compassion, love, and the beauty of creation, suggesting that this nurturing phase was crucial for your emotional and spiritual development. It was a time that fostered a deep appreciation for the richness of life, encouraging you to cultivate beauty and harmony in your surroundings and relationships.',
    present:
      "Currently, The Empress signifies a moment of abundance, creativity, and nurturing energy in your life. This card encourages you to embrace your creative potential, to care for yourself and others with love and compassion, and to connect with the beauty of the natural world. The Empress in the present position suggests that you are in a fertile phase, where nurturing your ideas and relationships can lead to significant growth and enrichment. It's a reminder of the power of femininity, creativity, and the nurturing force that resides within you, urging you to create an environment of warmth, beauty, and abundance. Embrace this time as an opportunity to explore your creative passions, to nurture your well-being and the well-being of those around you, and to celebrate the abundance that life offers.",
    future:
      "In the future position, The Empress foretells a forthcoming period of growth, creativity, and nurturing that will bring abundance into your life. This card predicts a time of fertile opportunities, where embracing your creative power and nurturing your relationships will lead to prosperity and fulfillment. The future holds the promise of abundance, encouraging you to prepare for a phase of significant growth and the manifestation of your dreams. The Empress in the future is a reminder to remain open to the pleasures of life, to care for yourself and others with compassion, and to embrace the natural world's beauty and richness. Prepare to step into a period of creativity and abundance, knowing that your capacity to love, nurture, and create will be the source of your greatest achievements and joys.",
    cardOfTheDayPrediction:
      "Today, The Empress brings a message of nurturing, abundance, and creativity. It's a day to embrace the beauty around you and to connect deeply with your senses. The Empress encourages you to nurture yourself and others, fostering growth and harmony in your relationships. It's a time for creativity and bringing ideas to fruition, supported by the fertile energy of this card. Embrace your caring and compassionate nature, allowing your love and creativity to flow freely. The Empress symbolizes the richness of life, reminding you to appreciate and cultivate the abundance that surrounds you."
  }
]

const showQuestionModal = ref(false)
const showCards = ref(false) // Controls the visibility of the cards
const userQuestion = ref('')
const selectedCards = ref<Card[]>([])
const selectionOrder = ['Past', 'Present', 'Future']
const showCardMeaningsModal = ref(false)
const cardsToDisplay = ref(
  initialCards.map((card) => ({
    ...card,
    selected: false // Indicates whether the card has been selected
  }))
)
const readingsHistory = ref<threeCardReadings[]>([])

function drawCardsForThreeCardDeck() {
  showQuestionModal.value = true // Show the question modal when the deck is clicked
}

function handleQuestionSubmit() {
  // Trim the userQuestion to remove whitespace from both ends of the string
  const trimmedQuestion = userQuestion.value.trim()

  // Check if the trimmed question is empty
  if (!trimmedQuestion) {
    // Alert the user to enter a question if it's empty
    alert('Please enter a question.')
  } else {
    // Proceed with your existing logic if the question is valid
    showQuestionModal.value = false
    showCards.value = true

    // Shuffle and select 9 cards for the grid
    cardsToDisplay.value = initialCards
      .map((card) => ({
        ...card,
        image: card.image,
        selected: false
      }))
      .sort(() => 0.5 - Math.random())
      .slice(0, 9)
  }
}

function selectCard(selectedCard: Card) {
  if (
    selectedCards.value.length < 3 &&
    !selectedCards.value.find((c) => c.id === selectedCard.id)
  ) {
    // Directly use the selected card's image since we want it to be face up
    selectedCards.value.push(selectedCard)
  }
}

function closeAndReset() {
  // Close the modal if you have a reactive variable controlling it, e.g.:
  showCardMeaningsModal.value = false
  showQuestionModal.value = false
  showCards.value = false

  // Reset user question
  userQuestion.value = ''

  // Reset selected cards
  selectedCards.value = []

  // Optionally, reshuffle or reset the cards to display
  cardsToDisplay.value = initialCards
    .map((card) => ({
      ...card,
      selected: false
    }))
    .sort(() => Math.random() - 0.5) // Example shuffle, adjust as needed

  // Any other state reset you need
}

function getInstructionText() {
  if (showQuestionModal.value) {
    return 'Ask a question or focus on what you want to know, then submit to draw cards.'
  } else if (showCards.value && selectedCards.value.length < 3) {
    return 'Select three cards to see your past, present, and future.'
  } else if (selectedCards.value.length === 3) {
    return 'Press the button to reveal the meaning of your cards.'
  } else {
    return 'Click the top card deck to draw your cards.'
  }
}

function revealCardMeaningsInModal() {
  showCardMeaningsModal.value = true
}

function saveReadingAndClose() {
  if (selectedCards.value.length === 3) {
    const currentReading: threeCardReadings = {
      id: `reading-${Date.now()}`, // Unique ID based on the current timestamp
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

  closeAndReset()
}

// Watch the readingsHistory and save to localStorage on change
watch(
  readingsHistory,
  (newHistory) => {
    localStorage.setItem('threeCardDeckReadings', JSON.stringify(newHistory))
  },
  { deep: true }
)

// Attempt to load the history from localStorage on component mount/setup
const storedHistory = localStorage.getItem('threeCardDeckReadings')
if (storedHistory) {
  readingsHistory.value = JSON.parse(storedHistory) as threeCardReadings[]
}
</script>
