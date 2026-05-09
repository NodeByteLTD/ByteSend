# Changelog

All notable changes to the ByteSend SMTP Server project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]


## [1.0.0] - 2026-04-07

### Added
- SMTP server supporting ports 25 (SMT), 587 (submission), 465 (SMTPS)
- Two TLS modes:
  - `none` — Plain SMTP (intended for use behind reverse proxy)
  - `manual` — Server handles TLS directly with certificate files
- API key-based authentication using ByteSend API credentials
- Automatic email forwarding to ByteSend API endpoints
- Support for both implicit TLS (SMTPS) and opportunistic TLS (STARTTLS)
- Support for custom SMTP auth username via `SMTP_AUTH_USERNAME` environment variable
- Hot-reload functionality for TLS certificates (zero-downtime renewal)
- Structured logging with JSON output to stdout (systemd/Docker compatible)
- Environment variable validation with clear error messages

### Changed
- Improved STARTTLS handling to prevent downgrade attacks
- Enhanced error messages for certificate loading failures

### Fixed
- Proper cleanup of connections on server shutdown
- File watcher edge cases during certificate renewal

### Security
- Added security policy and vulnerability disclosure guidelines
