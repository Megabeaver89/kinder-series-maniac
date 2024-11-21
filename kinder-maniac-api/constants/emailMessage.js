const REGISTRATION_SUCCESS = {
  subject: 'Успешная регистрация на сайте!',
  text: 'Поздравляем, вы успешно зарегистрировались на нашем сайте. Пожалуйста, не игнорируйте это письмо.',
  body: `<p>Поздравляем! Ваша регистрация на нашем сайте прошла успешно. Теперь вы можете воспользоваться всеми доступными функциями.</p>
         <p>Если у вас возникнут вопросы, не стесняйтесь обращаться к нам.</p>`,
  buttonText: 'Перейти в профиль',
  color: '#4CAF50',
}

const PASSWORD_RESET_REQUEST = {
  subject: 'Запрос на сброс пароля',
  text: 'Вы получили это письмо, потому что вы или кто-то еще запросили сброс пароля для вашей учетной записи. Если это были не вы, проигнорируйте это письмо.',
  body: `<p>Здравствуйте! Вы получили это письмо, потому что вы запросили сброс пароля для вашей учетной записи. Если это не вы, просто проигнорируйте это письмо.</p>
         <p>Чтобы сбросить пароль, пожалуйста, нажмите на кнопку ниже:</p>`,
  buttonText: 'Сбросить пароль',
  color: '#FF6347',
}

const PASSWORD_CHANGED_SUCCESS = {
  subject: 'Ваш пароль был успешно изменен',
  text: 'Мы уведомляем вас, что ваш пароль был успешно изменен. Если это не вы, пожалуйста, свяжитесь с нами.',
  body: `<p>Здравствуйте! Ваш пароль был успешно изменен. Если это не вы, пожалуйста, свяжитесь с нами, чтобы мы могли помочь вам восстановить доступ к аккаунту.</p>
         <p>Если вы не меняли свой пароль, возможно, кто-то получил несанкционированный доступ к вашей учетной записи. Для безопасности рекомендуем немедленно изменить пароль.</p>
         <p>Если вы не запрашивали изменение пароля, проигнорируйте это письмо.</p>`,
  buttonText: null,
  color: null,
}

const EMAIL_VERIFICATION = {
  subject: 'Подтверждение электронной почты',
  text: 'Вы получили это письмо, потому что вы зарегистрировались на нашем сайте. Пожалуйста, подтвердите вашу электронную почту.',
  body: `<p>Здравствуйте! Вы зарегистрировались на нашем сайте. Чтобы подтвердить вашу электронную почту, пожалуйста, нажмите на кнопку ниже.</p>
         <p>Если это были не вы, проигнорируйте это письмо.</p>`,
  buttonText: 'Подтвердить почту',
  color: '#007BFF',
}

const ACCOUNT_DELETION_SUCCESS = {
  subject: 'Ваш аккаунт успешно удален',
  text: 'Ваш аккаунт был успешно удален. Если это не вы, пожалуйста, свяжитесь с нами.',
  body: `<p>Здравствуйте! Мы уведомляем вас, что ваш аккаунт был успешно удален. Если это не вы, пожалуйста, свяжитесь с нами, чтобы мы могли решить эту проблему.</p>
         <p>Благодарим вас за использование нашего сервиса!</p>`,
  buttonText: null, // Нет кнопки
  color: null, // Нет ссылки
}

module.exports = {
  REGISTRATION_SUCCESS,
  PASSWORD_RESET_REQUEST,
  PASSWORD_CHANGED_SUCCESS,
  EMAIL_VERIFICATION,
  ACCOUNT_DELETION_SUCCESS,
}
