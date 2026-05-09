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
│  AWS us-east-2 (account 857145323507)                        │
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

Solo necesitas hacer `git push`:

```bash
git add <archivos-modificados>
git commit -m "descripción del cambio"
git push origin main
```

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

## Rollback y recuperación

### Sitio muestra contenido antiguo
```bash
aws cloudfront create-invalidation \
  --distribution-id EBEQVFSJRRLE \
  --paths "/*"
```

### Restaurar un archivo a versión anterior (versionado S3 activo)
```bash
# Lista versiones
aws s3api list-object-versions --bucket aivanvqz --prefix index.html

# Restaura (reemplaza <VERSION_ID>)
aws s3api copy-object \
  --bucket aivanvqz \
  --copy-source "aivanvqz/index.html?versionId=<VERSION_ID>" \
  --key index.html
```

### El rol de GitHub Actions desapareció
```bash
cd infra && terraform apply
```

### Perdí el state de Terraform
```bash
# El state está en S3 con versionado
aws s3api list-object-versions \
  --bucket tfstate-857145323507-us-east-2 \
  --prefix static-site/terraform.tfstate
```

## Requisitos para trabajar localmente

- AWS CLI configurado (`us-east-2`, usuario `macbook-ivan`)
- Terraform >= 1.5
