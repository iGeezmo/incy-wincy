# Установка incy-wincy в INCY

Эта инструкция рассчитана на пользователя, который не хочет вручную редактировать JSON.

## Самый простой вариант

Используйте **IW 02 Work+ Complete**.

### Правильная ссылка для вставки в экран «Импорт профиля»

```text
incy://autorouting/onadd/https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_02_WorkPlus_Complete.json
```

Именно **полный `incy://...` deeplink** нужно вставлять в поле, показанное на экране «Импорт профиля».

Голый URL вида `https://raw.githubusercontent.com/...json` является только адресом файла профиля и сам по себе в этом поле может не импортироваться.

### Шаг 1

Скопируйте deeplink выше целиком, начиная с `incy://`.

### Шаг 2

Откройте INCY → маршрутизация → импорт профиля.

### Шаг 3

Вставьте deeplink в поле **«URL или Base64 профиля»**.

### Шаг 4

Нажмите **«Импорт»**. Вариант `autorouting/onadd` должен добавить профиль, сразу активировать его и сохранить URL источника для последующих обновлений.

### Шаг 5

Полностью отключите и снова включите VPN-туннель.

## Если Autorouting не срабатывает

Используйте одноразовый импорт:

```text
incy://routing/onadd/https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_02_WorkPlus_Complete.json
```

Он добавляет и активирует профиль, но не сохраняет привязку к источнику для автообновлений.

## Все готовые INCY-ссылки

**IW 01 Daily**

```text
incy://autorouting/onadd/https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_01_Daily.json
```

**IW 02 Work+ Complete — рекомендуется**

```text
incy://autorouting/onadd/https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_02_WorkPlus_Complete.json
```

**IW 03 Full Proxy**

```text
incy://autorouting/onadd/https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_03_Full_Proxy.json
```

**IW 04 Clean Proxy**

```text
incy://autorouting/onadd/https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_04_Clean_Proxy.json
```

## Что проверить

После импорта проверьте несколько сервисов из профиля и затем полностью переподключите туннель.

## Базовые настройки туннеля

Для старта на iOS:

- Fragmentation — выключено, если вы не решаете конкретную transport-проблему;
- Mux — выключено, если не тестировали его с конкретным сервером/транспортом;
- Тип IP — Auto;
- VPN DNS — Internal / рекомендованная настройка INCY;
- FakeDNS — выключен в опубликованных профилях.

Не включайте сразу несколько дополнительных функций, если всё работает: это усложняет диагностику.

## Почему рекомендуется Work+

Он использует выборочную маршрутизацию: выбранные рабочие сервисы идут через прокси, а локальные ресурсы и явно заданные DIRECT-категории остаются напрямую.

## Если что-то сломалось

См. [TROUBLESHOOTING_RU.md](TROUBLESHOOTING_RU.md).
