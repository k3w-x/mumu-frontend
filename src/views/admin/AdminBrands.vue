<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Бренды</h1>
      <BaseButton variant="primary" @click="openCreate">+ Добавить</BaseButton>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Логотип</th>
            <th>Название</th>
            <th>Описание</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="brand in brands" :key="brand.id">
            <td class="td-id">#{{ brand.id }}</td>
            <td>
              <img v-if="brand.logo_url" :src="brand.logo_url" class="brand-logo" alt="" />
              <span v-else class="no-logo">—</span>
            </td>
            <td class="td-name">{{ brand.name }}</td>
            <td class="td-desc">{{ brand.description || '—' }}</td>
            <td class="td-actions">
              <button class="act-btn edit" @click="openEdit(brand)">✏️</button>
              <button class="act-btn del" @click="remove(brand.id)">🗑</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modal.show" class="modal-overlay" @click.self="modal.show = false">
      <div class="modal">
        <h2 class="modal-title">{{ modal.isEdit ? 'Редактировать бренд' : 'Новый бренд' }}</h2>

        <BaseInput v-model="form.name" label="Название" placeholder="Nike, Zara, Adidas..." />
        <BaseInput v-model="form.logo_url" label="Ссылка на логотип (URL)" placeholder="https://..." />
        
        <div class="field">
          <label class="field-label">Описание</label>
          <textarea v-model="form.description" class="field-textarea" placeholder="Краткое описание бренда..." rows="3" />
        </div>

        <div v-if="form.logo_url" class="logo-preview">
          <img :src="form.logo_url" alt="Превью логотипа" />
        </div>

        <p v-if="modal.error" class="error">{{ modal.error }}</p>

        <div class="modal-actions">
          <BaseButton variant="outline" @click="modal.show = false">Отмена</BaseButton>
          <BaseButton variant="primary" :loading="modal.loading" @click="submit">
            {{ modal.isEdit ? 'Сохранить' : 'Создать' }}
          </BaseButton>
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
const form = ref({ name: '', logo_url: '', description: '' })
const modal = ref({ show: false, isEdit: false, editId: null, loading: false, error: '' })

const load = async () => {
  loading.value = true
  const res = await getBrands()
  brands.value = res.data
  loading.value = false
}

onMounted(load)

const openCreate = () => {
  form.value = { name: '', logo_url: '', description: '' }
  modal.value = { show: true, isEdit: false, editId: null, loading: false, error: '' }
}

const openEdit = (brand) => {
  form.value = {
    name: brand.name,
    logo_url: brand.logo_url || '',
    description: brand.description || ''
  }
  modal.value = { show: true, isEdit: true, editId: brand.id, loading: false, error: '' }
}

const submit = async () => {
  modal.value.error = ''
  modal.value.loading = true
  try {
    const payload = {
      name: form.value.name,
      logo_url: form.value.logo_url || null,
      description: form.value.description || null
    }
    if (modal.value.isEdit) {
      await api.put(`/brands/${modal.value.editId}`, payload)
    } else {
      await api.post('/brands', payload)
    }
    modal.value.show = false
    await load()
  } catch (err) {
    modal.value.error = err.response?.data?.error || 'Ошибка'
  } finally {
    modal.value.loading = false
  }
}

const remove = async (id) => {
  if (!confirm('Удалить бренд?')) return
  try {
    await api.delete(`/brands/${id}`)
    await load()
  } catch (err) {
    alert('Ошибка удаления')
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
.table td { padding: 12px 16px; border-bottom: 1px solid #f0f0ee; vertical-align: middle; }
.table tbody tr:last-child td { border-bottom: none; }
.table tbody tr:hover { background: #fafaf8; }
.td-id { color: #999; font-size: 12px; }
.td-name { font-weight: 500; }
.td-desc { color: #777; font-size: 13px; max-width: 250px; }
.td-actions { display: flex; gap: 6px; }
.act-btn {
  background: none; border: 1px solid #e8e8e4; border-radius: 6px;
  padding: 4px 8px; font-size: 14px; cursor: pointer; transition: all 0.2s;
}
.act-btn:hover { background: #f4f4f2; }
.act-btn.del:hover { border-color: #c0392b; background: #fff0ee; }
.brand-logo { width: 40px; height: 40px; object-fit: contain; border-radius: 6px; border: 1px solid #eee; }
.no-logo { color: #ccc; font-size: 12px; }
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center; z-index: 200;
}
.modal {
  background: #fff; border-radius: 16px; padding: 32px;
  width: 100%; max-width: 440px; display: flex; flex-direction: column; gap: 16px;
  max-height: 90vh; overflow-y: auto;
}
.modal-title { font-size: 20px; font-weight: 700; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; }
.field-label { font-size: 13px; font-weight: 500; color: #444; display: block; margin-bottom: 6px; }
.field-textarea {
  width: 100%; padding: 10px 14px; border: 1px solid #ddd; border-radius: 8px;
  font-size: 15px; outline: none; resize: vertical; font-family: inherit;
}
.field-textarea:focus { border-color: #1a1a1a; }
.logo-preview { text-align: center; padding: 8px; border: 1px solid #eee; border-radius: 8px; }
.logo-preview img { max-height: 80px; object-fit: contain; }
.error { color: #c0392b; font-size: 14px; }
</style>