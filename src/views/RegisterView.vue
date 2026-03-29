<template>
  <div class="auth-page">
    <div class="auth-box">
      <div class="auth-header">
        <h1 class="auth-title">Create Account</h1>
        <p class="auth-sub">Зарегистрируйтесь чтобы делать заказы</p>
      </div>

      <div class="auth-fields">
        <div class="field">
          <label class="field-label">Email</label>
          <input
            v-model="email"
            type="email"
            class="field-input"
            placeholder="you@example.com"
          />
          <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
        </div>

        <div class="field">
          <label class="field-label">Пароль</label>
          <div class="input-wrap">
            <input
              v-model="password"
              :type="showPass ? 'text' : 'password'"
              class="field-input"
              placeholder="Минимум 8 символов"
              @input="checkStrength"
            />
            <button class="eye-btn" @click="showPass = !showPass" type="button">
              {{ showPass ? '🙈' : '👁' }}
            </button>
          </div>
          <div v-if="password" class="strength-bar">
            <div
              :class="['strength-fill', `strength--${strength.level}`]"
              :style="{ width: strength.width }"
            ></div>
          </div>
          <p v-if="password" :class="['strength-label', `strength-text--${strength.level}`]">
            {{ strength.label }}
          </p>
          <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
        </div>

        <div class="field">
          <label class="field-label">Повторите пароль</label>
          <div class="input-wrap">
            <input
              v-model="confirm"
              :type="showConfirm ? 'text' : 'password'"
              class="field-input"
              placeholder="Повторите пароль"
            />
            <button class="eye-btn" @click="showConfirm = !showConfirm" type="button">
              {{ showConfirm ? '🙈' : '👁' }}
            </button>
          </div>
          <p v-if="errors.confirm" class="field-error">{{ errors.confirm }}</p>
        </div>
      </div>

      <!-- Чеклист -->
      <div class="checklist">
        <div :class="['check', checks.length ? 'ok' : '']">
          {{ checks.length ? '✓' : '○' }} Минимум 8 символов
        </div>
        <div :class="['check', checks.upper ? 'ok' : '']">
          {{ checks.upper ? '✓' : '○' }} Заглавная буква
        </div>
        <div :class="['check', checks.digit ? 'ok' : '']">
          {{ checks.digit ? '✓' : '○' }} Цифра
        </div>
      </div>

      <p v-if="errors.general" class="error-general">{{ errors.general }}</p>
      <p v-if="success" class="success-msg">✓ Аккаунт создан! Теперь войдите.</p>

      <button class="submit-btn" :disabled="loading" @click="submit">
        {{ loading ? 'СОЗДАЁМ...' : 'СОЗДАТЬ АККАУНТ' }}
      </button>

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

const email = ref('')
const password = ref('')
const confirm = ref('')
const showPass = ref(false)
const showConfirm = ref(false)
const loading = ref(false)
const success = ref(false)
const errors = reactive({ email: '', password: '', confirm: '', general: '' })
const checks = reactive({ length: false, upper: false, digit: false })

const checkStrength = () => {
  checks.length = password.value.length >= 8
  checks.upper  = /[A-ZА-Я]/.test(password.value)
  checks.digit  = /[0-9]/.test(password.value)
}

const strength = computed(() => {
  const score = [checks.length, checks.upper, checks.digit].filter(Boolean).length
  if (!password.value) return { level: 'none', width: '0%', label: '' }
  if (score === 1) return { level: 'weak',   width: '33%', label: 'Слабый пароль' }
  if (score === 2) return { level: 'medium', width: '66%', label: 'Средний пароль' }
  return { level: 'strong', width: '100%', label: 'Надёжный пароль' }
})

const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

const submit = async () => {
  errors.email = ''
  errors.password = ''
  errors.confirm = ''
  errors.general = ''

  if (!email.value)                  { errors.email = 'Введите email'; return }
  if (!validateEmail(email.value))   { errors.email = 'Некорректный email'; return }
  if (!checks.length)                { errors.password = 'Минимум 8 символов'; return }
  if (!checks.upper)                 { errors.password = 'Нужна заглавная буква'; return }
  if (!checks.digit)                 { errors.password = 'Нужна цифра'; return }
  if (password.value !== confirm.value) { errors.confirm = 'Пароли не совпадают'; return }

  loading.value = true
  try {
    await auth.register(email.value, password.value)
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

.auth-fields { display: flex; flex-direction: column; gap: 14px; }

.field { display: flex; flex-direction: column; gap: 6px; }

.field-label {
  font-size: 11px;
  color: #999;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.field-input {
  padding: 10px 12px;
  border: 1px solid #e8e8e8;
  font-size: 13px;
  outline: none;
  transition: border-color 0.15s;
  font-family: inherit;
  width: 100%;
}

.field-input:focus { border-color: #000; }
.field-error { font-size: 11px; color: #c0392b; }

.input-wrap { position: relative; }
.input-wrap .field-input { padding-right: 40px; }

.eye-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 15px;
  line-height: 1;
}

.strength-bar {
  height: 2px;
  background: #eee;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s, background 0.3s;
}

.strength--weak   { background: #c0392b; }
.strength--medium { background: #d68910; }
.strength--strong { background: #27ae60; }

.strength-label { font-size: 11px; }
.strength-text--weak   { color: #c0392b; }
.strength-text--medium { color: #d68910; }
.strength-text--strong { color: #27ae60; }

.checklist { display: flex; flex-direction: column; gap: 4px; }

.check { font-size: 11px; color: #ccc; transition: color 0.2s; }
.check.ok { color: #27ae60; }

.error-general { font-size: 12px; color: #c0392b; }
.success-msg { font-size: 12px; color: #27ae60; font-weight: 500; }

.submit-btn {
  width: 100%;
  padding: 14px;
  background: #000;
  color: #fff;
  border: none;
  font-size: 11px;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: opacity 0.2s;
}

.submit-btn:hover:not(:disabled) { opacity: 0.75; }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.auth-switch {
  text-align: center;
  font-size: 12px;
  color: #999;
}

.auth-switch a {
  color: #000;
  text-decoration: underline;
  text-underline-offset: 2px;
}



@media (max-width: 480px) {
  .auth-page {
    padding: 32px 0;
  }
}

</style>