# Установка incy-wincy в INCY

Эта инструкция рассчитана на пользователя, который не хочет вручную редактировать JSON.

## Самый простой вариант

Используйте **IW 02 Work+ Complete**.

Ссылка:

https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_02_WorkPlus_Complete.json

### Шаг 1

Скопируйте ссылку выше целиком.

### Шаг 2

Откройте INCY и перейдите в раздел маршрутизации / Autorouting (название пункта может немного отличаться между версиями).

### Шаг 3

Добавьте профиль по URL и вставьте скопированную ссылку.

### Шаг 4

Выберите **IW 02 Work+ Complete** как активный профиль.

### Шаг 5

Полностью отключите и снова включите VPN-туннель.

## Что проверить

Через прокси должны работать, например:

- ChatGPT;
- Claude;
- GitHub;
- Figma;
- Canva;
- Notion.

Напрямую должны работать, например:

- Яндекс Маркет;
- банковские приложения;
- Госуслуги;
- Ozon / Wildberries;
- локальные устройства в домашней сети.

## Базовые настройки туннеля

Для старта на iOS:

- Fragmentation — выключено, если вы не решаете конкретную проблему DPI;
- Mux — выключено, если не тестировали его с конкретным сервером/транспортом;
- Тип IP — Auto;
- VPN DNS — Internal / рекомендованная настройка INCY;
- FakeDNS — выключен в опубликованных профилях.

Не включайте сразу несколько дополнительных функций, если всё работает: это усложняет диагностику.

## Все готовые ссылки

**IW 01 Daily**  
https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_01_Daily.json

**IW 02 Work+ Complete — рекомендуется**  
https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_02_WorkPlus_Complete.json

**IW 03 Full Proxy — диагностика**  
https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_03_Full_Proxy.json

**IW 04 Clean Proxy — Full Proxy + ad-domain filtering**  
https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_04_Clean_Proxy.json

## Почему рекомендуется Work+

Он не отправляет весь телефон через VPN без необходимости. Рабочие и выбранные зарубежные сервисы идут через прокси, а российские приложения и локальные ресурсы остаются напрямую.

Это обычно удобнее для постоянного использования, чем Full Proxy.

## Если что-то сломалось

См. [TROUBLESHOOTING_RU.md](TROUBLESHOOTING_RU.md).
