import './main.css'
import './components/top-bar.css'
import './views/home/HomePage.css'
import './views/card-of-the-day/CardOfTheDay.css'
import './views/three-card-deck/ThreeCardDeck.css'
import './views/history/HistoryPage.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
