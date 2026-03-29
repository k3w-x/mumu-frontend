<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Промокоды</h1>
      <BaseButton variant="primary" @click="modal.show = true">+ Создать</BaseButton>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Код</th>
            <th>Скидка</th>
            <th>Статус</th>
            <th>Создан</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="promo in promocodes" :key="promo.id">
            <td class="td-id">#{{ promo.id }}</td>
            <td class="td-code">{{ promo.code }}</td>
            <td><span class="discount-badge">−{{ promo.discount_percent }}%</span></td>
            <td>
              <span :class="['status-pill', promo.is_active ? 'active' : 'inactive']">
                {{ promo.is_active ? 'Активен' : 'Отключён' }}
              </span>
            </td>
            <td class="td-date">{{ formatDate(promo.created_at) }}</td>
            <td>
              <button class="act-btn del" @click="remove(promo.id)">🗑</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="modal.show" class="modal-overlay" @click.self="modal.show = false">
      <div class="modal">
        <h2 class="modal-title">Новый промокод</h2>

        <div class="field">
          <label class="field-label">Код промокода</label>
          <input
            v-model="form.code"
            class="field-input"
            placeholder="MUMU2026"
            style="text-transform: uppercase"
          />
          <p class="field-hint">Только латиница и цифры, будет сохранён заглавными буквами</p>
        </div>

        <div class="field">
          <label class="field-label">Скидка (%)</label>
          <input
            v-model.number="form.discount_percent"
            class="field-input"
            type="number"
            min="1"
            max="100"
            placeholder="10"
          />
        </div>

        <p v-if="modal.error" class="error">{{ modal.error }}</p>

        <div class="modal-actions">
          <BaseButton variant="outline" @click="modal.show = false">Отмена</BaseButton>
          <BaseButton variant="primary" :loading="modal.loading" @click="submit">
            Создать
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getPromocodes, createPromocode, deletePromocode } from '@/services/promocodes'
import BaseButton from '@/components/ui/BaseButton.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const promocodes = ref([])
const loading = ref(true)
const form = ref({ code: '', discount_percent: '' })
const modal = ref({ show: false, loading: false, error: '' })

const load = async () => {
  loading.value = true
  const res = await getPromocodes()
  promocodes.value = res.data
  loading.value = false
}

onMounted(load)

const submit = async () => {
  modal.value.error = ''
  if (!form.value.code || !form.value.discount_percent) {
    modal.value.error = 'Заполните все поля'
    return
  }
  modal.value.loading = true
  try {
    await createPromocode(form.value.code, form.value.discount_percent)
    form.value = { code: '', discount_percent: '' }
    modal.value.show = false
    await load()
  } catch (err) {
    modal.value.error = err.response?.data?.error || 'Ошибка'
  } finally {
    modal.value.loading = false
  }
}

const remove = async (id) => {
  if (!confirm('Удалить промокод?')) return
  await deletePromocode(id)
  await load()
}

const formatDate = (d) =>
  new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' })
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
.td-code { font-weight: 700; font-family: monospace; font-size: 15px; letter-spacing: 1px; }
.td-date { color: #888; font-size: 13px; }
.discount-badge {
  background: #eafaf1; color: #1e8449;
  padding: 4px 10px; border-radius: 20px;
  font-size: 13px; font-weight: 700;
}
.status-pill {
  padding: 4px 10px; border-radius: 20px;
  font-size: 12px; font-weight: 600;
}
.status-pill.active { background: #e8f4fd; color: #2980b9; }
.status-pill.inactive { background: #f4f4f2; color: #888; }
.act-btn {
  background: none; border: 1px solid #e8e8e4; border-radius: 6px;
  padding: 4px 8px; font-size: 14px; cursor: pointer; transition: all 0.2s;
}
.act-btn.del:hover { border-color: #c0392b; background: #fff0ee; }
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
.field { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 13px; font-weight: 500; color: #444; }
.field-input {
  padding: 10px 14px; border: 1px solid #ddd; border-radius: 8px;
  font-size: 15px; outline: none; transition: border-color 0.2s;
}
.field-input:focus { border-color: #1a1a1a; }
.field-hint { font-size: 12px; color: #aaa; }
.error { color: #c0392b; font-size: 14px; }
</style>