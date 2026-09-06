# Setup

## Recommended profile

Use `IW 02 Work+ Complete` for normal daily use.

Autorouting URL:

```text
https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_02_WorkPlus_Complete.json
```

## Basic tunnel settings

Recommended starting point on iOS:

- Fragmentation: off unless solving a specific DPI problem.
- Mux: off unless tested for a specific transport/server setup.
- IP type: Auto.
- VPN DNS: Internal / recommended client setting.
- FakeDNS: off in the published profiles.

## Validation after import

1. Fully reconnect the VPN tunnel.
2. Confirm proxy-routed services such as ChatGPT, Claude, GitHub and Figma work.
3. Confirm direct-routed services such as Yandex Market, your bank, Gosuslugi and major RU marketplaces still work.
4. If a mobile app fails, reproduce the failure while Tunnel Logs are open.
5. Add only verified API/CDN/auth endpoints to the correct route.

## Why selective routing

Selective routing avoids proxying large platform ecosystems wholesale. Broad `apple.com`, `google.com`, `googleapis.com` or `microsoft.com` rules can capture unrelated system traffic, authentication, push, CDN and app-service requests.
