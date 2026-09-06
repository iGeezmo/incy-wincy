# Профили маршрутизации INCY

Если вы не хотите разбираться в деталях — используйте **IW 02 Work+ Complete**.

## IW 02 Work+ Complete — рекомендуется

Для повседневной работы на iPhone/iPad:

- AI / разработка / SaaS / выбранные зарубежные сервисы → `PROXY`;
- Яндекс / банки / госсервисы / российские маркетплейсы → `DIRECT`;
- локальные/private сети → `DIRECT`;
- всё, для чего нет отдельного правила → `DIRECT`.

### Ссылка для добавления в INCY

https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_02_WorkPlus_Complete.json

Скопируйте ссылку целиком и добавьте её в INCY как URL профиля маршрутизации / Autorouting.

---

## Остальные профили

### IW 01 Daily

Proxy-first вариант: большая часть трафика ориентирована на прокси, для локальных сервисов есть прямые исключения.

https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_01_Daily.json

### IW 03 Full Proxy

Диагностический профиль. Нужен, например, чтобы проверить, не пропущен ли какой-либо зарубежный API/CDN endpoint в Work+.

https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_03_Full_Proxy.json

Не рекомендуется как основной профиль, если вы регулярно пользуетесь российскими банками и локальными сервисами.

### IW 04 Clean Proxy

Full Proxy с блокировкой рекламной категории `geosite:category-ads-all` через geosite-данные Loyalsoldier.

https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_04_Clean_Proxy.json

Для маркетинговой/аналитической работы такой режим может мешать тестированию рекламы и аналитических пикселей.

## После импорта

1. Выберите новый профиль в INCY.
2. Полностью переподключите VPN.
3. Проверьте несколько сервисов, которые должны идти через PROXY.
4. Проверьте Яндекс/банк/Госуслуги, которые должны идти DIRECT.

## Если приложение работает неправильно

Основной домен приложения — не обязательно весь его сетевой трафик. Авторизация, API, CDN и telemetry могут использовать другие домены.

Откройте **INCY Tunnel Logs**, воспроизведите проблему и посмотрите назначения около момента сбоя. Это надёжнее, чем добавлять широкие домены наугад.

Подробно: [../docs/TROUBLESHOOTING_RU.md](../docs/TROUBLESHOOTING_RU.md)
