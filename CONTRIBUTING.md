# 🤝 Contributing

## Workflow

```bash
git checkout develop
git pull origin develop
git checkout -b feature/my-feature
# ... code ...
git add .
git commit -m "feat: description"
git push origin feature/my-feature
# Create PR in GitHub
```

## Commit Format

```
<type>: <description فارسی>

types: feat, fix, docs, style, refactor, test, chore
```

## Pull Request

- حداقل ۱ review نیاز است
- CI باید pass شود
- Conflict با develop نباید داشته باشد
- PR template را پر کنید

## Setup محلی

```bash
pnpm install
cp services/api/.env.example services/api/.env
docker compose up -d
cd services/api && pnpm prisma migrate deploy && cd ../..
pnpm dev
```

## Testing

```bash
pnpm test
pnpm type-check
pnpm lint
```

## منابع

- [BRANCHING.md](./BRANCHING.md)
- [team/](./team/)
