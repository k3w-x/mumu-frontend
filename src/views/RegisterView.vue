<template>
  <div class="auth-page">
    <div class="auth-box">
      <div class="auth-header">
        <h1 class="auth-title">Создать аккаунт</h1>
        <p class="auth-sub">Зарегистрируйтесь чтобы делать заказы</p>
      </div>

      <!-- Шаг 1 — основные данные -->
      <div v-if="step === 1">
        <div class="auth-fields">
          <div class="field">
            <label class="field-label">Имя</label>
            <input v-model="form.name" type="text" class="field-input" placeholder="Ваше имя" />
          </div>

          <div class="field">
            <label class="field-label">Email</label>
            <input v-model="form.email" type="email" class="field-input" placeholder="you@example.com" />
            <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
          </div>

          <div class="field">
            <label class="field-label">Телефон</label>
            <input v-model="form.phone" type="tel" class="field-input" placeholder="+998 90 123 45 67" />
          </div>

          <div class="field">
            <label class="field-label">Пароль</label>
            <div class="input-wrap">
              <input v-model="form.password" :type="showPass ? 'text' : 'password'" class="field-input"
                placeholder="Минимум 8 символов" @input="checkStrength" />
              <button class="eye-btn" @click="showPass = !showPass" type="button">
                {{ showPass ? '🙈' : '👁' }}
              </button>
            </div>
            <div v-if="form.password" class="strength-bar">
              <div :class="['strength-fill', `strength--${strength.level}`]" :style="{ width: strength.width }"></div>
            </div>
            <p v-if="form.password" :class="['strength-label', `strength-text--${strength.level}`]">
              {{ strength.label }}
            </p>
            <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
          </div>

          <div class="field">
            <label class="field-label">Повторите пароль</label>
            <div class="input-wrap">
              <input v-model="form.confirm" :type="showConfirm ? 'text' : 'password'" class="field-input"
                placeholder="Повторите пароль" />
              <button class="eye-btn" @click="showConfirm = !showConfirm" type="button">
                {{ showConfirm ? '🙈' : '👁' }}
              </button>
            </div>
            <p v-if="errors.confirm" class="field-error">{{ errors.confirm }}</p>
          </div>
        </div>

        <div class="checklist">
          <div :class="['check', checks.length ? 'ok' : '']">{{ checks.length ? '✓' : '○' }} Минимум 8 символов</div>
          <div :class="['check', checks.upper ? 'ok' : '']">{{ checks.upper ? '✓' : '○' }} Заглавная буква</div>
          <div :class="['check', checks.digit ? 'ok' : '']">{{ checks.digit ? '✓' : '○' }} Цифра</div>
        </div>

        <button class="submit-btn" @click="goToStep2">ДАЛЕЕ →</button>
      </div>

      <!-- Шаг 2 — размеры -->
      <div v-if="step === 2">
        <p class="step-hint">Укажите ваши размеры — это поможет нам подбирать товары и отображать их при заказе</p>

        <div class="auth-fields">
          <div class="field">
            <label class="field-label">Пол</label>
            <select v-model="form.gender" class="field-input">
              <option value="">— не указан —</option>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
          </div>

          <div class="field">
            <label class="field-label">Размер одежды</label>
            <select v-model="form.clothing_size" class="field-input">
              <option value="">— не указан —</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>

          <div class="field">
            <label class="field-label">Размер обуви</label>
            <select v-model="form.shoe_size" class="field-input">
              <option value="">— не указан —</option>
              <option v-for="size in shoeSizes" :key="size" :value="size">{{ size }}</option>
            </select>
          </div>
        </div>

        <p v-if="errors.general" class="error-general">{{ errors.general }}</p>
        <p v-if="success" class="success-msg">✓ Аккаунт создан! Теперь войдите.</p>

        <div class="step-btns">
          <button class="back-btn" @click="step = 1">← НАЗАД</button>
          <button class="submit-btn" :disabled="loading" @click="submit">
            {{ loading ? 'СОЗДАЁМ...' : 'СОЗДАТЬ АККАУНТ' }}
          </button>
        </div>
      </div>

      <p class="auth-switch">
        Уже есть аккаунт?
        <RouterLink to="/login">Войти →</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const step = ref(1)
const showPass = ref(false)
const showConfirm = ref(false)
const loading = ref(false)
const success = ref(false)
const errors = reactive({ email: '', password: '', confirm: '', general: '' })
const checks = reactive({ length: false, upper: false, digit: false })

