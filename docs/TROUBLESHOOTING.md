# Troubleshooting

## App says VPN/proxy is detected

There are two common cases:

1. **Server-side detection** — the service sees a VPN/datacenter IP, ASN, DNS mismatch or region mismatch. Explicit `DIRECT` rules can help.
2. **Local iOS detection** — the app detects the active VPN interface on the device. Routing rules cannot reliably hide this.

For banking and other security-sensitive apps, do not use MITM, hooks or app patching to defeat anti-fraud controls. If explicit DIRECT routing is insufficient, temporarily disabling the VPN is the safer option.

## Login/payment/images fail while the main app opens

The main domain may be DIRECT while auth/API/CDN endpoints are not. Open INCY Tunnel Logs, reproduce the action and inspect the destinations around the failure.

## Foreign service still thinks the region is Russia

Possible causes include:

- a missing API/CDN endpoint that stayed DIRECT;
- exit-IP reputation or ASN;
- account region;
- cookies/session data;
- payment profile;
- GPS/system region.

Start with Tunnel Logs before changing DNS, Fragmentation, Mux and routing at the same time.

## Rule-change discipline

Change one layer at a time. Otherwise it becomes difficult to identify whether a regression came from routing, DNS, transport settings or a module.
