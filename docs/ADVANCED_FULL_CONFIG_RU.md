# IW 05 Work+ Full Config Overlay

`IW 05` предназначен для подписок INCY, которые возвращают **полный Xray-конфиг** с собственными `outbounds`, `balancers`, `observatory`/`burstObservatory` и routing-правилами.

Это не обычный routing-profile и не замена `IW 02` для стандартных подписок.

## Рекомендуемый режим: Dynamic Subscription Transformer

Статический Full Config быстро устаревает, если provider меняет серверы, Reality keys, balancers или transport-настройки. Поэтому для постоянного использования лучше не хранить готовый `IW 05` вручную, а использовать динамический transformer:

```text
provider subscription
        ↓
IW Dynamic Transformer
        ↓
IW 05 overlay
        ↓
актуальный Full Xray Config
        ↓
INCY
```

Worker при каждом запросе получает свежий provider config и свежий `IW 02 Work+ Complete`, после чего применяет overlay без публикации provider credentials в GitHub.

Код: [`../worker/`](../worker/)

Инструкция: [`../worker/README_RU.md`](../worker/README_RU.md)

## Зачем он нужен

Обычный профиль INCY умеет задавать доменные/IP-маршруты, но не даёт выразить часть транспортных правил, которые нужны в сложном provider full config.

Типичный full-config может содержать собственные outbounds вроде `eutcp-*`, `eugrpc-*`, `pri-*`, `res-*`, отдельные `gemini`/`bank`, balancers и provider fallback.

`IW 05` не удаляет эту архитектуру. Он добавляет контролируемый слой правил поверх неё.

## Приоритет правил

Transformer и локальный патчер формируют `routing.rules` в таком порядке:

1. исходные provider explicit BLOCK-правила, например блокировка BitTorrent;
2. DNS `UDP/53` → `direct`;
3. DNS/DoT `TCP/53,853` → `direct`;
4. NTP `UDP/123` → `direct`;
5. `DirectSites` из `IW 02 Work+ Complete` → `direct`;
6. `DirectIp` из `IW 02 Work+ Complete` → `direct`;
7. исходные provider explicit DIRECT-правила, например push endpoints;
8. QUIC `UDP/443` → `block`;
9. остальные исходные provider rules и balancers в их исходном относительном порядке.

`domainStrategy` устанавливается в `IPIfNonMatch`.

Такой порядок важен: локальный/банковский трафик, которому разрешён DIRECT, не блокируется общим правилом QUIC. Блокировка UDP/443 применяется только после явных DIRECT-исключений.

## Почему UDP/443 блокируется

Некоторые VLESS/XTLS Vision outbounds не принимают QUIC-трафик и дают в Xray-логах `XTLS rejected UDP/443 traffic`.

В этом случае блокировка QUIC заставляет приложение быстрее перейти на TCP/TLS/HTTP2 вместо повторных неуспешных попыток отправить UDP/443 через несовместимый outbound.

Если provider полноценно поддерживает UDP/443, это правило можно удалить из transformer/патчера.

## Важный пример: provider bank route

Некоторые full configs сами отправляют Яндекс, VK, маркетплейсы и банковские домены в специальный `bank_balancer`.

Поскольку `IW 05` помещает `IW 02 DirectSites` выше таких правил, выбранные локальные домены получают **настоящий `direct`**, а не provider `bank_balancer`.

Это намеренное отличие Work+ от исходной provider-конфигурации.

## Динамический вариант

Worker хранит provider subscription URL и access token только в секретах среды выполнения.

Пример выходного URL:

```text
https://<worker>/config/lte/<ACCESS_TOKEN>
```

Для второй подписки/режима:

```text
https://<worker>/config/eu/<ACCESS_TOKEN>
```

Такой URL остаётся коротким, а конфигурация обновляется вместе с provider subscription.

## Локальный fallback

Для разового применения остаётся локальный Python-патчер:

```bash
python3 tools/patch_full_config.py provider.json \
  -o IW_05_WorkPlus_FullConfig.json
```

Он:

- не меняет VLESS/Trojan/etc credentials;
- не меняет адреса и transport-настройки provider outbounds;
- сохраняет balancers;
- сохраняет `observatory` / `burstObservatory`;
- сохраняет специальные provider routes вроде `gemini_balancer`;
- добавляет `direct`/`block` outbounds только если их нет;
- использует актуальные `DirectSites` и `DirectIp` из `IW 02`.

## Импорт в INCY

Полный Xray JSON определяется INCY по наличию одновременно `inbounds` и `outbounds` и импортируется как отдельная серверная конфигурация, а не как routing-profile.

Не используйте для `IW 05` ссылки вида:

```text
incy://routing/onadd/...
```

Они предназначены для обычных routing profiles.

Для динамического transformer используйте URL выдаваемого Full Config как источник конфигурации. Если конкретная версия INCY поддерживает URL внутри import deeplink, можно использовать:

```text
incy://import/https://<worker>/config/lte/<ACCESS_TOKEN>
```

Если нет — вставьте HTTPS URL Worker через обычный экран добавления Full Config / подписки.

## Почему нет универсального публичного QR

Full config содержит адреса серверов, UUID/credentials, Reality keys и другие данные конкретной подписки. Их нельзя публиковать в открытом репозитории.

Поэтому репозиторий содержит безопасный transformer, локальный патчер и reference rules. Персональный URL/QR создаётся только после приватного deploy.

## Проверка после импорта

В Tunnel Logs ожидается:

```text
UDP/53           -> taking detour [direct]
TCP/853          -> taking detour [direct]
UDP/123          -> taking detour [direct]
Yandex/VK/banks  -> taking detour [direct]
UDP/443 (other)  -> taking detour [block]
Gemini TCP/443   -> provider gemini_balancer
Other traffic    -> provider balancer/fallback
```

## Ограничения

Overlay не исправляет неисправные серверы. Ошибки `connection refused`, `tls: internal error`, `x509 ... not <expected hostname>` требуют исправления или исключения соответствующего provider endpoint.

Dynamic transformer устраняет проблему устаревания статического snapshot, но не может исправить upstream config, если provider сам возвращает некорректные outbounds.
