<template>
  <div class="cat-nav">
    <button
      :class="['cat-root', activeCategory === null ? 'active' : '']"
      @click="$emit('select', null)"
    >
      Все товары
    </button>

    <div v-for="parent in tree" :key="parent.id" class="cat-group">
      <button
        :class="['cat-parent', isParentActive(parent) ? 'active' : '']"
        @click="toggleGroup(parent)"
      >
        <span>{{ parent.name }}</span>
        <span class="arrow" :class="{ open: openGroups.includes(parent.id) }">›</span>
      </button>

      <transition name="slide">
        <div v-if="openGroups.includes(parent.id)" class="cat-children">
          <button
            :class="['cat-child', activeCategory === parent.name ? 'active' : '']"
            @click="$emit('select', parent.name)"
          >
            Все в «{{ parent.name }}»
          </button>
          <button
            v-for="child in parent.children"
            :key="child.id"
            :class="['cat-child', activeCategory === child.name ? 'active' : '']"
            @click="$emit('select', child.name)"
          >
            {{ child.name }}
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  tree: { type: Array, required: true },
  activeCategory: { type: String, default: null }
})

defineEmits(['select'])

const openGroups = ref([])

const toggleGroup = (parent) => {
  const idx = openGroups.value.indexOf(parent.id)
  if (idx >= 0) {
    openGroups.value.splice(idx, 1)
  } else {
    openGroups.value.push(parent.id)
  }
}

const isParentActive = (parent) => {
  if (props.activeCategory === parent.name) return true
  return parent.children?.some(c => c.name === props.activeCategory)
}
</script>

<style scoped>
.cat-nav {
  width: 220px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cat-root {
  width: 100%;
  text-align: left;
  padding: 10px 14px;
  border-radius: 8px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  color: #555;
  transition: all 0.15s;
  margin-bottom: 8px;
}

.cat-root:hover { background: #f0f0ee; color: #1a1a1a; }
.cat-root.active { background: #1a1a1a; color: #fff; }

.cat-group {
  display: flex;
  flex-direction: column;
}

.cat-parent {
  width: 100%;
  text-align: left;
  padding: 10px 14px;
  border-radius: 8px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  color: #1a1a1a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.15s;
}

.cat-parent:hover { background: #f0f0ee; }
.cat-parent.active { color: #1a1a1a; }

.arrow {
  font-size: 18px;
  color: #aaa;
  transition: transform 0.2s;
  line-height: 1;
}

.arrow.open { transform: rotate(90deg); }

.cat-children {
  display: flex;
  flex-direction: column;
  padding-left: 12px;
  overflow: hidden;
}

.cat-child {
  width: 100%;
  text-align: left;
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  background: transparent;
  font-size: 13px;
  cursor: pointer;
  color: #666;
  transition: all 0.15s;
}

.cat-child:hover { background: #f4f4f2; color: #1a1a1a; }
.cat-child.active {
  background: #f0f0ee;
  color: #1a1a1a;
  font-weight: 600;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
  max-height: 300px;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>