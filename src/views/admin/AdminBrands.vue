<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Бренды</h1>
      <BaseButton variant="primary" @click="modal.show = true">+ Добавить</BaseButton>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="brand in brands" :key="brand.id">
            <td class="td-id">#{{ brand.id }}</td>
            <td class="td-name">{{ brand.name }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modal.show" class="modal-overlay" @click.self="modal.show = false">
      <div class="modal">
        <h2 class="modal-title">Новый бренд</h2>
        <BaseInput v-model="form.name" label="Название" placeholder="Nike, Zara..." />
        <p v-if="modal.error" class="error">{{ modal.error }}</p>
        <div class="modal-actions">
          <BaseButton variant="outline" @click="modal.show = false">Отмена</BaseButton>
          <BaseButton variant="primary" :loading="modal.loading" @click="submit">Создать</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBrands } from '@/services/brands'
import api from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const brands = ref([])
const loading = ref(true)
const form = ref({ name: '' })
const modal = ref({ show: false, loading: false, error: '' })

const load = async () => {
  loading.value = true
  const res = await getBrands()
  brands.value = res.data
  loading.value = false
}

onMounted(load)

const submit = async () => {
  modal.value.error = ''
  modal.value.loading = true
  try {
    await api.post('/brands', { name: form.value.name })
    form.value.name = ''
    modal.value.show = false
    await load()
  } catch (err) {
    modal.value.error = err.response?.data?.error || 'Ошибка'
  } finally {
    modal.value.loading = false
  }
}
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.page-title { font-size: 24px; font-weight: 700; }
.table-wrap { background: #fff; border-radius: 12px; border: 1px solid #e8e8e4; overflow: hidden; }
.table { width: 100%; border-collapse: collapse; font-size: 14px; }
.table th {
  text-align: left; padding: 12px 16px; background: #f8f8f6;
  border-bottom: 1px solid #e8e8e4; font-weight: 600; color: #555;
  font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;
}
.table td { padding: 12px 16px; border-bottom: 1px solid #f0f0ee; }
.table tbody tr:last-child td { border-bottom: none; }
.table tbody tr:hover { background: #fafaf8; }
.td-id { color: #999; font-size: 12px; }
.td-name { font-weight: 500; }
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center; z-index: 200;
}
.modal {
  background: #fff; border-radius: 16px; padding: 32px;
  width: 100%; max-width: 400px; display: flex; flex-direction: column; gap: 16px;
}
.modal-title { font-size: 20px; font-weight: 700; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; }
.error { color: #c0392b; font-size: 14px; }
</style>