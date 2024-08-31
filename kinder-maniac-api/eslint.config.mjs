import globals from "globals"
import pluginJs from "@eslint/js"

export default [
  {
    files: ["**/*.js"], // Применяется к файлам .js
    languageOptions: {
      globals: {
        ...globals.node, // Добавляем глобальные переменные Node.js
        ...globals.browser, // Если вы работаете также с браузерными переменными
      },
    },
    ...pluginJs.configs.recommended, // Подключаем рекомендованные правила ESLint
  },
]
