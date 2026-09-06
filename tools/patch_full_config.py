#!/usr/bin/env python3
"""Apply the IW 05 compatibility overlay to an INCY/Xray full config.

The script preserves provider outbounds, balancers, observatories, and provider
routing intent while inserting high-priority DIRECT/BLOCK rules that normal
INCY routing profiles cannot express.

Usage:
    python3 tools/patch_full_config.py provider.json -o IW_05_WorkPlus_FullConfig.json

Optional:
    python3 tools/patch_full_config.py provider.json \
        --profile routing/IW_02_WorkPlus_Complete.json \
        -o IW_05_WorkPlus_FullConfig.json
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

DEFAULT_PROFILE = Path("routing/IW_02_WorkPlus_Complete.json")


def _ensure_outbound(config: dict[str, Any], tag: str, protocol: str) -> None:
    outbounds = config.setdefault("outbounds", [])
    if any(o.get("tag") == tag for o in outbounds if isinstance(o, dict)):
        return
    outbounds.append({"tag": tag, "protocol": protocol, "settings": {}})


def _rule_key(rule: dict[str, Any]) -> str:
    return json.dumps(rule, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def _dedupe_rules(rules: list[dict[str, Any]]) -> list[dict[str, Any]]:
    seen: set[str] = set()
    result: list[dict[str, Any]] = []
    for rule in rules:
        key = _rule_key(rule)
        if key not in seen:
            seen.add(key)
            result.append(rule)
    return result


def _is_explicit_direct(rule: dict[str, Any]) -> bool:
    return rule.get("outboundTag") == "direct"


def _is_explicit_block(rule: dict[str, Any]) -> bool:
    return rule.get("outboundTag") == "block"


def apply_overlay(config: dict[str, Any], profile: dict[str, Any]) -> dict[str, Any]:
    if "inbounds" not in config or "outbounds" not in config:
        raise ValueError("Input is not an INCY full Xray config: both inbounds and outbounds are required")

    _ensure_outbound(config, "direct", "freedom")
    _ensure_outbound(config, "block", "blackhole")

    routing = config.setdefault("routing", {})
    routing["domainStrategy"] = "IPIfNonMatch"
    provider_rules = [r for r in routing.setdefault("rules", []) if isinstance(r, dict)]

    direct_sites = list(profile.get("DirectSites", []))
    direct_ip = list(profile.get("DirectIp", []))

    provider_block_rules = [r for r in provider_rules if _is_explicit_block(r)]
    provider_direct_rules = [r for r in provider_rules if _is_explicit_direct(r)]
    provider_other_rules = [
        r for r in provider_rules
        if not _is_explicit_block(r) and not _is_explicit_direct(r)
    ]

    # Priority model:
    # 1) Preserve provider hard blocks such as bittorrent.
    # 2) Force infrastructure traffic direct.
    # 3) Apply IW 02 local/direct domains and IPs.
    # 4) Preserve provider explicit direct rules (e.g. push services).
    # 5) Block QUIC only after all explicit DIRECT exceptions.
    # 6) Keep provider balancers/fallback rules in their original relative order.
    overlay_rules: list[dict[str, Any]] = []
    overlay_rules.extend(provider_block_rules)
    overlay_rules.extend([
        {
            "type": "field",
            "network": "udp",
            "port": "53",
            "outboundTag": "direct",
        },
        {
            "type": "field",
            "network": "tcp",
            "port": "53,853",
            "outboundTag": "direct",
        },
        {
            "type": "field",
            "network": "udp",
            "port": "123",
            "outboundTag": "direct",
        },
    ])

    if direct_sites:
        overlay_rules.append({
            "type": "field",
            "domain": direct_sites,
            "outboundTag": "direct",
        })

    if direct_ip:
        overlay_rules.append({
            "type": "field",
            "ip": direct_ip,
            "outboundTag": "direct",
        })

    overlay_rules.extend(provider_direct_rules)
    overlay_rules.append({
        "type": "field",
        "network": "udp",
        "port": "443",
        "outboundTag": "block",
    })
    overlay_rules.extend(provider_other_rules)

    routing["rules"] = _dedupe_rules(overlay_rules)

    meta = config.setdefault("meta", {})
    if isinstance(meta, dict):
        current = str(meta.get("serverDescription", "")).strip()
        suffix = "IW 05 Work+ Full Config overlay"
        if suffix not in current:
            meta["serverDescription"] = f"{current} · {suffix}".strip(" ·")

    return config


def main() -> None:
    parser = argparse.ArgumentParser(description="Patch an INCY full Xray config with IW 05 overlay rules")
    parser.add_argument("input", type=Path, help="Provider full Xray JSON config")
    parser.add_argument("-o", "--output", type=Path, required=True, help="Output JSON file")
    parser.add_argument("--profile", type=Path, default=DEFAULT_PROFILE, help="IW routing profile used as DIRECT source")
    args = parser.parse_args()

    provider = json.loads(args.input.read_text(encoding="utf-8"))
    profile = json.loads(args.profile.read_text(encoding="utf-8"))

    if isinstance(provider, list):
        patched = [apply_overlay(item, profile) for item in provider]
    elif isinstance(provider, dict):
        patched = apply_overlay(provider, profile)
    else:
        raise ValueError("Top-level JSON must be an object or array of objects")

    args.output.write_text(json.dumps(patched, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Written: {args.output}")


if __name__ == "__main__":
    main()
