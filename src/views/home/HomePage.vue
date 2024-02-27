<template>
  <main class="container py-4 " id="home-wrap">
    <h1 id="home-page-title">Select</h1>
    <div class="row">
      <div class="col-md-4">
        <RouterLink to="/card-of-the-day" class="card">
          <div class="card-body">
            <h5 class="card-title">Card of the Day</h5>
            <img src="../../assets/one-tarot-card.jpg" class="home-img" alt="three tarot cards">
            <div class="card-text-wrap">
              <p>The "Card of the Day" feature from our tarot deck is a unique and insightful tool designed for both novices and seasoned tarot enthusiasts alike. Each day, a different card is drawn from the deck, offering a focal point for reflection, guidance, and personal growth. This daily card provides insights into the day's potential energies, challenges, and opportunities, encouraging users to align their thoughts and actions with the universe's rhythms. Whether you're seeking a moment of contemplation or direction for your daily activities, the "Card of the Day" serves as a spiritual compass, guiding you through the complexities of life with wisdom and intuition. It's an invitation to explore the depths of your psyche, make mindful decisions, and connect with a larger cosmic narrative, one card at a time.</p>
            </div>
          </div>
        </RouterLink>
      </div>
      <div class="col-md-4">
        <RouterLink to="/three-card-deck" div class="card">
          <div class="card-body">
            <h5 class="card-title">Three Card Deck</h5>
            <img src="../../assets/three-cards-image.jpg" class="home-img" alt="three tarot cards">
            <div class="card-text-wrap">
              <p>The Three Card Tarot Deck feature on our website offers a concise yet profound tool for those seeking insights and answers to their pressing questions. By focusing on a past, present, and future spread, users can gain a holistic understanding of the situation at hand. Upon asking a question, the deck reveals three cards, each symbolizing influential energies or events related to your query's timeline. The first card sheds light on the past conditions or events that have led to your current circumstances. The second card reflects the current state or challenge, providing clarity and guidance on the matter. Finally, the third card offers a glimpse into the potential future outcome, guiding your path forward with foresight and wisdom. This interactive experience is designed to help users navigate life's complexities with greater awareness and intuition, making the Three Card Tarot Deck an invaluable resource for personal growth and decision-making.</p>
            </div>
          </div>
        </RouterLink>
      </div>
       <RouterLink to="/history" class="col-md-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">History</h5>
            <img src="../../assets/log-book.jpg" class="home-img" alt="three tarot cards">
            <div class="card-text-wrap">
              <p>Our website now features a Personal Question History section, where you can effortlessly review your previously asked questions along with the tarot readings provided. This convenient tool allows for personal reflection on the accuracy and impact of each reading over time. It's designed to help you track your spiritual journey and the insights gained from the tarot deck, enabling a deeper understanding of your own life's path and the guidance received. This feature is a step towards making your tarot experience more interactive and introspective.</p>
            </div>
          </div>
        </div>
      </RouterLink>
    </div>
  </main>
</template>
