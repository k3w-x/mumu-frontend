<template>
  <div class="how-page">
    <div class="page-header">
      <h1 class="page-title">Как заказать?</h1>
      <p class="page-sub">Полное руководство по оформлению заказа в MUMU Store</p>
    </div>

    <div class="sections">

      <!-- Шаги заказа -->
      <div class="section">
        <h2 class="section-title">ОФОРМЛЕНИЕ ЗАКАЗА</h2>
        <div class="steps">
          <div class="step">
            <div class="step-num">01</div>
            <div class="step-body">
              <p class="step-title">Выберите товар</p>
              <p class="step-desc">Найдите нужный товар в каталоге, выберите размер и добавьте в корзину</p>
            </div>
          </div>
          <div class="step">
            <div class="step-num">02</div>
            <div class="step-body">
              <p class="step-title">Оформите заказ</p>
              <p class="step-desc">Укажите адрес доставки и номер телефона, нажмите «Подтвердить заказ»</p>
            </div>
          </div>
          <div class="step">
            <div class="step-num">03</div>
            <div class="step-body">
              <p class="step-title">Оплатите на карту</p>
              <p class="step-desc">Переведите сумму заказа на карту и отправьте скриншот в Telegram <a href="https://t.me/k3w_x" target="_blank">@k3w_x</a></p>
            </div>
          </div>
          <div class="step">
            <div class="step-num">04</div>
            <div class="step-body">
              <p class="step-title">Подтверждение</p>
              <p class="step-desc">Мы подтвердим заказ в течение 1 часа после получения оплаты</p>
            </div>
          </div>
          <div class="step">
            <div class="step-num">05</div>
            <div class="step-body">
              <p class="step-title">Получите заказ</p>
              <p class="step-desc">Доставим ваш заказ в течение 10 дней после подтверждения</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Доставка -->
      <div class="section">
        <h2 class="section-title">ДОСТАВКА</h2>
        <div class="info-cards">
          <div class="info-card">
            <p class="info-card-icon">🚚</p>
            <p class="info-card-title">По Ташкенту</p>
            <p class="info-card-desc">Бесплатная доставка курьером. Срок — до 10 дней с момента подтверждения заказа</p>
          </div>
          <div class="info-card">
            <p class="info-card-icon">📦</p>
            <p class="info-card-title">Другие города</p>
            <p class="info-card-desc">Доставка через BTS. Стоимость оплачивается отдельно по тарифам BTS</p>
          </div>
          <div class="info-card">
            <p class="info-card-icon">✈️</p>
            <p class="info-card-title">Доставка из Китая</p>
            <p class="info-card-desc">Стоимость доставки из Китая — $10 за кг. Оплачивается при оформлении заказа</p>
          </div>
        </div>
      </div>

      <!-- Оплата -->
      <div class="section">
        <h2 class="section-title">ОПЛАТА</h2>
        <div class="payment-info">
          <p class="payment-text">Оплата производится переводом на карту после оформления заказа на сайте.</p>
          <div class="payment-steps">
            <div class="payment-step">
              <span class="dot"></span>
              <span>Оформите заказ на сайте</span>
            </div>
            <div class="payment-step">
              <span class="dot"></span>
              <span>Переведите сумму на карту <strong>Humo/Uzcard</strong></span>
            </div>
            <div class="payment-step">
              <span class="dot"></span>
              <span>Отправьте скриншот перевода в Telegram <a href="https://t.me/k3w_x" target="_blank">@k3w_x</a></span>
            </div>
            <div class="payment-step">
              <span class="dot"></span>
              <span>Получите подтверждение в течение 1 часа</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Возврат -->
      <div class="section">
        <h2 class="section-title">ВОЗВРАТ</h2>
        <div class="return-info">
          <div class="return-block">
            <p class="return-title">✓ Принимаем возврат</p>
            <p class="return-desc">Возврат принимается только в случае заводского брака. Обратитесь к нам в день получения товара через Telegram <a href="https://t.me/k3w_x" target="_blank">@k3w_x</a> с фото брака.</p>
          </div>
          <div class="return-block return-block--no">
            <p class="return-title">✕ Не принимаем возврат</p>
            <p class="return-desc">Возврат не принимается если товар был в использовании, размер не подошёл или изменилось решение о покупке.</p>
          </div>
        </div>
      </div>

      <!-- Легит чек -->
      <div class="section">
        <h2 class="section-title">ЛЕГИТ ЧЕК</h2>
        <div class="legit-block">
          <p class="legit-desc">Все товары в MUMU Store проходят проверку подлинности перед отправкой. Мы гарантируем 100% оригинальность каждой позиции.</p>
          <RouterLink to="/legit-check" class="legit-link">Подробнее о легит чеке →</RouterLink>
        </div>
      </div>

      <!-- Контакты -->
      <div class="section">
        <h2 class="section-title">ОСТАЛИСЬ ВОПРОСЫ?</h2>
        <div class="contacts">
          <a href="https://t.me/k3w_x" target="_blank" class="contact-btn">
            <span>✈</span> Написать в Telegram
          </a>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.how-page { display: flex; flex-direction: column; gap: 48px; max-width: 800px; }
