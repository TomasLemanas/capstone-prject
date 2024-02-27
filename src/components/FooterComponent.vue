<template>
  <footer class="footer mt-4 py-3">
    <div class="container text-center">
      <span class="text-muted">Explore More:</span>
      <nav>
        <RouterLink to="/home" class="mx-2">Home</RouterLink> |
        <RouterLink to="/card-of-the-day" class="mx-2">Card Of The Day</RouterLink> |
        <RouterLink to="/three-card-deck" class="mx-2">Three Card Deck</RouterLink> |
        <RouterLink to="/history" class="mx-2">History</RouterLink>
      </nav>
    </div>
  </footer>
</template>

<script lang="ts">
import { RouterLink } from 'vue-router';

export default {
  components: {
    RouterLink
  }
};
</script>

<style scoped>
.footer {
  width: 100%;
  height: 100%;
  background-color: #ab6a6a;
  margin-top: 100px;
  font-family: "Yusei Magic", sans-serif;
}

</style>
