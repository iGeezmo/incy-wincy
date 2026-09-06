# Security policy

This repository contains routing profiles and, eventually, optional HTTP filtering modules. Treat module changes as security-sensitive.

## Do not report secrets publicly

Do not include VPN credentials, subscription URLs, tokens, cookies, account identifiers, private server addresses or personally identifying logs in public issues.

## High-risk changes

The following require explicit review and clear technical justification:

- MITM / HTTPS interception;
- arbitrary JavaScript or remote scripts;
- credential or authentication traffic modification;
- certificate changes;
- banking/payment app manipulation;
- broad routing changes that capture large platform ecosystems.

## Banking and anti-fraud

This project does not aim to bypass banking anti-fraud controls or conceal a locally detected VPN interface from security-sensitive apps. Prefer DIRECT routing or temporarily disabling the VPN when required.

## Reporting a vulnerability

If a repository rule or module could expose credentials, redirect sensitive traffic, or execute untrusted code, avoid posting secrets in a public issue. Describe the affected file and risk without including private data, then contact the repository owner through GitHub.
