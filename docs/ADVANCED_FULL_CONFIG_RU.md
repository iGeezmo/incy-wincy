# IW 05 Work+ Full Config Overlay

`IW 05` предназначен для подписок INCY, которые возвращают **полный Xray-конфиг** с собственными `outbounds`, `balancers`, `observatory`/`burstObservatory` и routing-правилами.

Это не обычный routing-profile и не замена `IW 02` для стандартных подписок.

## Зачем он нужен

Обычный профиль INCY умеет задавать доменные/IP-маршруты, но не даёт выразить часть транспортных правил, которые нужны в сложном provider full config.

Типичный full-config может содержать собственные outbounds вроде `eutcp-*`, `eugrpc-*`, `ustcp-*`, `usgrpc-*`, отдельные `gemini`/`bank`, balancers и provider fallback.

`IW 05` не удаляет эту архитектуру. Он добавляет контролируемый слой правил поверх неё.

## Приоритет правил

Патчер формирует `routing.rules` в таком порядке:

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

Если provider полноценно поддерживает UDP/443, это правило можно удалить.

## Как собрать IW 05

Нужен **экспорт полного provider Xray JSON**. В нём должны присутствовать как минимум `inbounds` и `outbounds`.

```bash
python3 tools/patch_full_config.py provider.json \
  -o IW_05_WorkPlus_FullConfig.json
```

Патчер:

- не меняет VLESS/Trojan/etc credentials;
- не меняет адреса и transport-настройки provider outbounds;
- сохраняет balancers;
- сохраняет `observatory` / `burstObservatory`;
- сохраняет специальные provider routes вроде `gemini_balancer`;
- добавляет `direct`/`block` outbounds только если их нет;
- использует актуальные `DirectSites` и `DirectIp` из `IW 02`.

## Важный пример: provider bank route

Некоторые full configs сами отправляют Яндекс, VK, маркетплейсы и банковские домены в специальный `bank_balancer`.

Поскольку `IW 05` помещает `IW 02 DirectSites` выше таких правил, выбранные локальные домены получают **настоящий `direct`**, а не provider `bank_balancer`.

Это намеренное отличие Work+ от исходной provider-конфигурации.

## Импорт в INCY

Полный Xray JSON определяется INCY по наличию одновременно `inbounds` и `outbounds` и импортируется как отдельная серверная конфигурация, а не как routing-profile.

Не используйте для `IW 05` ссылки вида:

```text
incy://routing/onadd/...
```

Они предназначены для обычных routing profiles.

## Почему нет универсального публичного QR

Full config содержит адреса серверов, UUID/credentials, Reality keys и другие данные конкретной подписки. Их нельзя публиковать в открытом репозитории.

Поэтому репозиторий содержит только безопасный патчер и reference rules. Готовый `IW 05` создаётся локально из конкретного provider config.

## Проверка после импорта

В Tunnel Logs ожидается:

```text
UDP/53           -> taking detour [direct]
TCP/853          -> taking detour [direct]
UDP/123          -> taking detour [direct]
Yandex/VK/banks  -> taking detour [direct]
UDP/443 (other)  -> taking detour [block]
Gemini TCP/443   -> provider gemini_balancer
Other traffic    -> provider EUTCP/fallback
```

## Ограничения

Overlay не исправляет неисправные серверы. Ошибки `connection refused`, `tls: internal error`, `x509 ... not <expected hostname>` требуют исправления или исключения соответствующего provider endpoint.

Также provider может обновить подписку и заменить full config. После такого обновления overlay нужно применить заново.
