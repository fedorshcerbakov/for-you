/* ===== настройки сайта =====
   Как подключить Google Drive:
   1) Зайди на https://console.cloud.google.com (аккаунт Google, где будет альбом)
   2) Создай проект -> APIs & Services -> Library -> включи "Google Drive API"
   3) OAuth consent screen -> External -> добавь себя в Test users
   4) Credentials -> Create credentials -> OAuth client ID -> Web application
      Authorized JavaScript origins: адрес твоего сайта (например https://username.github.io)
      Для локального теста: http://localhost:8123
   5) Скопируй Client ID (заканчивается на .apps.googleusercontent.com) -> вставь сюда
   6) ID папки на Google Drive, где лежат/будут фото:
      создай папку в Drive, в URL вида https://drive.google.com/drive/folders/XXXXXXX —
      XXXXXXX и есть FOLDER_ID. Открой доступ "все, у кого есть ссылка -> читатель"
*/
const CONFIG = {
  CLIENT_ID: '479462149005-mljv25ttfqvro7gqp20bqtrojd07jc59.apps.googleusercontent.com',
  FOLDER_ID: '1Gak2fWV36VjB749NUF0ZtaFXWjNIyhBp',
  LOCAL_FALLBACK: true                 // если Drive не настроен — работаем с локальной папкой photos/
};
