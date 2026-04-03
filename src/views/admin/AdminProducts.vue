<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Товары</h1>
      <BaseButton variant="primary" @click="openCreate">+ Добавить товар</BaseButton>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Бренд</th>
            <th>Категория</th>
            <th>Цена</th>
            <th>Вариантов</th>
            <th>Фото</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td class="td-id">#{{ product.id }}</td>
            <td class="td-name">{{ product.name }}</td>
            <td>
              <div class="brand-cell" v-if="product.brand_name">
                <img v-if="product.brand_logo" :src="product.brand_logo" class="brand-logo-sm" />
                {{ product.brand_name }}
              </div>
              <span v-else class="no-val">—</span>
            </td>
            <td>{{ product.category || '—' }}</td>
            <td>{{ formatPrice(product.price) }}</td>
            <td>{{ product.variants?.length || 0 }}</td>
            <td>{{ product.images?.length || 0 }}</td>
            <td class="td-actions">
              <button class="act-btn" @click="openEdit(product)">✏️</button>
              <button class="act-btn" @click="openImages(product)">🖼</button>
              <button class="act-btn" @click="openVariants(product)">📐</button>
              <button class="act-btn del" @click="remove(product.id)">🗑</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Модалка создать/редактировать -->
    <div v-if="modal.show" class="modal-overlay" @click.self="modal.show = false">
      <div class="modal">
        <h2 class="modal-title">{{ modal.isEdit ? 'Редактировать товар' : 'Новый товар' }}</h2>

        <BaseInput v-model="form.name" label="Название" placeholder="Название товара" />
        <BaseInput v-model="form.price" label="Цена (UZS)" placeholder="2500" type="number" />

        <div class="field">
          <label class="field-label">Бренд</label>
          <select v-model="form.brand_id" class="field-select">
            <option value="">— без бренда —</option>
            <option v-for="brand in brands" :key="brand.id" :value="brand.id">
              {{ brand.name }}
            </option>
          </select>
        </div>

        <div class="field">
          <label class="field-label">Категория</label>
          <select v-model="form.category_id" class="field-select">
            <option value="">— выберите —</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ '—'.repeat(cat.level - 1) }} {{ cat.name }}
            </option>
          </select>
        </div>

        <div class="field">
          <label class="field-label">Описание</label>
          <textarea v-model="form.description" class="field-textarea" placeholder="Описание товара..." rows="3" />
        </div>

        <div class="field">
          <label class="field-label">Состав и материал</label>
          <textarea v-model="form.material" class="field-textarea" placeholder="100% хлопок..." rows="2" />
        </div>

        <p v-if="modal.error" class="error">{{ modal.error }}</p>

        <div class="modal-actions">
          <BaseButton variant="outline" @click="modal.show = false">Отмена</BaseButton>
          <BaseButton variant="primary" :loading="modal.loading" @click="submitProduct">
            {{ modal.isEdit ? 'Сохранить' : 'Создать' }}
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Модалка загрузки фото -->
    <div v-if="imgModal.show" class="modal-overlay" @click.self="imgModal.show = false">
      <div class="modal">
        <h2 class="modal-title">Фото — {{ imgModal.product?.name }}</h2>

        <div class="img-preview" v-if="imgModal.product?.images?.length">
          <img
            v-for="img in imgModal.product.images"
            :key="img.id"
            :src="`${apiUrl}/uploads/${img.filename}`"
            class="thumb"
          />
        </div>
        <p v-else class="no-images">Фото пока нет</p>

        <div class="field">
          <label class="field-label">Загрузить фото (можно несколько)</label>
          <input type="file" multiple accept="image/*" @change="onFilesChange" class="file-input" />
        </div>

        <p v-if="imgModal.error" class="error">{{ imgModal.error }}</p>
        <p v-if="imgModal.success" class="success">Фото загружено!</p>

        <div class="modal-actions">
          <BaseButton variant="outline" @click="imgModal.show = false">Закрыть</BaseButton>
          <BaseButton variant="primary" :loading="imgModal.loading" @click="uploadimgs">Загрузить</BaseButton>
        </div>
      </div>
    </div>

    <!-- Модалка вариантов -->
    <div v-if="varModal.show" class="modal-overlay" @click.self="varModal.show = false">
      <div class="modal modal--wide">
        <h2 class="modal-title">Варианты — {{ varModal.product?.name }}</h2>

        <table class="table" v-if="varModal.product?.variants?.length">
          <thead>
            <tr><th>Размер</th><th>Цвет</th><th>Остаток</th><th></th></tr>
          </thead>
          <tbody>
            <tr v-for="v in varModal.product.variants" :key="v.id">
              <td>{{ v.size }}</td>
              <td>{{ v.color }}</td>
              <td>
                <input type="number" v-model="v.stock" class="stock-input" min="0" @change="updateStock(v)" />
              </td>
              <td>
                <button class="act-btn del" @click="removeVariant(v.id)">🗑</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else class="no-images">Вариантов пока нет</p>

        <div class="variant-form">
          <h3 class="variant-form-title">Добавить вариант</h3>
          <div class="variant-form-row">
            <BaseInput v-model="varForm.size" placeholder="S, M, L..." />
            <BaseInput v-model="varForm.color" placeholder="white, black..." />
            <BaseInput v-model="varForm.stock" placeholder="Остаток" type="number" />
            <BaseButton variant="primary" :loading="varModal.loading" @click="addVariant">+ Добавить</BaseButton>
          </div>
          <p v-if="varModal.error" class="error">{{ varModal.error }}</p>
        </div>

        <div class="modal-actions">
          <BaseButton variant="outline" @click="varModal.show = false">Закрыть</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getProducts } from '@/services/products'
