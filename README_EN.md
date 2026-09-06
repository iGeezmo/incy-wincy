# incy-wincy

[Русский](README.md) · [English](README_EN.md)

Community-maintained routing profiles and modules for **INCY** (Xray-based client), focused on selective routing: work/AI/global services through proxy while local and VPN-sensitive services stay direct.

> This repository is independent and is not affiliated with INCY developers, Xray, or service providers referenced by the rules.

## Quick start

For most users, use **IW 02 Work+ Complete**.

Autorouting URL:

https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_02_WorkPlus_Complete.json

Import the URL into INCY routing/Autorouting, activate **IW 02 Work+ Complete**, and fully reconnect the VPN tunnel.

## Profiles

| Profile | Purpose | Unmatched traffic |
|---|---|---|
| IW 01 Daily | Proxy-first everyday profile with direct exceptions | Profile-specific |
| **IW 02 Work+ Complete** | Recommended selective work/global routing | DIRECT |
| IW 03 Full Proxy | Diagnostic full-proxy mode | PROXY |
| IW 04 Clean Proxy | Full proxy plus ad-domain filtering | PROXY |

### Direct config URLs

IW 01 Daily  
https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_01_Daily.json

IW 02 Work+ Complete  
https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_02_WorkPlus_Complete.json

IW 03 Full Proxy  
https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_03_Full_Proxy.json

IW 04 Clean Proxy  
https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_04_Clean_Proxy.json

## Important limitation

DIRECT routing does not hide the active iOS VPN interface itself. If a banking/security-sensitive app detects VPN locally, routing rules cannot reliably conceal it. Do not use MITM, hooks, or app patching to bypass banking anti-fraud controls.

## Contributions

Use issues/PRs for verified routing fixes. For mobile apps, prefer INCY Tunnel Logs as evidence instead of guessing API/CDN domains.

## License

Original incy-wincy material is licensed under the **Apache License 2.0**. Third-party materials retain their original licensing and attribution requirements.
