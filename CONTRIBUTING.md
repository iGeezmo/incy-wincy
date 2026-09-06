# Contributing

Contributions are welcome, especially verified routing fixes and compatibility findings for INCY.

## Licensing of contributions

Unless explicitly stated otherwise, contributions intentionally submitted for inclusion in incy-wincy are provided under the **Apache License 2.0**, consistent with Section 5 of that license.

Only submit material that you have the right to contribute.

If a contribution includes or derives from third-party rules, modules, code, datasets, documentation, or generated artifacts:

1. identify the upstream source;
2. provide its license;
3. preserve required copyright and attribution notices;
4. explain whether modification and redistribution are permitted;
5. do not assume that third-party material becomes Apache-2.0 merely because it is committed here.

Material with unclear provenance or incompatible licensing should not be merged until reviewed.

## Rule changes

For a routing change, include:

1. Service/app name.
2. Whether the destination should be `DIRECT`, `PROXY` or `BLOCK`.
3. Exact domain/IP rule.
4. Evidence: preferably INCY Tunnel Logs captured while reproducing the issue.
5. What broke before the change and what worked after it.

Avoid adding broad parent domains when a smaller endpoint set is sufficient. Broad Apple/Google/Microsoft rules require a clear justification because they may capture unrelated system traffic.

## Modules

Modules should be small and auditable. Pull requests involving MITM, scripts, HTTPS body rewriting or remote code must explain exactly what is intercepted and why.

Do not submit rules intended to bypass banking anti-fraud, credential controls, paywalls, licensing checks or account-security mechanisms.

## Naming

Repository namespace: `IW`.

Examples:

- `IW 01 Daily`
- `IW 02 Work+ Complete`
- `IW_AdBlock.module`

## Testing

Test one layer at a time and include the INCY version/platform when reporting behavior.
