# Security Policy

## Overview

The ByteSend SMTP Server is designed with security as a core principle. This document outlines security practices, vulnerability reporting, and guidelines for secure deployment.

---

## Security Considerations

### Authentication

- **API Key Based:** The server uses ByteSend API keys as SMTP passwords
- **Username Verification:** Default username is `bytesend` (configurable via `SMTP_AUTH_USERNAME`)
- **No Password Storage:** Keys are never persisted; validated on each connection
- **API Key Management:**
  - Store keys in environment variables or secrets management systems (never in version control)
  - Rotate API keys regularly
  - Use separate keys per environment (dev, staging, production)
  - Revoke compromised keys immediately

### Transport Security (TLS)

#### Mode: `none` (Behind Reverse Proxy)
- Server runs plain SMTP; TLS is handled by the proxy
- `STARTTLS` is disabled at the server level
- Use with:
  - Nginx with SSL module
  - Traefik with TLS routers
  - AWS ALB with TLS listeners
- **Best practice:** Restrict the proxy-to-SMTP connection to a private network

#### Mode: `manual` (Standalone)
- Server handles TLS directly
- Requires valid certificates from a trusted CA (Let's Encrypt, etc.)
- Self-signed certificates are supported for testing only
- **Best practice:**
  - Use multi-year certificates or automate renewal
  - Implement certificate pinning if possible
  - Monitor certificate expiration dates

### Network Isolation

- **Firewall Rules:** Restrict SMTP ports (25, 587, 465) to trusted IPs or subnets
- **Docker Networks:** Use custom networks instead of host networking
- **Private Networks:** Consider running the SMTP server on a private network, exposing only to authorized applications
- **Rate Limiting:** Implement rate limiting at the reverse proxy level to prevent brute-force attacks

### Logging & Monitoring

- **Structured Logging:** All logs are output to stdout (compatible with journald, Docker, Kubernetes)
- **Sensitive Data:** API keys are **never** logged; only connection status and errors
- **Monitoring Recommendations:**
  - Monitor authentication failure rates
  - Alert on TLS certificate errors
  - Track email submission rates (early detection of hijacked credentials)
  - Set up alerting for process crashes or unexpected restarts

### File Permissions

- **Certificate Files:** Should be readable only by the SMTP server process
  ```bash
  sudo chown smtp:smtp /path/to/cert.pem /path/to/key.pem
  sudo chmod 600 /path/to/key.pem
  sudo chmod 644 /path/to/cert.pem
  ```
- **Systemd Service:** Runs as unprivileged `smtp` user
- **Docker:** Non-root user recommended (add to `Dockerfile.smtp`):
  ```dockerfile
  USER node
  ```

### Dependency Security

- **Regular Updates:** Keep Node.js and npm dependencies up to date
  ```bash
  npm audit
  npm audit fix
  ```
- **Minimal Dependencies:** The server uses only essential packages:
  - `smtp-server` — SMTP server implementation
  - `mailparser` — Email parsing
- **Pinned Versions:** Lock dependency versions in `package-lock.json`

---

## Deployment Security Checklist

- [ ] Change default `SMTP_AUTH_USERNAME` if using in production
- [ ] Generate and store API keys securely (environment variables, secrets manager)
- [ ] Enable TLS (`manual` mode with valid certs or behind reverse proxy)
- [ ] Set file permissions on certificates (600 for private key)
- [ ] Restrict firewall rules to trusted IPs/networks
- [ ] Configure logging and monitoring
- [ ] Set up certificate renewal automation
- [ ] Run as non-root user (systemd: `User=smtp`, Docker: non-root)
- [ ] Use `NODE_ENV=production`
- [ ] Test authentication and TLS with external tools
- [ ] Document all configuration and access controls

---

## Common Vulnerabilities & Mitigations

### Unauthorized Email Injection
**Risk:** Attackers use valid credentials to send emails impersonating legitimate senders

**Mitigations:**
- Restrict API key usage to specific users/teams in ByteSend dashboard
- Monitor sender addresses and volume anomalies
- Rate-limit submissions at the reverse proxy
- Use dedicated API keys per application/service

### Man-in-the-Middle (MITM) Attacks
**Risk:** Credentials or email content intercepted in transit

**Mitigations:**
- Always use TLS (mode `manual` or reverse proxy)
- Use certificates from trusted CAs (avoid self-signed in production)
- Implement certificate pinning (client-side)
- Restrict network access to trusted networks

### Brute-Force Authentication
**Risk:** Attackers attempt multiple API keys to gain access

**Mitigations:**
- Implement rate limiting at reverse proxy level
- Monitor authentication failure logs
- Use strong, random API keys
- Rotate keys regularly
- Consider IP-based access controls

### Denial of Service (DoS)
**Risk:** Attackers send excessive SMTP connections or large emails

**Mitigations:**
- Set reasonable connection limits at the reverse proxy
- Limit email size (default: 10 MB, configurable in code)
- Monitor network bandwidth
- Use DDoS protection services if behind a public IP
- Implement per-IP rate limiting

---

## Security Contact

If you discover a security vulnerability, please **do not** open a public GitHub issue. Instead:

1. **Email:** [security@nodebyte.co.uk](mailto:security@nodebyte.co.uk)
2. **Include:**
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested mitigation (if any)

**Disclosure Policy:**
- We will acknowledge your report within 24 hours
- We aim to patch critical issues within 7 days
- We will credit you in the release notes (unless you prefer anonymity)
- We request 90 days before public disclosure to allow deployment of patches

---

## Compliance & Certifications

- **AGPL-3.0 License:** Source code must be shared; see [LICENSE](LICENSE)
- **Data Privacy:** The server does not store email data; all emails are forwarded to ByteSend API
- **SMTP Standards:** Implements RFC 5321 (SMTP) and RFC 3207 (STARTTLS)

---

## Additional Resources

- [OWASP SMTP Security](https://owasp.org/www-community/attacks/smtp_injection)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Certbot Renewal Guide](https://certbot.eff.org/docs/using.html#renewal)
- [Nginx SSL Configuration](https://nginx.org/en/docs/http/configuring_https_ssl.html)
- [Systemd Security Best Practices](https://www.freedesktop.org/wiki/Software/systemd/SecurityFeatures/)

---

**Last Updated:** 2026-04-07
