# Modules

INCY 2.5.5 on iOS exposes Shadowrocket/Surge-compatible module import. This directory is reserved for small, auditable modules rather than opaque all-in-one bundles.

Planned modules:

- `IW_AdBlock.module` — one global ad-blocking layer.
- `IW_Privacy.module` — trackers and telemetry, kept separate from ad blocking.
- `IW_Work_Exceptions.module` — exceptions for analytics and marketing diagnostics such as GA4/GTM/Meta Pixel/Yandex Metrica where needed.
- Optional app-specific modules only after compatibility testing.

## Safety policy

Do not merge modules that require broad MITM, arbitrary scripts, credential interception, banking-app modification, or unknown remote code without an explicit review of what they do.

Routing and content filtering should remain separate layers. A module should not duplicate routing rules unless there is a documented reason.
