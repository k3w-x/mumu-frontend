<template>
  <div class="gallery">
    <div class="gallery-main">
      <img
        v-if="images.length > 0"
        :src="`${apiUrl}/uploads/${images[activeIndex].filename}`"
        :alt="'Фото ' + (activeIndex + 1)"
      />
      <div v-else class="gallery-empty">нет фото</div>
    </div>

    <div class="gallery-thumbs" v-if="images.length > 1">
      <div
        v-for="(img, i) in images"
        :key="img.id"
        :class="['thumb', i === activeIndex ? 'active' : '']"
        @click="activeIndex = i"
      >
        <img :src="`${apiUrl}/uploads/${img.filename}`" :alt="'Фото ' + (i + 1)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  images: {
    type: Array,
    required: true
  }
})

const apiUrl = import.meta.env.VITE_API_URL
const activeIndex = ref(0)
</script>

<style scoped>
.gallery {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.gallery-main {
  width: 100%;
  aspect-ratio: 3/4;
  border-radius: 12px;
  overflow: hidden;
  background: #f4f4f2;
}

.gallery-main img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-empty {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bbb;
  font-size: 14px;
}

.gallery-thumbs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.thumb {
  width: 72px;
  height: 90px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.2s;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb.active {
  border-color: #1a1a1a;
}
</style>