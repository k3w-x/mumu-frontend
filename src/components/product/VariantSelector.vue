<template>
  <div class="variants">
    <p class="variants-label">Размер и цвет:</p>
    <div class="variants-list">
      <button
        v-for="variant in variants"
        :key="variant.id"
        :class="['variant-btn', selectedId === variant.id ? 'active' : '', variant.stock === 0 ? 'out' : '']"
        :disabled="variant.stock === 0"
        @click="$emit('select', variant)"
      >
        {{ variant.size }} / {{ variant.color }}
        <span v-if="variant.stock === 0" class="out-label"> — нет</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  variants: {
    type: Array,
    required: true
  },
  selectedId: {
    type: Number,
    default: null
  }
})

defineEmits(['select'])
</script>

<style scoped>
.variants {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.variants-label {
  font-size: 13px;
  font-weight: 500;
  color: #444;
}

.variants-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.variant-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  color: #1a1a1a;
}

.variant-btn:hover:not(:disabled) {
  border-color: #1a1a1a;
}

.variant-btn.active {
  background: #1a1a1a;
  border-color: #1a1a1a;
  color: #fff;
}

.variant-btn.out {
  opacity: 0.4;
  cursor: not-allowed;
}

.out-label {
  font-size: 12px;
}
</style>