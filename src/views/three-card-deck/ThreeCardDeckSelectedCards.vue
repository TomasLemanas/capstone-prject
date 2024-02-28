<template>
   <div v-for="card in selectedCards" :key="card.id">
        <div>
          <img :src="card.image" :alt="card.name" class="revealed-tarot-card" />
        </div>
      </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  selectedCards: Array<{ id: number; name: string; image: string }>;
}>();
</script>
