<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Категории</h1>
      <BaseButton variant="primary" @click="openCreate">+ Добавить</BaseButton>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Уровень</th>
            <th>Пол</th>
            <th>Родитель</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categories" :key="cat.id">
            <td class="td-id">#{{ cat.id }}</td>
            <td class="td-name" :style="{ paddingLeft: `${(cat.level - 1) * 20 + 16}px` }">
              <span class="level-dot" v-if="cat.level > 1">└</span>
              {{ cat.name }}
            </td>
            <td><span class="badge">Ур. {{ cat.level }}</span></td>
            <td>
              <span v-if="cat.gender === 'male'" class="badge badge-blue">Для него</span>
              <span v-else-if="cat.gender === 'female'" class="badge badge-pink">Для неё</span>
              <span v-else class="badge badge-gray">—</span>
            </td>
            <td>{{ parentName(cat.parent_id) }}</td>
            <td class="td-actions">
              <button class="act-btn edit" @click="openEdit(cat)">✏️</button>
              <button class="act-btn del" @click="remove(cat.id)">🗑</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modal.show" class="modal-overlay" @click.self="modal.show = false">
      <div class="modal">
        <h2 class="modal-title">{{ modal.isEdit ? 'Редактировать' : 'Новая категория' }}</h2>

        <BaseInput v-model="form.name" label="Название" placeholder="Название категории" />

        <BaseInput v-model="form.slug" label="Slug (латиницей)" placeholder="например: men-tshirts" />

        <div class="field">
          <label class="field-label">Пол</label>
          <select v-model="form.gender" class="field-select">
            <option value="">— не указан —</option>
            <option value="male">Для него</option>
            <option value="female">Для неё</option>
          </select>
        </div>

        <div class="field">
          <label class="field-label">Родительская категория</label>
          <select v-model="form.parent_id" class="field-select">
            <option value="">— нет (корневая) —</option>
            <option
              v-for="cat in categories.filter(c => !modal.isEdit || c.id !== modal.editId)"
              :key="cat.id"
              :value="cat.id"
            >
              {{ '—'.repeat(cat.level - 1) }} {{ cat.name }}
            </option>
          </select>
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
import { getCategories } from '@/services/categories'
import api from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const categories = ref([])
const loading = ref(true)
const form = ref({ name: '', slug: '', parent_id: '', gender: '' })
const modal = ref({ show: false, isEdit: false, editId: null, loading: false, error: '' })

const parentName = (id) => {
  if (!id) return '—'
  const cat = categories.value.find(c => c.id === id)
  return cat?.name || '—'
}

const load = async () => {
  loading.value = true
  const res = await getCategories()
  categories.value = res.data
  loading.value = false
}

onMounted(load)

const openCreate = () => {
  form.value = { name: '', slug: '', parent_id: '', gender: '' }
  modal.value = { show: true, isEdit: false, editId: null, loading: false, error: '' }
}

const openEdit = (cat) => {
  form.value = {
    name: cat.name,
    slug: cat.slug || '',
    parent_id: cat.parent_id || '',
    gender: cat.gender || ''
  }
  modal.value = { show: true, isEdit: true, editId: cat.id, loading: false, error: '' }
}

const submit = async () => {
  modal.value.error = ''
  modal.value.loading = true
  try {
    const payload = {
      name: form.value.name,
      slug: form.value.slug || null,
      parent_id: form.value.parent_id || null,
      gender: form.value.gender || null
    }
    if (modal.value.isEdit) {
      await api.put(`/categories/${modal.value.editId}`, payload)
    } else {
      await api.post('/categories', payload)
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
  if (!confirm('Удалить категорию?')) return
  await api.delete(`/categories/${id}`)
  await load()
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.page-title { font-size: 24px; font-weight: 700; }
.table-wrap {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e8e4;
  overflow: hidden;
}
.table { width: 100%; border-collapse: collapse; font-size: 14px; }
.table th {
  text-align: left;
  padding: 12px 16px;
  background: #f8f8f6;
  border-bottom: 1px solid #e8e8e4;
  font-weight: 600;
  color: #555;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0ee;
}
.table tbody tr:last-child td { border-bottom: none; }
.table tbody tr:hover { background: #fafaf8; }
.td-id { color: #999; font-size: 12px; }
.td-name { font-weight: 500; }
.td-actions { display: flex; gap: 6px; }
.act-btn {
  background: none;
  border: 1px solid #e8e8e4;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}
.act-btn:hover { background: #f4f4f2; }
.act-btn.del:hover { border-color: #c0392b; background: #fff0ee; }
.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: #f0f0ee;
  color: #555;
}
.badge-blue { background: #e8f0fe; color: #1a73e8; }
.badge-pink { background: #fce4ec; color: #e91e63; }
.badge-gray { background: #f0f0ee; color: #999; }
.level-dot { color: #999; margin-right: 4px; }
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}
.modal {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.modal-title { font-size: 20px; font-weight: 700; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; }
.field-label { font-size: 13px; font-weight: 500; color: #444; display: block; margin-bottom: 6px; }
.field-select {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  background: #fff;
}
.field-select:focus { border-color: #1a1a1a; }
.error { color: #c0392b; font-size: 14px; }
</style>