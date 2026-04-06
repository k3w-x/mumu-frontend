<template>
  <div class="legit-page">

    <!-- Шапка -->
    <div class="legit-hero">
      <p class="legit-label">MUMU LEGIT CHECK</p>
      <h1 class="legit-title">Проверка подлинности</h1>
      <p class="legit-sub">Каждый товар из MUMU Store проходит базовую проверку автоматически. Хотите проверить свои вещи — выберите тариф.</p>
    </div>

    <!-- Процесс проверки -->
    <div class="section">
      <p class="section-label">КАК МЫ ПРОВЕРЯЕМ</p>
      <div class="process-grid">
        <div class="process-item">
          <div class="process-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <p class="process-name">Бирки</p>
          <p class="process-desc">Проверка шрифтов, цветов и качества печати оригинальных бирок</p>
        </div>
        <div class="process-item">
          <div class="process-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4l3 3"/>
            </svg>
          </div>
          <p class="process-name">Серийные номера</p>
          <p class="process-desc">Верификация уникальных серийных номеров через официальные базы</p>
        </div>
        <div class="process-item">
          <div class="process-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M4 6h16M4 12h16M4 18h7"/>
            </svg>
          </div>
          <p class="process-name">Швы и стежки</p>
          <p class="process-desc">Анализ качества швов, плотности стежков и соответствия оригиналу</p>
        </div>
        <div class="process-item">
          <div class="process-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 3H8L6 7h12l-2-4z"/>
            </svg>
          </div>
          <p class="process-name">Упаковка</p>
          <p class="process-desc">Проверка коробки, пакетов, наполнителей и всех вложений</p>
        </div>
        <div class="process-item">
          <div class="process-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <p class="process-name">Подошва</p>
          <p class="process-desc">Детальный осмотр подошвы, логотипов и текстуры поверхности</p>
        </div>
        <div class="process-item">
          <div class="process-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <p class="process-name">Материал</p>
          <p class="process-desc">Оценка качества тканей, кожи и других материалов на соответствие оригиналу</p>
        </div>
      </div>
    </div>

    <!-- Тарифы -->
    <div class="section">
      <p class="section-label">ТАРИФЫ</p>
      <div class="plans">

        <div class="plan">
          <div class="plan-header">
            <p class="plan-name">Базовый</p>
            <p class="plan-price">Бесплатно</p>
            <p class="plan-note">Автоматически для всех заказов MUMU</p>
          </div>
          <ul class="plan-features">
            <li><span class="check">✓</span> Проверка бирок</li>
            <li><span class="check">✓</span> Визуальный осмотр</li>
            <li><span class="check">✓</span> Проверка упаковки</li>
            <li><span class="cross">✕</span> Серийные номера</li>
            <li><span class="cross">✕</span> Детальный анализ материала</li>
            <li><span class="cross">✕</span> Сертификат подлинности</li>
          </ul>
          <p class="plan-time">⏱ Результат сразу</p>
        </div>

        <div class="plan plan--featured">
          <div class="plan-badge">ПОПУЛЯРНЫЙ</div>
          <div class="plan-header">
            <p class="plan-name">Продвинутый</p>
            <p class="plan-price">100 000 <span>сум</span></p>
            <p class="plan-note">за 1 позицию</p>
          </div>
          <ul class="plan-features">
            <li><span class="check">✓</span> Проверка бирок</li>
            <li><span class="check">✓</span> Визуальный осмотр</li>
            <li><span class="check">✓</span> Проверка упаковки</li>
            <li><span class="check">✓</span> Серийные номера</li>
            <li><span class="check">✓</span> Детальный анализ материала</li>
            <li><span class="cross">✕</span> Сертификат подлинности</li>
          </ul>
          <p class="plan-time">⏱ До 1 суток</p>
          <button class="plan-btn" @click="scrollToForm('advanced')">Отправить на проверку</button>
        </div>

        <div class="plan plan--premium">
          <div class="plan-header">
            <p class="plan-name">Total Legit</p>
            <p class="plan-price">180 000 <span>сум</span></p>
            <p class="plan-note">за 1 позицию</p>
          </div>
          <ul class="plan-features">
            <li><span class="check">✓</span> Проверка бирок</li>
            <li><span class="check">✓</span> Визуальный осмотр</li>
            <li><span class="check">✓</span> Проверка упаковки</li>
            <li><span class="check">✓</span> Серийные номера</li>
            <li><span class="check">✓</span> Детальный анализ материала</li>
            <li><span class="check">✓</span> Сертификат подлинности</li>
          </ul>
          <p class="plan-time">⏱ До 2 суток</p>
          <button class="plan-btn plan-btn--premium" @click="scrollToForm('total')">Отправить на проверку</button>
        </div>

      </div>
    </div>

    <!-- Форма заявки -->
    <div class="section" ref="formRef">
      <p class="section-label">ОТПРАВИТЬ НА ПРОВЕРКУ</p>
      <div class="form-wrap">
        <div class="form-info">
          <p class="form-info-title">Как это работает?</p>
          <div class="form-steps">
            <div class="form-step">
              <span class="fstep-num">01</span>
              <span>Заполните заявку и выберите тариф</span>
            </div>
            <div class="form-step">
              <span class="fstep-num">02</span>
              <span>Привезите товар к нам в Ташкенте</span>
            </div>
            <div class="form-step">
              <span class="fstep-num">03</span>
              <span>Мы свяжемся с вами и согласуем время</span>
            </div>
            <div class="form-step">
              <span class="fstep-num">04</span>
              <span>Получите результат проверки</span>
            </div>
          </div>
        </div>

        <div class="form-fields">
          <div class="field">
            <label class="field-label">Ваше имя</label>
            <input v-model="form.name" class="field-input" placeholder="Имя" />
          </div>
          <div class="field">
            <label class="field-label">Telegram или телефон</label>
            <input v-model="form.contact" class="field-input" placeholder="@username или +998..." />
          </div>
          <div class="field">
            <label class="field-label">Что хотите проверить?</label>
            <input v-model="form.item" class="field-input" placeholder="Nike Air Force 1, Supreme Box Logo..." />
          </div>
          <div class="field">
            <label class="field-label">Тариф</label>
            <select v-model="form.plan" class="field-input">
              <option value="advanced">Продвинутый — 100 000 сум</option>
              <option value="total">Total Legit — 180 000 сум</option>
            </select>
          </div>
          <div class="field">
            <label class="field-label">Комментарий (необязательно)</label>
            <textarea v-model="form.comment" class="field-textarea" placeholder="Любые детали..." rows="3" />
          </div>

          <p v-if="formSuccess" class="form-success">✓ Заявка отправлена! Мы свяжемся с вами в ближайшее время.</p>
          <p v-if="formError" class="form-error">{{ formError }}</p>

          <button class="submit-btn" :disabled="formLoading" @click="submitForm">
            {{ formLoading ? 'ОТПРАВЛЯЕМ...' : 'ОТПРАВИТЬ ЗАЯВКУ' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const formRef = ref(null)
const formLoading = ref(false)
const formSuccess = ref(false)
const formError = ref('')

const form = ref({
  name: '',
  contact: '',
  item: '',
  plan: 'advanced',
  comment: ''
})

const scrollToForm = (plan) => {
  form.value.plan = plan
  formRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const submitForm = async () => {
  if (!form.value.name || !form.value.contact || !form.value.item) {
    formError.value = 'Заполните имя, контакт и название товара'
    return
  }
  formLoading.value = true
  formError.value = ''

  // Отправка в Telegram
  const planName = form.value.plan === 'total' ? 'Total Legit — 180 000 сум' : 'Продвинутый — 100 000 сум'
  const text = `🔍 Новая заявка на легит чек!\n\nИмя: ${form.value.name}\nКонтакт: ${form.value.contact}\nТовар: ${form.value.item}\nТариф: ${planName}\nКомментарий: ${form.value.comment || '—'}`

  try {
    await fetch(`https://api.telegram.org/bot${import.meta.env.VITE_TG_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: import.meta.env.VITE_TG_CHAT_ID, text })
    })
    formSuccess.value = true
    form.value = { name: '', contact: '', item: '', plan: 'advanced', comment: '' }
  } catch {
    formError.value = 'Ошибка отправки. Напишите нам напрямую в Telegram @k3w_x'
  } finally {
    formLoading.value = false
  }
}
</script>

<style scoped>
.legit-page { display: flex; flex-direction: column; gap: 64px; }

.legit-hero {
  padding: 48px 0 40px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.legit-label { font-size: 10px; letter-spacing: 0.15em; color: #999; }
.legit-title { font-size: 36px; font-weight: 200; letter-spacing: -0.02em; }
.legit-sub { font-size: 13px; color: #777; line-height: 1.7; max-width: 560px; }

.section { display: flex; flex-direction: column; gap: 24px; }
.section-label { font-size: 10px; letter-spacing: 0.12em; color: #999; padding-bottom: 12px; border-bottom: 1px solid #e8e8e8; }

/* Процесс */
.process-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: #e8e8e8;
  border: 1px solid #e8e8e8;
}
.process-item {
  background: #fff;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: background 0.2s;
}
.process-item:hover { background: #fafaf8; }
.process-icon { width: 28px; height: 28px; color: #000; }
.process-icon svg { width: 100%; height: 100%; }
.process-name { font-size: 13px; font-weight: 500; }
.process-desc { font-size: 12px; color: #999; line-height: 1.6; }

/* Тарифы */
.plans {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  align-items: start;
}
.plan {
  border: 1px solid #e8e8e8;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
}
.plan--featured { border-color: #000; }
.plan--premium { border-color: #c9a84c; }

.plan-badge {
  position: absolute;
  top: -1px;
  left: 50%;
  transform: translateX(-50%);
  background: #000;
  color: #fff;
  font-size: 9px;
  letter-spacing: 0.1em;
  padding: 4px 12px;
  white-space: nowrap;
}

.plan-header { display: flex; flex-direction: column; gap: 6px; }
.plan-name { font-size: 16px; font-weight: 500; }
.plan-price { font-size: 24px; font-weight: 300; }
.plan-price span { font-size: 14px; color: #999; }
.plan-note { font-size: 11px; color: #999; }

.plan-features { display: flex; flex-direction: column; gap: 8px; list-style: none; padding: 0; margin: 0; }
.plan-features li { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #555; }
.check { color: #27ae60; font-size: 13px; }
.cross { color: #ccc; font-size: 13px; }

.plan-time { font-size: 11px; color: #999; }

.plan-btn {
  width: 100%; padding: 12px; background: #000; color: #fff;
  border: none; font-size: 11px; letter-spacing: 0.08em; cursor: pointer; transition: opacity 0.2s;
}
.plan-btn:hover { opacity: 0.75; }
.plan-btn--premium { background: #c9a84c; }

/* Форма */
.form-wrap {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
}
.form-info { display: flex; flex-direction: column; gap: 20px; }
.form-info-title { font-size: 15px; font-weight: 500; }
.form-steps { display: flex; flex-direction: column; gap: 16px; }
.form-step { display: flex; align-items: flex-start; gap: 16px; font-size: 13px; color: #555; line-height: 1.5; }
.fstep-num { font-size: 11px; color: #ccc; letter-spacing: 0.05em; min-width: 24px; padding-top: 1px; }

.form-fields { display: flex; flex-direction: column; gap: 14px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.06em; }
.field-input {
  padding: 10px 12px; border: 1px solid #e8e8e8;
  font-size: 13px; outline: none; transition: border-color 0.15s;
  font-family: inherit; width: 100%; background: #fff;
}
.field-input:focus { border-color: #000; }
.field-textarea {
  padding: 10px 12px; border: 1px solid #e8e8e8;
  font-size: 13px; outline: none; resize: vertical;
  font-family: inherit; width: 100%; transition: border-color 0.15s;
}
.field-textarea:focus { border-color: #000; }

.submit-btn {
  width: 100%; padding: 14px; background: #000; color: #fff; border: none;
  font-size: 11px; letter-spacing: 0.1em; cursor: pointer; transition: opacity 0.2s;
}
.submit-btn:hover:not(:disabled) { opacity: 0.75; }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.form-success { font-size: 12px; color: #27ae60; }
.form-error { font-size: 12px; color: #c0392b; }

@media (max-width: 768px) {
  .process-grid { grid-template-columns: repeat(2, 1fr); }
  .plans { grid-template-columns: 1fr; }
  .form-wrap { grid-template-columns: 1fr; gap: 32px; }
  .legit-title { font-size: 28px; }
}
</style>