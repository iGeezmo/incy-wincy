# IW Dynamic Subscription Transformer

Этот Worker превращает приватную provider-подписку с Full Xray Config в динамический **IW 05 Work+** без публикации UUID, Reality keys и URL подписки в репозитории.

## Что происходит

```text
provider subscription
        ↓
Cloudflare Worker
        ↓
IW 05 overlay
        ↓
готовый Full Xray Config
        ↓
INCY
```

При каждом запросе Worker заново получает актуальный upstream-конфиг и актуальный `IW 02 Work+ Complete`, после чего добавляет high-priority правила:

- DNS `UDP/53` → `direct`;
- DNS/DoT `TCP/53,853` → `direct`;
- NTP `UDP/123` → `direct`;
- `DirectSites` из IW 02 → `direct`;
- `DirectIp` из IW 02 → `direct`;
- оставшийся QUIC `UDP/443` → `block`;
- затем сохраняет исходные provider routing/balancers/fallback.

Provider block-rules сохраняются первыми, а его explicit DIRECT rules не удаляются.

## Секреты

Никогда не коммитьте URL подписки или access token в GitHub.

Worker использует два Cloudflare secrets:

### `UPSTREAMS_JSON`

JSON-объект вида:

```json
{
  "eu": "https://provider.example/subscription-token",
  "lte": "https://provider.example/second-token"
}
```

### `ACCESS_TOKEN`

Случайный длинный токен, который будет частью приватного URL. Рекомендуется не менее 32 случайных байт.

## Развёртывание вручную

```bash
cd worker
npm install
npx wrangler login
npx wrangler secret put UPSTREAMS_JSON
npx wrangler secret put ACCESS_TOKEN
npm run deploy
```

После deploy Worker получит адрес вида:

```text
https://incy-wincy-transformer.<account>.workers.dev
```

## Ссылки для INCY

Для EU-профиля:

```text
https://incy-wincy-transformer.<account>.workers.dev/config/eu/<ACCESS_TOKEN>
```

Для LTE-профиля:

```text
https://incy-wincy-transformer.<account>.workers.dev/config/lte/<ACCESS_TOKEN>
```

Если INCY принимает URL через import deeplink, используйте:

```text
incy://import/https://incy-wincy-transformer.<account>.workers.dev/config/lte/<ACCESS_TOKEN>
```

Если конкретная версия INCY не принимает URL внутри `incy://import`, используйте URL Worker как источник Full Config через обычный экран импорта/подписки.

## Безопасность

- Ответы имеют `Cache-Control: no-store`.
- Worker не пишет содержимое конфигурации в код или репозиторий.
- `/health` не раскрывает upstream URL и credentials.
- URL с `ACCESS_TOKEN` всё равно является секретом. Не публикуйте его в Issues, README, скриншотах или QR в публичном репозитории.
- При утечке токена замените `ACCESS_TOKEN`. При утечке upstream URL/UUID перевыпустите provider subscription credentials.

## Поддерживаемый upstream

Worker принимает:

- JSON Full Xray Config;
- массив Full Xray Config;
- Base64-encoded JSON Full Config.

Если upstream возвращает другой subscription format, Worker вернёт `502 transform_failed`, не подменяя данные догадками.
