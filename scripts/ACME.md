# ACME.sh Example Usage

This document provides examples for using the `acme.sh` script for automated certificate management.

## Installation

First, ensure you have downloaded and made the `acme.sh` script executable in your desired location (e.g., `./scripts/.acme.sh`).

```bash
# Download the script (if not already done)
curl https://raw.githubusercontent.com/Neilpang/acme.sh/master/acme.sh --create-dirs -o ./scripts/.acme.sh
chmod +x ./scripts/.acme.sh

# Install the cron job to automate renewals
./scripts/.acme.sh --install-cronjob
```

## Issuing a Certificate

To issue a certificate for a domain, you typically use the `--issue` command. You'll need to specify the domain (`-d`) and often the webroot directory (`--webroot`) or use DNS validation (`--dns`).

**Example using webroot validation:**

```bash
./scripts/.acme.sh --issue -d yourdomain.com --webroot /var/www/yourdomain.com/public_html
```

Replace `yourdomain.com` with your actual domain and `/var/www/yourdomain.com/public_html` with the correct path to your website's root directory.

**Example using DNS validation (e.g., with Cloudflare):**

This method requires configuring DNS records manually or via an API. `acme.sh` supports various DNS providers.

```bash
# Example for Cloudflare (requires setting CF_Key and CF_Email environment variables)
./scripts/.acme.sh --issue -d yourdomain.com --dns dns_cloudflare
```

Refer to the `acme.sh` documentation for specific DNS provider configurations.

## Renewing Certificates

The `--cron` command is used to check for and renew any certificates that are nearing expiration. This is typically run via a cron job.

**Manual Renewal Check:**

```bash
./scripts/.acme.sh --cron --home /path/to/.acme.sh.home
```

*   The `--home` parameter should point to the directory where `acme.sh` stores its configuration and certificates.
*   If you used `--install-cronjob`, this is usually handled automatically.

## Important Considerations

*   **`--home` Directory**: Ensure the `--home` directory specified in your cron job (or when running manually) is correct. This is where `acme.sh` stores your certificates and configuration.
*   **Webroot**: For webroot validation, the specified webroot directory must be accessible by the `acme.sh` script and be the actual document root for the domain you are issuing a certificate for.
*   **DNS Validation**: If using DNS validation, ensure your DNS provider is correctly configured in your environment variables or via `acme.sh` parameters.
*   **Permissions**: The `acme.sh` script needs read/write permissions for its home directory and potentially for the webroot directory during validation.
*   **System Time**: Ensure your system clock is accurate, as certificate issuance relies on correct time.

For more advanced options and specific integrations, please refer to the official `acme.sh` GitHub repository and documentation.