.page-header { padding-bottom: 20px; border-bottom: 1px solid #e8e8e8; display: flex; flex-direction: column; gap: 4px; }
.page-title { font-size: 22px; font-weight: 300; }
.page-sub { font-size: 12px; color: #999; }

.sections { display: flex; flex-direction: column; gap: 48px; }

.section { display: flex; flex-direction: column; gap: 20px; }
.section-title { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; color: #999; padding-bottom: 12px; border-bottom: 1px solid #e8e8e8; }

/* Шаги */
.steps { display: flex; flex-direction: column; gap: 0; }
.step { display: flex; gap: 20px; padding: 20px 0; border-bottom: 1px solid #f0f0ee; }
.step:last-child { border-bottom: none; }
.step-num { font-size: 11px; color: #ccc; letter-spacing: 0.05em; min-width: 28px; padding-top: 2px; }
.step-body { display: flex; flex-direction: column; gap: 4px; }
.step-title { font-size: 14px; font-weight: 500; }
.step-desc { font-size: 13px; color: #777; line-height: 1.6; }
.step-desc a { color: #000; text-decoration: underline; }

/* Карточки доставки */
.info-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.info-card { border: 1px solid #e8e8e8; padding: 20px; display: flex; flex-direction: column; gap: 8px; }
.info-card-icon { font-size: 20px; }
.info-card-title { font-size: 13px; font-weight: 500; }
.info-card-desc { font-size: 12px; color: #777; line-height: 1.6; }

/* Оплата */
.payment-info { display: flex; flex-direction: column; gap: 16px; }
.payment-text { font-size: 13px; color: #555; }
.payment-steps { display: flex; flex-direction: column; gap: 10px; }
.payment-step { display: flex; align-items: flex-start; gap: 12px; font-size: 13px; color: #444; line-height: 1.5; }
.payment-step a { color: #000; text-decoration: underline; }
.dot { width: 6px; height: 6px; background: #000; border-radius: 50%; flex-shrink: 0; margin-top: 6px; }

/* Возврат */
.return-info { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.return-block { padding: 20px; border: 1px solid #e8e8e8; display: flex; flex-direction: column; gap: 8px; }
.return-block--no { border-color: #f0e8e8; background: #fefafa; }
.return-title { font-size: 13px; font-weight: 500; }
.return-block--no .return-title { color: #c0392b; }
.return-desc { font-size: 12px; color: #777; line-height: 1.6; }
.return-desc a { color: #000; text-decoration: underline; }

/* Легит чек */
.legit-block { display: flex; flex-direction: column; gap: 12px; }
.legit-desc { font-size: 13px; color: #555; line-height: 1.6; }
.legit-link { font-size: 13px; color: #000; text-decoration: underline; text-underline-offset: 3px; align-self: flex-start; }

/* Контакты */
.contacts { display: flex; gap: 12px; }
.contact-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 24px; background: #000; color: #fff;
  font-size: 13px; text-decoration: none; transition: opacity 0.2s;
}
.contact-btn:hover { opacity: 0.75; }

@media (max-width: 768px) {
  .info-cards { grid-template-columns: 1fr; }
  .return-info { grid-template-columns: 1fr; }
}
</style>