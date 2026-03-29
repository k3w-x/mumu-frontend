<template>
  <div class="auth-page">
    <div class="auth-box">
      <div class="auth-header">
        <h1 class="auth-title">Account</h1>
        <p class="auth-sub">Sign in to your account</p>
      </div>

      <div class="auth-fields">
        <div class="field">
          <label class="field-label">Email</label>
          <input
            v-model="email"
            type="email"
            class="field-input"
            placeholder="you@example.com"
            @keyup.enter="submit"
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
              placeholder="••••••••"
              @keyup.enter="submit"
            />
            <button class="eye-btn" @click="showPass = !showPass" type="button">
              {{ showPass ? '🙈' : '👁' }}
            </button>
          </div>
          <p v-if="errors.password" class="field-error">{{ errors.password }}</p>
        </div>
      </div>

      <p v-if="errors.general" class="error-general">{{ errors.general }}</p>

      <button class="submit-btn" :disabled="loading" @click="submit">
        {{ loading ? 'ВХОДИМ...' : 'ВОЙТИ' }}
      </button>

      <p class="auth-switch">
        Нет аккаунта?
        <RouterLink to="/register">Зарегистрироваться →</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const showPass = ref(false)
const loading = ref(false)
const errors = reactive({ email: '', password: '', general: '' })

const submit = async () => {
  errors.email = ''
  errors.password = ''
  errors.general = ''

  if (!email.value) { errors.email = 'Введите email'; return }
  if (!password.value) { errors.password = 'Введите пароль'; return }

  loading.value = true
  try {
    await auth.login(email.value, password.value)
    router.push('/')
  } catch (err) {
    errors.general = err.response?.data?.error || 'Неверный email или пароль'
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

.error-general { font-size: 12px; color: #c0392b; }

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