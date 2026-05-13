# Ivan Vazquez — Personal Website

Sitio estático en S3 + CloudFront, desplegado automáticamente desde GitHub Actions vía OIDC.

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                      GitHub (iivann404/website)             │
│  push to main ──► GitHub Actions                           │
│                        │                                   │
│               OIDC (no secrets estáticos)                  │
│                        │                                   │
└────────────────────────┼────────────────────────────────────┘
                         │ sts:AssumeRoleWithWebIdentity
                         ▼
              ┌─────────────────────┐
              │  IAM Role           │
              │  GitHubActions      │
              │  DeployStaticSite   │
              └────────┬────────────┘
                       │ s3:PutObject / s3:DeleteObject
                       │ cloudfront:CreateInvalidation
                       ▼
┌──────────────────────────────────────────────────────────────┐
│  AWS us-east-2 (account)                        │
│                                                              │
│  ┌───────────────┐   OAC sigv4     ┌────────────────────┐   │
│  │  CloudFront   │ ◄────────────── │   S3  aivanvqz     │   │
│  │  EBEQVFSJRRLE │                 │   (private bucket) │   │
│  │               │                 │   versioning ON    │   │
│  │  Geo whitelist│                 │   SSE-S3           │   │
│  │  PY/MX/US/CA  │                 │   PAB: 4/4 ON      │   │
│  └───────┬───────┘                 └────────────────────┘   │
│          │                                                   │
└──────────┼───────────────────────────────────────────────────┘
           │ HTTPS (redirect-to-https)
           ▼
    d1ygos5z2jfuhy.cloudfront.net
```

## Desplegar

`git push`:

git add <archivos-modificados>
git commit -m "descripción del cambio"
git push origin main


El workflow se activa automáticamente cuando hay cambios en:
`index.html`, `style.css`, `script.js`, `animatedClock/`, `es/`, `assets/`

Resultado en: **https://d1ygos5z2jfuhy.cloudfront.net**

## Modificar la infraestructura

```bash
cd infra

# Edita el .tf correspondiente, luego revisa SIEMPRE antes de aplicar
terraform plan
terraform apply
```

| Archivo | Qué gestiona |
|---|---|
| `s3.tf` | Bucket, versionado, cifrado, PAB, ownership, policy, website config |
| `cloudfront.tf` | OAC + distribución (geo restriction, cache policy, certificado) |
| `iam_oidc.tf` | OIDC provider de GitHub |
| `iam_role.tf` | Rol y policy de GitHub Actions |


### State de Terraform
El state está en S3 con versionado

