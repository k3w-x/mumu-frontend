<template>
  <button
    :class="['btn', `btn--${variant}`]"
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <span v-if="loading" class="btn-spinner"></span>
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary' // primary | outline | danger
  },
  disabled: Boolean,
  loading: Boolean
})

defineEmits(['click'])
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn--primary {
  background: #1a1a1a;
  color: #fff;
}

.btn--primary:hover:not(:disabled) {
  opacity: 0.8;
}

.btn--outline {
  background: transparent;
  color: #1a1a1a;
  border: 1px solid #1a1a1a;
}

.btn--outline:hover:not(:disabled) {
  background: #1a1a1a;
  color: #fff;
}

.btn--danger {
  background: transparent;
  color: #c0392b;
  border: 1px solid #c0392b;
}

.btn--danger:hover:not(:disabled) {
  background: #c0392b;
  color: #fff;
}

.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>