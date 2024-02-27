<script setup lang="ts">
import { ref, provide } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import  FooterComponent from '../src/components/FooterComponent.vue'

const isNavCollapsed = ref(true);
const readingsHistory = ref([]);
provide('readingsHistory', readingsHistory);

</script>
<template>
  <header>
     <div class="container-fluid navbar-expand-md pt-5" id="top-bar-wrap">
      <img src="@/assets/hamburger.png" alt="Menu" @click="isNavCollapsed = !isNavCollapsed" class="menu-icon"/>
      <div class="container-fluid pt-3 pb-3" id="logo">Personal Fortune Teller</div>
      <div class="collapse navbar-collapse" :class="{'show': !isNavCollapsed}" id="navbarNav">
        <div class="container">
          <nav>
            <div class="row" id="nav-bar">
          <div class="col text-center">
            <div>
              <RouterLink to="/home"><img alt="home logo" class="icon" src="@/assets/house.png" @click="isNavCollapsed = !isNavCollapsed" /></RouterLink>
            </div>
            <RouterLink to="/home" @click="isNavCollapsed = !isNavCollapsed">Home</RouterLink>
          </div>
          <div class="col text-center">
            <div>
              <RouterLink to="/card-of-the-day" @click="isNavCollapsed = !isNavCollapsed"><img alt="home logo" class="icon" src="@/assets/one-card.png"/></RouterLink>
            </div>
            <RouterLink to="/card-of-the-day" @click="isNavCollapsed = !isNavCollapsed">Card Of The Day</RouterLink>
          </div>
          <div class="col text-center">
            <div>
              <RouterLink to="/three-card-deck" @click="isNavCollapsed = !isNavCollapsed"><img alt="three cards" class="icon" src="@/assets/three-card.png" /></RouterLink>
            </div>
            <RouterLink to="/three-card-deck" @click="isNavCollapsed = !isNavCollapsed">Three Card Deck</RouterLink>
          </div>
          <div class="col text-center">
            <div>
              <RouterLink to="/history" @click="isNavCollapsed = !isNavCollapsed"><img alt="history" class="icon" src="@/assets/history-page.png" /></RouterLink>
            </div>
            <RouterLink to="/history" @click="isNavCollapsed = !isNavCollapsed">History</RouterLink>
          </div>
        </div>
      </nav>
    </div>
    </div>
    </div>
  </header>
  <div class="router-view-wrap">
  <RouterView />
  </div>
  <FooterComponent />
</template>


<style scoped>

</style>
