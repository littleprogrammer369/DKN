# 🌿 Branching Strategy — Git Flow

## Branches

- `main` — Production (protected)
- `develop` — Integration
- `feature/*` — New features
- `fix/*` — Bug fixes
- `hotfix/*` — Emergency fixes

## Naming

```
feature/<category>-<name>-<author>
fix/<description>-<author>
hotfix/<description>
```

مثال:
- `feature/auth-otp-reza`
- `fix/login-validation-ali`

## Workflow

```
1. feature/* → PR to develop → review → merge
2. fix/* → PR to develop → review → merge
3. hotfix/* → PR to main AND develop
```

## Commit Format

```
feat(scope): description
fix(scope): description
docs: description
```

## Daily

```bash
git checkout develop
git pull origin develop
```

## Before PR

```bash
git fetch origin
git rebase origin/develop
git push --force-with-lease
```

## DoD (Definition of Done)

- [ ] Code complete
- [ ] Tests written
- [ ] type-check passes
- [ ] lint passes
- [ ] Manual tested
- [ ] Docs updated
- [ ] Reviewer approved
- [ ] CI passes
