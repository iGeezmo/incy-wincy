const DEFAULT_PROFILE_URL = "https://raw.githubusercontent.com/iGeezmo/incy-wincy/main/routing/IW_02_WorkPlus_Complete.json";

function ensureOutbound(config, tag, protocol) {
  config.outbounds ??= [];
  if (!config.outbounds.some((o) => o && o.tag === tag)) {
    config.outbounds.push({ tag, protocol, settings: {} });
  }
}

function ruleKey(rule) {
  return JSON.stringify(rule, Object.keys(rule).sort());
}

function dedupeRules(rules) {
  const seen = new Set();
  const out = [];
  for (const rule of rules) {
    const key = JSON.stringify(rule);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(rule);
    }
  }
  return out;
}

function isBlockRule(rule) {
  return rule && rule.type === "field" && rule.outboundTag === "block";
}

function isDirectRule(rule) {
  return rule && rule.type === "field" && rule.outboundTag === "direct";
}

function patchConfig(config, profile) {
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    throw new Error("Full config must be a JSON object");
  }
  if (!Array.isArray(config.inbounds) || !Array.isArray(config.outbounds)) {
    throw new Error("Not a Full Xray config: inbounds and outbounds are required");
  }

  ensureOutbound(config, "direct", "freedom");
  ensureOutbound(config, "block", "blackhole");

  config.routing ??= {};
  config.routing.domainMatcher ??= "hybrid";
  config.routing.domainStrategy = "IPIfNonMatch";

  const providerRules = Array.isArray(config.routing.rules) ? config.routing.rules : [];
  const providerBlock = providerRules.filter(isBlockRule);
  const providerDirect = providerRules.filter(isDirectRule);
  const providerRest = providerRules.filter((r) => !isBlockRule(r) && !isDirectRule(r));

  const directSites = Array.isArray(profile.DirectSites) ? profile.DirectSites : [];
  const directIp = Array.isArray(profile.DirectIp) ? profile.DirectIp : [];

  const iwRules = [
    { type: "field", network: "udp", port: "53", outboundTag: "direct" },
    { type: "field", network: "tcp", port: "53,853", outboundTag: "direct" },
    { type: "field", network: "udp", port: "123", outboundTag: "direct" },
  ];

  if (directSites.length) {
    iwRules.push({ type: "field", domain: directSites, outboundTag: "direct" });
  }
  if (directIp.length) {
    iwRules.push({ type: "field", ip: directIp, outboundTag: "direct" });
  }

  // Block QUIC only after all explicit DIRECT rules. Apps then fall back to TCP/443.
  const quicBlock = { type: "field", network: "udp", port: "443", outboundTag: "block" };

  config.routing.rules = dedupeRules([
    ...providerBlock,
    ...iwRules,
    ...providerDirect,
    quicBlock,
    ...providerRest,
  ]);

  config.remarks = `${config.remarks || "Full Config"} · IW 05 Work+`;
  return config;
}

function decodeBase64Text(input) {
  let s = input.trim().replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bytes = Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function parsePayload(text) {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch (_) {
    try {
      return JSON.parse(decodeBase64Text(trimmed));
    } catch (_) {
      throw new Error("Upstream is neither JSON nor Base64-encoded JSON");
    }
  }
}

function getUpstreamMap(env) {
  if (!env.UPSTREAMS_JSON) throw new Error("UPSTREAMS_JSON secret is not configured");
  const map = JSON.parse(env.UPSTREAMS_JSON);
  if (!map || typeof map !== "object" || Array.isArray(map)) {
    throw new Error("UPSTREAMS_JSON must be an object mapping profile names to URLs");
  }
  return map;
}

async function fetchJson(url, label) {
  const response = await fetch(url, {
    headers: { "User-Agent": "incy-wincy-transformer/1.0" },
    redirect: "follow",
  });
  if (!response.ok) throw new Error(`${label} returned HTTP ${response.status}`);
  return response.text();
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store, no-cache, must-revalidate",
      "pragma": "no-cache",
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer",
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return jsonResponse({ ok: true, service: "incy-wincy-transformer" });
    }

    const match = url.pathname.match(/^\/config\/([a-zA-Z0-9_-]+)\/([^/]+)$/);
    if (!match) {
      return jsonResponse({
        error: "not_found",
        usage: "/config/<profile>/<access-token>",
      }, 404);
    }

    const [, profileName, accessToken] = match;
    if (!env.ACCESS_TOKEN || accessToken !== env.ACCESS_TOKEN) {
      return jsonResponse({ error: "unauthorized" }, 401);
    }

    try {
      const upstreams = getUpstreamMap(env);
      const upstreamUrl = upstreams[profileName];
      if (!upstreamUrl) return jsonResponse({ error: "unknown_profile" }, 404);

      const profileUrl = env.IW_PROFILE_URL || DEFAULT_PROFILE_URL;
      const [upstreamText, profileText] = await Promise.all([
        fetchJson(upstreamUrl, "Upstream subscription"),
        fetchJson(profileUrl, "IW profile"),
      ]);

      const upstream = parsePayload(upstreamText);
      const profile = JSON.parse(profileText);

      const patched = Array.isArray(upstream)
        ? upstream.map((item) => patchConfig(item, profile))
        : patchConfig(upstream, profile);

      return jsonResponse(patched);
    } catch (error) {
      return jsonResponse({
        error: "transform_failed",
        message: error instanceof Error ? error.message : String(error),
      }, 502);
    }
  },
};