import { getCategories } from '@/services/categories'
import { getBrands } from '@/services/brands'
import { uploadImages } from '@/services/images'
import { createVariant, updateVariant, deleteVariant } from '@/services/variants'
import api from '@/services/api'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const apiUrl = import.meta.env.VITE_API_URL
const products = ref([])
const categories = ref([])
const brands = ref([])
const loading = ref(true)

const form = ref({ name: '', price: '', category_id: '', description: '', material: '', brand_id: '' })
const modal = ref({ show: false, isEdit: false, editId: null, loading: false, error: '' })
const imgModal = ref({ show: false, product: null, files: [], loading: false, error: '', success: false })
const varModal = ref({ show: false, product: null, loading: false, error: '' })
const varForm = ref({ size: '', color: '', stock: '' })

const formatPrice = (p) => Number(p).toLocaleString('ru-RU') + ' UZS'

const load = async () => {
  loading.value = true
  const [p, c, b] = await Promise.all([getProducts(), getCategories(), getBrands()])
  products.value = p.data
  categories.value = c.data
  brands.value = b.data
  loading.value = false
}

onMounted(load)

const openCreate = () => {
  form.value = { name: '', price: '', category_id: '', description: '', material: '', brand_id: '' }
  modal.value = { show: true, isEdit: false, editId: null, loading: false, error: '' }
}

const openEdit = (product) => {
  form.value = {
    name: product.name,
    price: product.price,
    category_id: product.category_id || '',
    description: product.description || '',
    material: product.material || '',
    brand_id: product.brand_id || ''
  }
  modal.value = { show: true, isEdit: true, editId: product.id, loading: false, error: '' }
}

