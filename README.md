<p align="center">
  <img src="assets/hero.svg" alt="incy-wincy — профили выборочной маршрутизации для INCY" width="100%">
</p>

<p align="center">
  <a href="README.md">Русский</a> · <a href="README_EN.md">English</a>
</p>

<p align="center">
  <img alt="Platform" src="https://img.shields.io/badge/platform-iOS%20%7C%20INCY-111827?style=flat-square">
  <img alt="Routing" src="https://img.shields.io/badge/routing-selective-2563eb?style=flat-square">
  <img alt="License" src="https://img.shields.io/badge/license-Apache--2.0-16a34a?style=flat-square">
</p>

**incy-wincy** — набор готовых профилей выборочной маршрутизации для **INCY**. Проект помогает разделять рабочий, локальный и системный трафик по разным маршрутам без необходимости вручную редактировать Xray-конфигурации.

> Проект независимый и не связан с разработчиками INCY, Xray или сервисами, упомянутыми в правилах.

## Быстрый старт

Для большинства сценариев рекомендуется **IW 02 Work+ Complete**.

Он отправляет выбранные рабочие и международные сервисы через `PROXY`, а локальные сервисы, банки, госсервисы, российские маркетплейсы и домашнюю сеть оставляет в `DIRECT`.

<p align="center">
  <img src="assets/routing-flow.svg" alt="Схема маршрутизации IW 02 Work+ Complete" width="100%">
</p>

### Самый простой способ — QR

Отсканируйте QR для **IW 02 Work+ Complete**:

<p align="center">
  <img src="assets/qr/IW_02_WorkPlus_Complete.png" alt="QR IW 02 Work+ Complete" width="280">
</p>

QR содержит INCY Autorouting deep link: приложение получает профиль из GitHub и сохраняет источник для последующих обновлений.

Все QR-коды: [docs/QR.md](docs/QR.md)

### Если добавляете вручную

Используйте этот URL **внутри INCY как источник Autorouting**, а не как обычную ссылку для открытия в браузере:

```text
https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_02_WorkPlus_Complete.json
```

После добавления активируйте **IW 02 Work+ Complete** и полностью переподключите туннель.

Подробная инструкция: [docs/SETUP_RU.md](docs/SETUP_RU.md)

## Какой профиль выбрать

<p align="center">
  <img src="assets/profile-matrix.svg" alt="Сравнение профилей incy-wincy" width="100%">
</p>

| Профиль | Назначение | Маршрут по умолчанию |
|---|---|---|
| **IW 02 Work+ Complete** | **Рекомендуемый:** выборочная маршрутизация для повседневной работы | `DIRECT` |
| IW 01 Daily | Proxy-first профиль с прямыми исключениями | `PROXY` |
| IW 03 Full Proxy | Диагностический режим | `PROXY` |
| IW 04 Clean Proxy | Full Proxy + базовая фильтрация рекламных доменов | `PROXY` |

## Все профили

### IW 01 Daily

Источник Autorouting:

```text
https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_01_Daily.json
```

QR: [открыть](assets/qr/IW_01_Daily.png)

### IW 02 Work+ Complete — рекомендуется

Источник Autorouting:

```text
https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_02_WorkPlus_Complete.json
```

QR: [открыть](assets/qr/IW_02_WorkPlus_Complete.png)

### IW 03 Full Proxy

Источник Autorouting:

```text
https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_03_Full_Proxy.json
```

QR: [открыть](assets/qr/IW_03_Full_Proxy.png)

### IW 04 Clean Proxy

Источник Autorouting:

```text
https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_04_Clean_Proxy.json
```

QR: [открыть](assets/qr/IW_04_Clean_Proxy.png)

## Что маршрутизирует Work+

Через **PROXY** направляются выбранные категории рабочих сервисов:

- AI и LLM;
- разработка и developer tooling;
- SaaS и collaboration;
- дизайн и creative tools;
- отдельные media/social endpoints.

Через **DIRECT** направляются категории, для которых важен локальный маршрут:

- Яндекс и связанные сервисы;
- банки и платёжная инфраструктура;
- госсервисы;
- российские маркетплейсы;
- карты, транспорт и доставка;
- операторы связи;
- локальные/private IP-сети.

Полный технический список находится в [`IW_02_WorkPlus_Complete.json`](routing/IW_02_WorkPlus_Complete.json).

## Почему выборочная маршрутизация

Широкое проксирование всего трафика может затронуть системные запросы iOS, авторизацию, CDN, push-сервисы и приложения, которым важен локальный IP-маршрут. Work+ минимизирует такие побочные эффекты и оставляет непопавший под правила трафик в `DIRECT`.

## Если приложение сообщает о VPN

`DIRECT` означает, что сетевой запрос приложения не отправляется через выбранный proxy-маршрут. При этом наличие активного VPN-интерфейса iOS может определяться приложением отдельно.

Для банковских и других security-sensitive приложений проект не использует MITM, hooks или модификацию приложений для обхода локальных проверок. Если DIRECT недостаточно, безопаснее временно отключить VPN.

Подробнее: [docs/TROUBLESHOOTING_RU.md](docs/TROUBLESHOOTING_RU.md)

## Структура проекта

```text
routing/     профили INCY и Autorouting deep links
assets/      hero, схемы и QR-коды
docs/        установка, QR и диагностика
modules/     AdBlock / Privacy / исключения
```

## Обновления профилей

Для постоянного использования рекомендуется **Autorouting**: INCY хранит URL источника и может получать обновления профиля из этого репозитория.

Основной источник:

```text
https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_02_WorkPlus_Complete.json
```

## Issues и изменения правил

Если конкретный сервис работает неправильно, создайте Issue. Для мобильных приложений желательно приложить только домены/IP из INCY Tunnel Logs, относящиеся к проблеме. Не публикуйте cookies, токены, содержимое запросов и персональные данные.

## Назначение проекта

incy-wincy — инструмент управления сетевой маршрутизацией и совместимостью приложений. Проект не предназначен для обхода установленных законом ограничений, антифрод-механизмов, систем лицензирования или контроля доступа.

## Лицензия

Собственные материалы incy-wincy распространяются по **Apache License 2.0**. См. [LICENSE](LICENSE) и [NOTICE](NOTICE).

Сторонние правила, модули, код и данные не перелицензируются автоматически: для них сохраняются исходные лицензии и требования attribution.
