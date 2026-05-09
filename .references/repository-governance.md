# Repository Governance Reference

Last reviewed: 2026-05-09

## Purpose

This document maps repository-level governance files so maintainers can keep contributor and security processes consistent.

## Community Health Files

Root-level:

- SECURITY.md
- CODE_OF_CONDUCT.md
- CONTRIBUTING.md
- SUPPORT.md

GitHub-level:

- .github/PULL_REQUEST_TEMPLATE.md
- .github/ISSUE_TEMPLATE/bug.yml
- .github/ISSUE_TEMPLATE/smtp.yml
- .github/ISSUE_TEMPLATE/marketing.yml
- .github/ISSUE_TEMPLATE/feature.yml
- .github/ISSUE_TEMPLATE/docs.yml
- .github/ISSUE_TEMPLATE/config.yml

## Triage Labels Referenced by Templates

Current templates rely on:

- bug
- smtp
- marketing
- enhancement
- documentation
- needs-triage

Keep repository labels aligned with template expectations.

## Maintenance Checklist

Run this checklist after major workflow or process changes:

1. SECURITY.md contact channel still valid
2. CONTRIBUTING.md setup commands still accurate
3. Issue template fields still match current product areas
4. PR template checklist reflects required CI checks
5. README links to governance docs remain valid

## Security Reporting Rule

Security vulnerabilities should be reported privately per SECURITY.md and not through public issue templates.

## When to Update

Update governance references when:

- You add or remove issue templates
- You change support/security contact paths
- You modify expected PR quality gates
- You change branch/release process semantics
