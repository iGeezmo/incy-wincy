# QR-коды для быстрой установки

Для INCY лучше использовать **deeplink**, а не просто открывать raw JSON в браузере.

Голая ссылка вида:

`https://raw.githubusercontent.com/.../profile.json`

сама по себе не обязана добавлять профиль при обычном открытии. Её нужно либо вставлять именно в поле **URL профиля / Autorouting** внутри INCY, либо использовать deeplink/QR ниже. Официально INCY поддерживает оба варианта deeplink: `autorouting/onadd` и `routing/onadd`.

## IW 02 Work+ Complete — рекомендуется

### Вариант A — Autorouting QR

![IW 02 Work+ Complete Autorouting](../assets/qr/IW_02_WorkPlus_Complete.png)

Содержимое QR:

`incy://autorouting/onadd/https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_02_WorkPlus_Complete.json`

Этот вариант добавляет профиль, активирует его и сохраняет GitHub URL как источник автообновлений.

### Вариант B — fallback, одноразовый импорт

Если Autorouting QR по какой-то причине не срабатывает, используйте второй QR:

![IW 02 Work+ Complete one-time](../assets/qr/IW_02_WorkPlus_Complete_one_time.svg)

Содержимое QR:

`incy://routing/onadd/https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_02_WorkPlus_Complete.json`

Этот вариант скачивает и активирует профиль как обычный импорт без привязки к автообновлению.

Готовый deeplink-файл: [IW_02_WorkPlus_Complete_one_time.txt](../routing/IW_02_WorkPlus_Complete_one_time.txt)

---

## IW 01 Daily

![IW 01 Daily](../assets/qr/IW_01_Daily.png)

`incy://autorouting/onadd/https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_01_Daily.json`

## IW 03 Full Proxy

![IW 03 Full Proxy](../assets/qr/IW_03_Full_Proxy.png)

`incy://autorouting/onadd/https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_03_Full_Proxy.json`

## IW 04 Clean Proxy

![IW 04 Clean Proxy](../assets/qr/IW_04_Clean_Proxy.png)

`incy://autorouting/onadd/https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_04_Clean_Proxy.json`

## Что делать, если профиль не добавляется

1. Убедитесь, что открываете deeplink именно на устройстве с установленным INCY.
2. Попробуйте сначала Autorouting QR.
3. Если не сработал — используйте fallback QR `routing/onadd`.
4. Если добавляете вручную, вставляйте raw URL именно в поле URL профиля/Autorouting, а не просто открывайте его в Safari.
5. После успешного добавления полностью переподключите VPN.

Если и fallback не работает, приложите скрин экрана импорта INCY и версию приложения — тогда можно проверить уже конкретный UI/парсер версии.
