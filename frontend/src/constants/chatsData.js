/*
  Данные чатов — по аналогии с podcastsData.js
  Чтобы добавить нового собеседника, добавь объект в CONTACTS.

  Поля контакта:
    id       — уникальный идентификатор
    name     — полное имя
    role     — роль (отображается в хедере чата)
    online   — true/false (онлайн-статус)
    avatar   — URL фото или null (покажется иконка-заглушка)
    time     — время/дата последнего сообщения (строка для отображения)
    lastMsg  — превью последнего сообщения в списке
    unread   — количество непрочитанных
    messages — массив сообщений чата (см. структуру ниже)

  Поля сообщения:
    id    — уникальный идентификатор
    side  — 'user' (студент) или 'other' (собеседник)
    text  — текст сообщения
    time  — время в формате 'ЧЧ:ММ'
    date  — дата-группа ('17 апреля', 'Сегодня', 'Пн' и т.д.)
    read  — true/false (прочитано ли)
*/

export const CONTACTS = [
  {
    id: 1,
    name: 'Сошникова Ирина Анатольевна',
    role: 'Пользователь',
    online: true,
    avatar: 'https://sutd.ru/upload/iblock/555/1vr9hrrv1x59vi7o25iosvrjwt5a8m3s/Soshnikova_IA.jpg',
    time: '10:00',
    lastMsg: 'Да, можно. Главное – проработать основные пользовательские сценарии.',
    unread: 0,
    messages: [
      { id: 1, side: 'user',  text: 'Здравствуйте! Подскажите, пожалуйста, по заданию на следующую неделю – нужно ли делать прототип или достаточно макета?Здравствуйте! Подскажите, пожалуйста, по заданию на следующую неделю – нужно ли делать прототип или достаточно макета?', time: '12:10', date: '17 апреля', read: true },
      { id: 2, side: 'other', text: 'Здравствуйте. Нужно подготовить интерактивный прототип в Figma.', time: '15:20', date: '17 апреля', read: true },
      { id: 3, side: 'user',  text: 'Поняла, спасибо!',                          time: '10:10', date: 'Сегодня', read: true },
      { id: 4, side: 'user',  text: 'А можно использовать мобильную версию?',     time: '10:11', date: 'Сегодня', read: true },
      { id: 5, side: 'other', text: 'Да, можно. Главное – проработать основные пользовательские сценарии.', time: '15:20', date: 'Сегодня', read: true },
    ],
  },
  {
    id: 2,
    name: 'Якуничева Елена Николаевна',
    role: 'Преподаватель',
    online: false,
    avatar: 'https://sutd.ru/upload/iblock/7e8/kjhw7qjm94ia8y2tf6h1idd784qn9gpz/Yakunicheva_EN.jpg',
    time: 'Чт',
    lastMsg: 'Доброе утро! Хорошо, поняла вас, время до завтра еще есть)',
    unread: 2,
    messages: [
      { id: 1, side: 'user',  text: 'Здравствуйте, Елена Николаевна! Можно сдать работу в пятницу?', time: '09:00', date: '17 апреля', read: true },
      { id: 2, side: 'other', text: 'Доброе утро! Хорошо, поняла вас, время до завтра еще есть)', time: '09:15', date: '17 апреля', read: false },
      { id: 3, side: 'other', text: 'Жду работу до 18:00 в пятницу.',             time: '09:16', date: '17 апреля', read: false },
    ],
  },
  {
    id: 3,
    name: 'Савенкова Полина Владимировна',
    role: 'Преподаватель',
    online: false,
    avatar: 'https://sutd.ru/upload/iblock/a8a/q17s2kyf1zgf81mjt3eie3aj3nmw0vmf/Savenkova_PV.jpg',
    time: 'Ср',
    lastMsg: 'Вы: Добавила двойные наконечники в концептуал...',
    unread: 1,
    messages: [
      { id: 1, side: 'other', text: 'Полина Владимировна, добрый вечер! Посмотрите, пожалуйста, концептуальную карту.', time: '19:00', date: '16 апреля', read: true },
      { id: 2, side: 'user',  text: 'Добрый вечер! Добавила двойные наконечники в концептуальную карту.', time: '19:30', date: '16 апреля', read: false },
    ],
  },
  {
    id: 4,
    name: 'Зверев Владислав Витальевич',
    role: 'Преподаватель',
    online: false,
    avatar: 'https://sutd.ru/upload/iblock/fea/2lr9lyao0a688mtc3ae1w8k4h7nymd6p/zverev-vv.jpg',
    time: 'Вт',
    lastMsg: 'Добрый день! Принято)',
    unread: 0,
    messages: [
      { id: 1, side: 'user',  text: 'Владислав Витальевич, добрый день! Отправил отчёт по практике.', time: '10:00', date: '15 апреля', read: true },
      { id: 2, side: 'other', text: 'Добрый день! Принято)',                       time: '10:45', date: '15 апреля', read: true },
    ],
  },
  {
    id: 5,
    name: 'Николаева Лали Гочевна',
    role: 'Преподаватель',
    online: false,
    avatar: null,
    time: 'Пн',
    lastMsg: 'Вы: Здравствуйте! Можете пожалуйста отправить темы и критично ли если я вы...',
    unread: 0,
    messages: [
      { id: 1, side: 'user',  text: 'Здравствуйте! Можете пожалуйста отправить темы и критично ли если я выберу свою?', time: '11:00', date: 'Пн', read: true },
    ],
  },
  {
    id: 6,
    name: 'Калугина Наталия Ильинична',
    role: 'Преподаватель',
    online: false,
    avatar: null,
    time: '2 апр',
    lastMsg: 'Добрый вечер. все правильно.',
    unread: 0,
    messages: [
      { id: 1, side: 'user',  text: 'Наталия Ильинична, добрый вечер! Правильно ли я оформила список литературы?', time: '20:00', date: '2 апреля', read: true },
      { id: 2, side: 'other', text: 'Добрый вечер. все правильно.',                time: '20:30', date: '2 апреля', read: true },
    ],
  },
  {
    id: 7,
    name: 'Косарева Анастасия Николаевна',
    role: 'Преподаватель',
    online: false,
    avatar: 'https://sutd.ru/upload/iblock/ec8/u6if3eakhsi7rp4czooqxcpgmzdh3zc4/Kosareva_AN.jpg',
    time: '1 мар',
    lastMsg: 'Вы: спасибо!',
    unread: 0,
    messages: [
      { id: 1, side: 'other', text: 'Ваша курсовая принята. Оценка — отлично.',   time: '14:00', date: '1 марта', read: true },
      { id: 2, side: 'user',  text: 'спасибо!',                                   time: '14:05', date: '1 марта', read: true },
    ],
  },
  {
    id: 8,
    name: 'Колмыкова Маргарита Михайловна',
    role: 'Преподаватель',
    online: false,
    avatar: 'https://sutd.ru/upload/iblock/329/1qw8j6q1ggnbz1st10ajjg582yf253yw/Kolmikova_MM.jpg',
    time: '1 мар',
    lastMsg: 'Вы: спасибо!',
    unread: 0,
    messages: [
      { id: 1, side: 'user',  text: 'Маргарита Михайловна, здравствуйте! Когда будут результаты зачёта?', time: '10:00', date: '1 марта', read: true },
      { id: 2, side: 'other', text: 'Здравствуйте! Результаты опубликую завтра.', time: '10:20', date: '1 марта', read: true },
      { id: 3, side: 'user',  text: 'спасибо!',                                   time: '10:21', date: '1 марта', read: true },
    ],
  },
];