const submitProduct = async () => {
  modal.value.error = ''
  modal.value.loading = true
  try {
    const payload = {
      name: form.value.name,
      price: form.value.price,
      category_id: form.value.category_id,
      description: form.value.description,
      material: form.value.material,
      brand_id: form.value.brand_id || null
    }
    if (modal.value.isEdit) {
      await api.put(`/products/${modal.value.editId}`, payload)
    } else {
      await api.post('/products', payload)
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
  if (!confirm('Удалить товар?')) return
  await api.delete(`/products/${id}`)
  await load()
}

const openImages = (product) => {
  imgModal.value = { show: true, product, files: [], loading: false, error: '', success: false }
}

const onFilesChange = (e) => {
  imgModal.value.files = Array.from(e.target.files)
}

const uploadimgs = async () => {
  if (!imgModal.value.files.length) return
  imgModal.value.loading = true
  imgModal.value.error = ''
  imgModal.value.success = false
  try {
    await uploadImages(imgModal.value.product.id, imgModal.value.files)
    imgModal.value.success = true
    await load()
    imgModal.value.product = products.value.find(p => p.id === imgModal.value.product.id)
  } catch {
    imgModal.value.error = 'Ошибка загрузки'
  } finally {
    imgModal.value.loading = false
  }
}

const openVariants = (product) => {
  varModal.value = { show: true, product, loading: false, error: '' }
  varForm.value = { size: '', color: '', stock: '' }
}

const addVariant = async () => {
  varModal.value.error = ''
  varModal.value.loading = true
  try {
    await createVariant(varModal.value.product.id, varForm.value.size, varForm.value.color, varForm.value.stock)
    varForm.value = { size: '', color: '', stock: '' }
    await load()
    varModal.value.product = products.value.find(p => p.id === varModal.value.product.id)
  } catch (err) {
    varModal.value.error = err.response?.data?.error || 'Ошибка'
  } finally {
    varModal.value.loading = false
  }
}

const updateStock = async (variant) => {
  await updateVariant(variant.id, variant.stock)
}

const removeVariant = async (id) => {
  if (!confirm('Удалить вариант?')) return
  await deleteVariant(id)
  await load()
  varModal.value.product = products.value.find(p => p.id === varModal.value.product.id)
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
.td-actions { display: flex; gap: 6px; }
.no-val { color: #ccc; font-size: 13px; }
.brand-cell { display: flex; align-items: center; gap: 6px; font-size: 13px; }
.brand-logo-sm { width: 24px; height: 24px; object-fit: contain; }
.act-btn {
  background: none; border: 1px solid #e8e8e4; border-radius: 6px;
  padding: 4px 8px; font-size: 14px; cursor: pointer; transition: all 0.2s;
}
.act-btn:hover { background: #f4f4f2; }
.act-btn.del:hover { border-color: #c0392b; background: #fff0ee; }
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.4);
  display: flex; align-items: center; justify-content: center; z-index: 200;
}
.modal {
  background: #fff; border-radius: 16px; padding: 32px;
  width: 100%; max-width: 480px; display: flex; flex-direction: column;
  gap: 14px; max-height: 90vh; overflow-y: auto;
}
.modal--wide { max-width: 640px; }
.modal-title { font-size: 20px; font-weight: 700; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 13px; font-weight: 500; color: #444; }
.field-select {
  width: 100%; padding: 10px 14px; border: 1px solid #ddd;
  border-radius: 8px; font-size: 15px; outline: none; background: #fff;
}
.field-select:focus { border-color: #1a1a1a; }
.field-textarea {
  width: 100%; padding: 10px 14px; border: 1px solid #ddd;
  border-radius: 8px; font-size: 14px; outline: none; resize: vertical; font-family: inherit;
}
.field-textarea:focus { border-color: #1a1a1a; }
.img-preview { display: flex; flex-wrap: wrap; gap: 8px; }
.thumb { width: 80px; height: 100px; object-fit: cover; border-radius: 8px; border: 1px solid #e8e8e4; }
.file-input { width: 100%; padding: 8px; border: 1px dashed #ddd; border-radius: 8px; font-size: 14px; cursor: pointer; }
.no-images { color: #aaa; font-size: 14px; text-align: center; padding: 16px 0; }
.variant-form { border-top: 1px solid #e8e8e4; padding-top: 16px; }
.variant-form-title { font-size: 15px; font-weight: 600; margin-bottom: 12px; }
.variant-form-row { display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 10px; align-items: flex-end; }
.stock-input { width: 80px; padding: 6px 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; outline: none; }
.error { color: #c0392b; font-size: 14px; }
.success { color: green; font-size: 14px; }
</style>