const form = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirm: '',
  gender: '',
  clothing_size: '',
  shoe_size: ''
})

const shoeSizes = Array.from({ length: 15 }, (_, i) => String(35 + i))

const checkStrength = () => {
  checks.length = form.password.length >= 8
  checks.upper  = /[A-ZА-Я]/.test(form.password)
  checks.digit  = /[0-9]/.test(form.password)
}

const strength = computed(() => {
  const score = [checks.length, checks.upper, checks.digit].filter(Boolean).length
  if (!form.password) return { level: 'none', width: '0%', label: '' }
  if (score === 1) return { level: 'weak',   width: '33%', label: 'Слабый пароль' }
  if (score === 2) return { level: 'medium', width: '66%', label: 'Средний пароль' }
  return { level: 'strong', width: '100%', label: 'Надёжный пароль' }
})

const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

const goToStep2 = () => {
  errors.email = ''
  errors.password = ''
  errors.confirm = ''

  if (!form.email)                   { errors.email = 'Введите email'; return }
  if (!validateEmail(form.email))    { errors.email = 'Некорректный email'; return }
  if (!checks.length)                { errors.password = 'Минимум 8 символов'; return }
  if (!checks.upper)                 { errors.password = 'Нужна заглавная буква'; return }
  if (!checks.digit)                 { errors.password = 'Нужна цифра'; return }
  if (form.password !== form.confirm) { errors.confirm = 'Пароли не совпадают'; return }

  step.value = 2
}

const submit = async () => {
  errors.general = ''
  loading.value = true
  try {
    await auth.register(form.email, form.password, {
      name: form.name,
      phone: form.phone,
      gender: form.gender,
      clothing_size: form.clothing_size,
      shoe_size: form.shoe_size
    })
    success.value = true
  } catch (err) {
    errors.general = err.response?.data?.error || 'Ошибка регистрации'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}
.auth-box {
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.auth-header { display: flex; flex-direction: column; gap: 4px; }
.auth-title { font-size: 22px; font-weight: 300; letter-spacing: -0.01em; }
.auth-sub { font-size: 12px; color: #999; }
.step-hint { font-size: 12px; color: #777; line-height: 1.6; }
.auth-fields { display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 11px; color: #999; letter-spacing: 0.06em; text-transform: uppercase; }
.field-input {
  padding: 10px 12px; border: 1px solid #e8e8e8;
  font-size: 13px; outline: none; transition: border-color 0.15s;
  font-family: inherit; width: 100%; background: #fff;
}
.field-input:focus { border-color: #000; }
.field-error { font-size: 11px; color: #c0392b; }
.input-wrap { position: relative; }
.input-wrap .field-input { padding-right: 40px; }
.eye-btn {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; font-size: 15px;
}
.strength-bar { height: 2px; background: #eee; overflow: hidden; }
.strength-fill { height: 100%; transition: width 0.3s, background 0.3s; }
.strength--weak { background: #c0392b; }
.strength--medium { background: #d68910; }
.strength--strong { background: #27ae60; }
.strength-label { font-size: 11px; }
.strength-text--weak { color: #c0392b; }
.strength-text--medium { color: #d68910; }
.strength-text--strong { color: #27ae60; }
.checklist { display: flex; flex-direction: column; gap: 4px; margin-bottom: 20px; }
.check { font-size: 11px; color: #ccc; transition: color 0.2s; }
.check.ok { color: #27ae60; }
.error-general { font-size: 12px; color: #c0392b; }
.success-msg { font-size: 12px; color: #27ae60; font-weight: 500; }
.step-btns { display: flex; gap: 10px; }
.submit-btn {
  flex: 1; padding: 14px; background: #000; color: #fff; border: none;
  font-size: 11px; letter-spacing: 0.1em; cursor: pointer; transition: opacity 0.2s;
}
.submit-btn:hover:not(:disabled) { opacity: 0.75; }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.back-btn {
  padding: 14px 20px; background: #fff; color: #000;
  border: 1px solid #ddd; font-size: 11px; letter-spacing: 0.1em; cursor: pointer;
}
.back-btn:hover { border-color: #000; }
.auth-switch { text-align: center; font-size: 12px; color: #999; }
.auth-switch a { color: #000; text-decoration: underline; text-underline-offset: 2px; }
@media (max-width: 480px) {
  .auth-page { padding: 32px 0; }
}
</style>