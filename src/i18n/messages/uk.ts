import type { MessageKey } from '@/i18n/messages/en'

export const uk: Record<MessageKey, string> = {
  'common.brand': 'Bizcamp Focus',
  'common.adminBrand': 'CogniFlow',
  'common.loading': 'Завантаження…',
  'common.saving': 'Збереження…',
  'common.updating': 'Оновлення…',
  'common.copied': 'Скопійовано',
  'common.copySnippet': 'Копіювати код',
  'common.copyFailed':
    'Не вдалося скопіювати. Виділіть код і скопіюйте його вручну.',
  'common.localeEn': 'EN',
  'common.localeUk': 'UA',
  'common.switchLanguage': 'Мова',
  'common.backHome': 'На головну',
  'common.logout': 'Вийти',
  'common.copyUrl': 'Копіювати URL',
  'common.skipToContent': 'Перейти до вмісту',

  'theme.toLight': 'Увімкнути світлу тему',
  'theme.toDark': 'Увімкнути темну тему',

  'errors.offline':
    'Немає з’єднання з інтернетом. Перевірте підключення та спробуйте ще раз.',
  'errors.network':
    'Не вдалося з’єднатися із сервером. Перевірте підключення та спробуйте ще раз.',
  'errors.timeout':
    'Сервер відповідав надто довго. Спробуйте ще раз.',
  'errors.boundaryTitle': 'Щось пішло не так',
  'errors.boundaryBody':
    'Сталася неочікувана помилка. Поверніться на головну сторінку та спробуйте ще раз.',
  'errors.boundaryReload': 'На головну',
  'errors.orgNotFoundTitle': 'Робочий простір не знайдено',
  'errors.orgNotFoundBody':
    'Це посилання недійсне або більше не доступне. Увійдіть знову з головної сторінки.',
  'errors.convexMissing':
    'Бекенд не налаштовано. Вкажіть VITE_CONVEX_URL у .env.local і перезапустіть застосунок.',

  'landing.hero.title':
    'Персоналізована підтримка читання для кожного учня.',
  'landing.hero.body':
    'Додайте Bizcamp Focus до своєї LMS, щоб учні могли використовувати власний режим читання на різних сторінках і під час наступних сесій.',
  'landing.auth.aria': 'Обліковий запис',
  'landing.auth.register': 'Реєстрація',
  'landing.auth.signIn': 'Увійти',

  'landing.register.title': 'Створіть робочий простір',
  'landing.register.body':
    'Створіть обліковий запис організації, підключіть домен LMS і почніть відстежувати використання віджета.',
  'landing.signIn.title': 'Увійдіть у робочий простір',
  'landing.signIn.body':
    'Введіть робочу пошту та пароль, пов’язані з вашим обліковим записом.',

  'benefits.heading': 'Підтримка читання прямо у вашій LMS.',
  'benefits.subheading':
    'Дайте учням персоналізовані інструменти читання без змін у структурі курсів.',
  'benefits.shared.title': 'Єдиний профіль читання',
  'benefits.shared.body':
    'Учень використовує той самий режим Soft, Optimal або Deep на всіх підтримуваних сторінках LMS.',
  'benefits.calibrated.title': 'Швидке налаштування',
  'benefits.calibrated.body':
    'Короткий квіз із п’яти запитань допомагає підібрати режим читання відповідно до потреб учня.',
  'benefits.enterprise.title': 'Просте підключення',
  'benefits.enterprise.body':
    'Додайте ізольований віджет одним скриптом і синхронізуйте налаштування та активність учнів між сесіями.',

  'preview.liveDemo': 'Демо',
  'preview.subtitle': 'Спробуйте готовий віджет',
  'preview.aria': 'Демо віджета Bizcamp Focus',
  'preview.iframeTitle': 'Демо Bizcamp Focus',

  'form.workEmail': 'Робоча пошта',
  'form.phone': 'Номер телефону',
  'form.phoneShort': 'Телефон',
  'form.companyName': 'Назва компанії',
  'form.password': 'Пароль',
  'form.emailPlaceholder': 'alex@company.com',
  'form.phonePlaceholder': '+380 50 000 0000',
  'form.companyPlaceholder': 'Acme Learning',
  'form.passwordPlaceholder': 'Щонайменше 8 символів',
  'form.passwordDots': '••••••••',
  'form.createWorkspace': 'Створити робочий простір',
  'form.creatingWorkspace': 'Створення робочого простору…',
  'form.registerFootnote':
    'Банківська картка не потрібна. Підключити домен LMS можна після реєстрації.',
  'form.signIn': 'Увійти',
  'form.signingIn': 'Вхід…',
  'form.registerFailed':
    'Не вдалося створити робочий простір. Спробуйте ще раз.',
  'form.signInFailed':
    'Не вдалося увійти. Перевірте дані та спробуйте ще раз.',

  'validation.email': 'Введіть коректну робочу пошту',
  'validation.phoneIncomplete': 'Введіть повний номер телефону',
  'validation.phoneLong': 'Номер телефону занадто довгий',
  'validation.companyShort':
    'Назва компанії має містити щонайменше 2 символи',
  'validation.companyLong': 'Назва компанії занадто довга',
  'validation.passwordShort':
    'Пароль має містити щонайменше 8 символів',
  'validation.passwordLong': 'Пароль занадто довгий',
  'validation.passwordRequired': 'Введіть пароль',
  'validation.domainRequired': 'Введіть домен',
  'validation.domainLong': 'Домен занадто довгий',
  'validation.currentPasswordRequired': 'Введіть поточний пароль',
  'validation.confirmPasswordRequired': 'Підтвердіть новий пароль',
  'validation.passwordsMismatch': 'Паролі не збігаються',

  'nav.overview': 'Огляд',
  'nav.learners': 'Учні',
  'nav.widget': 'Віджет',
  'nav.settings': 'Налаштування',
  'nav.dashboardAria': 'Панель керування',

  'dashboard.workspace': 'Робочий простір',
  'dashboard.yourOrg': 'Ваша організація',
  'dashboard.analyticsFor': 'Аналітика віджета для {domain}.',
  'dashboard.linkDomainHint':
    'Підключіть домен, на якому встановлено віджет, щоб почати збирати аналітику.',
  'dashboard.workEmail': 'Робоча пошта',
  'dashboard.phone': 'Телефон',
  'dashboard.domain': 'Домен',
  'dashboard.domainNotLinked': 'Не підключено',
  'dashboard.domainPending': '{domain} · очікує підтвердження',
  'dashboard.loadingOrg': 'Завантаження організації…',
  'dashboard.claimTitle': 'Підключіть домен',
  'dashboard.claimBody':
    'Введіть домен LMS і підтвердьте право власності за допомогою DNS TXT-запису.',
  'dashboard.pendingVerifyBanner':
    '{domain} очікує підтвердження через DNS.',
  'dashboard.pendingVerifyAction': 'Відкрити налаштування',
  'dashboard.claimLaterBanner': 'Домен не підключено.',
  'dashboard.loadingAnalytics': 'Завантаження аналітики…',
  'dashboard.claimFirst':
    'Підключіть домен, щоб переглядати аналітику.',
  'dashboard.overviewDescription':
    'Переглядайте основні показники використання та взаємодії з віджетом.',
  'dashboard.learnersDescription':
    'Переглядайте активність учнів, залучення та статус налаштування профілів.',
  'dashboard.widgetDescription':
    'Встановіть віджет і перевірте стан підключення.',
  'dashboard.settingsDescription':
    'Керуйте організацією, доменом і налаштуваннями облікового запису.',

  'domain.label': 'Домен LMS або сайту',
  'domain.placeholder': 'lms.company.com',
  'domain.hint':
    'Активність віджета з цього домену відображатиметься у вашій панелі.',
  'domain.linking': 'Підключення домену…',
  'domain.openDashboard': 'Продовжити',
  'domain.saveFailed':
    'Не вдалося зберегти домен. Спробуйте ще раз.',
  'domain.challengeTitle': 'Підтвердьте право власності на домен',
  'domain.challengeBody':
    'Додайте цей TXT-запис у DNS для {domain}.',
  'domain.txtHost': 'Хост',
  'domain.txtValue': 'Значення',
  'domain.txtTypeHint':
    'Оновлення DNS може зайняти кілька хвилин.',
  'domain.checkingDns': 'Перевірка DNS…',
  'domain.verifyTxt': 'Підтвердити домен',
  'domain.changeDomain': 'Використати інший домен',
  'domain.skipForNow': 'Пропустити',
  'domain.skipHint':
    'Підтвердження домену можна завершити пізніше в налаштуваннях.',
  'domain.verifyFailed':
    'TXT-запис не знайдено. Перевірте його, зачекайте на оновлення DNS і спробуйте ще раз.',

  'overview.activeLearners': 'Активні учні',
  'overview.activeLearnersHint': 'Унікальні учні з недавньою активністю',
  'overview.sessions': 'Сесії',
  'overview.lastDays': 'Останні {days} дн.',
  'overview.widgetOpens': 'Відкриття віджета',
  'overview.quizCompletions': 'Завершені квізи',
  'overview.rate': 'Рівень завершення: {rate}',
  'overview.personalizations': 'Персоналізації',
  'overview.errors': '{count} помилок',
  'overview.totalEvents': 'Усього подій',
  'overview.pageTime': 'Час на сторінці',
  'overview.pageTimeHint':
    'Загальний час, коли сторінка з віджетом була активною',
  'overview.avgPageTime': 'Сер. час на учня',
  'overview.avgPageTimeHint':
    'Середній активний час на одного учня',
  'overview.activity': 'Активність · {days} дн.',
  'overview.modeAdoption': 'Використання режимів',
  'overview.localeSwitches': 'Зміни мови',
  'overview.quizFunnel': 'Активність у квізі',
  'overview.answers': 'Відповіді',
  'overview.completions': 'Завершення',
  'overview.restarts': 'Перезапуски',
  'overview.closes': 'Закриття',
  'overview.recentActivity': 'Остання активність',
  'overview.latestOn': 'Останні події віджета з {domain}',
  'overview.noEvents':
    'Активності ще немає. Відкрийте віджет на підключеному домені, щоб з’явилися перші дані.',
  'overview.signals': 'Додаткові показники',
  'overview.audience': 'Залучення',
  'overview.behaviorMix':
    'Режими читання, мова та активність у квізі',

  'learners.title': 'Огляд учнів',
  'learners.subtitle':
    'Зведені дані для {domain} · останні {days} дн.',
  'learners.loading': 'Завантаження даних про учнів…',
  'learners.claimDomain':
    'Підключіть домен, щоб переглядати дані про учнів.',
  'learners.empty': 'Даних про учнів ще немає.',
  'learners.total': 'Усього учнів',
  'learners.totalHint': 'Унікальні учні в системі',
  'learners.active7d': 'Активні · 7 дн.',
  'learners.active7dHint': '{rate} від усіх учнів',
  'learners.calibrated': 'Налаштовані',
  'learners.notCalibrated': 'Не налаштовані',
  'learners.avgSessions': 'Сер. сесій',
  'learners.avgOpens': 'Сер. відкриттів',
  'learners.avgPersonalizations': 'Сер. персоналізацій',
  'learners.avgPageTime': 'Сер. час на сторінці',
  'learners.perLearner': 'На одного учня',
  'learners.calibrationStatus': 'Статус профілю',
  'learners.lastMode': 'Останній обраний режим',
  'learners.modeNone': 'Не вибрано',
  'learners.calibratedLabel': 'Налаштовано',
  'learners.uncalibratedLabel': 'Не налаштовано',
  'learners.behavior': 'Залучення',
  'learners.profiles': 'Профілі учнів',

  'widget.embed': 'Встановлення віджета',
  'widget.embedBody':
    'Додайте цей скрипт на сторінки {domain}. Активність автоматично визначається за доменом сторінки.',
  'widget.scriptUrl': 'URL скрипта віджета',
  'widget.scriptUrlHint':
    'Використайте URL напряму або скопіюйте готовий код для вставки нижче.',
  'widget.usageMix': 'Використання віджета',
  'widget.usageSubtitle': 'Кількість подій для цього домену',
  'widget.lastDaysSuffix': ' · останні {days} дн.',
  'widget.sessions': 'Сесії',
  'widget.opens': 'Відкриття віджета',
  'widget.closes': 'Закриття віджета',
  'widget.quizAnswers': 'Відповіді в квізі',
  'widget.quizCompletions': 'Завершені квізи',
  'widget.quizRestarts': 'Перезапуски квізу',
  'widget.personalizationSuccess': 'Успішні персоналізації',
  'widget.personalizationErrors': 'Помилки персоналізації',
  'widget.modeAdoption': 'Використання режимів',
  'widget.localeSwitches': 'Зміни мови',
  'widget.pageTime': 'Час на сторінці',
  'widget.avgPageTime': 'Сер. час на учня',
  'widget.installStep': 'Встановлення',
  'widget.installCode': 'Код для вставки',
  'widget.advanced': 'Додатково: URL скрипта',
  'widget.liveStatus': 'Стан підключення',
  'widget.connected': 'Підключено',

  'settings.orgTitle': 'Організація',
  'settings.orgBody':
    'Оновіть дані організації та контактну інформацію.',
  'settings.orgId': 'ID організації',
  'settings.created': 'Створено {date}',
  'settings.saveOrg': 'Зберегти зміни',
  'settings.profileSaved': 'Дані організації оновлено.',
  'settings.profileFailed':
    'Не вдалося оновити дані організації.',
  'settings.domainTitle': 'Домен',
  'settings.domainBody':
    'Керуйте доменом, з якого збирається аналітика віджета. Право власності підтверджується через DNS TXT-запис.',
  'settings.domainPendingBody':
    'Завершіть підтвердження {domain} або підключіть інший домен. Аналітика буде недоступна, доки домен не підтверджено.',
  'settings.domainClaimSince':
    'Підтвердження розпочато {date}',
  'settings.domainNone': 'Домен не підключено.',
  'settings.updateDomain': 'Оновити домен',
  'settings.claimDomain': 'Підключити домен',
  'settings.domainUpdated': 'Домен змінено на {domain}.',
  'settings.domainFailed': 'Не вдалося оновити домен.',
  'settings.passwordTitle': 'Пароль',
  'settings.passwordBody':
    'Змініть пароль для входу в робочий простір.',
  'settings.currentPassword': 'Поточний пароль',
  'settings.newPassword': 'Новий пароль',
  'settings.confirmPassword': 'Підтвердіть новий пароль',
  'settings.updatePassword': 'Оновити пароль',
  'settings.passwordUpdated': 'Пароль оновлено.',
  'settings.passwordFailed': 'Не вдалося оновити пароль.',
  'settings.technicalDetails': 'Технічні деталі',
  'settings.createdLabel': 'Робочий простір створено',
}
