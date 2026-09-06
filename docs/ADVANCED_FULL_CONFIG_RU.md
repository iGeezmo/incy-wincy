# IW 05 Work+ Full Config Overlay

`IW 05` предназначен для подписок INCY, которые возвращают **полный Xray-конфиг** с собственными `outbounds`, `balancers`, `observatory` и routing-правилами.

Это не обычный routing-profile и не замена `IW 02` для стандартных подписок.

## Зачем он нужен

Обычный профиль INCY умеет задавать доменные/IP-маршруты, но не даёт выразить часть транспортных правил, которые нужны в сложном provider full config.

По логам типичного full-config можно увидеть собственные outbounds вроде `eutcp-*`, `eugrpc-*`, `ustcp-*`, `usgrpc-*`, специальные `gemini`/`bank`, а также `observatory` и provider fallback/baseline.

`IW 05` не удаляет эту архитектуру. Он добавляет поверх неё несколько high-priority правил и оставляет provider routing после них.

## Что добавляет overlay

В начало `routing.rules` добавляются:

1. DNS `UDP/53` → `direct`;
2. DNS/DoT `TCP/53,853` → `direct`;
3. NTP `UDP/123` → `direct`;
4. QUIC `UDP/443` → `block`;
5. `DirectSites` из `IW 02 Work+ Complete` → `direct`;
6. `DirectIp` из `IW 02 Work+ Complete` → `direct`.

Затем идут исходные provider rules без изменения порядка.

`domainStrategy` принудительно устанавливается в `IPIfNonMatch`.

## Почему UDP/443 блокируется

Некоторые VLESS/XTLS outbounds в full-config не принимают QUIC-трафик и в логах дают `XTLS rejected UDP/443 traffic`.

Блокировка QUIC заставляет приложения использовать TCP/TLS fallback вместо многократных неуспешных попыток проксировать UDP/443 через несовместимый outbound.

Если ваш provider корректно поддерживает UDP/443, это правило можно удалить из сгенерированного файла.

## Как собрать IW 05

Нужен **экспорт полного provider Xray JSON**. В нём должны присутствовать как минимум поля `inbounds` и `outbounds`.

Запуск:

```bash
python3 tools/patch_full_config.py provider.json \
  -o IW_05_WorkPlus_FullConfig.json
```

Скрипт:

- не меняет VLESS/Trojan/etc credentials;
- не меняет provider outbounds;
- не удаляет balancers;
- не удаляет observatory/burstObservatory;
- не переставляет исходные provider routing rules между собой;
- при необходимости добавляет стандартные `direct` и `block` outbounds;
- добавляет IW-правила перед provider rules.

## Импорт в INCY

Полный Xray JSON определяется INCY по наличию одновременно `inbounds` и `outbounds` и импортируется как отдельная серверная конфигурация, а не как routing-profile.

Для локального файла используйте обычный импорт конфигурации INCY. Для URL, который возвращает готовый full config, применяется общий механизм добавления конфигураций/подписок, а не `incy://routing/...`.

**Не используйте** для `IW 05` ссылки вида:

```text
incy://routing/onadd/...
```

Они предназначены для обычных routing profiles и не заменяют импорт full Xray config.

## Почему в репозитории пока нет универсального QR для IW 05

Full config содержит реальные provider outbounds, адреса серверов и credentials. Один публичный статический `IW 05` не может корректно заменить их и не должен публиковать чужие секреты.

Поэтому публичная часть проекта содержит безопасный overlay-патчер. Готовый `IW 05` создаётся локально из конкретного provider config.

## Проверка после импорта

В Tunnel Logs ожидается:

```text
UDP/53  -> taking detour [direct]
TCP/853 -> taking detour [direct]
UDP/123 -> taking detour [direct]
RU/Yandex/VK -> taking detour [direct]
UDP/443 -> taking detour [block]
```

Рабочий зарубежный трафик после этих правил должен доходить до исходного provider routing/balancer.

## Ограничения

Overlay не исправляет неисправные серверы. Ошибки вида `connection refused`, `tls: internal error`, `x509 ... not <expected hostname>` требуют исправления или исключения соответствующего provider endpoint.
