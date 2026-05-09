# Release Playbook

Last reviewed: 2026-05-09

## Goal

Provide a repeatable release process for ByteSend tags and release notes.

## Branch and Tag Context

- Active development branch: develop
- Default branch: main
- Release tags: vX.Y.Z

## Pre-Release Checklist

1. Ensure working tree is clean.
2. Ensure develop is pushed and up to date.
3. Confirm commits since latest tag:
   - git log --oneline <latest-tag>..HEAD
4. Verify changelog has:
   - New version section with date
   - Accurate Added/Changed/Fixed entries
   - Updated compare links at bottom
5. Run critical validation:
   - pnpm build
   - Targeted tests for changed areas

## Changelog Link Rules

At minimum keep these links correct:

- [Unreleased] should compare from latest released tag to HEAD
- [current release] should compare previous tag to current tag

Example after releasing v0.2.5:

- [Unreleased]: compare/v0.2.5...HEAD
- [0.2.5]: compare/v0.2.4...v0.2.5

## Tag and Publish Steps

1. Commit release prep changes:
   - git add CHANGELOG.md
   - git commit -m "chore(release): prepare vX.Y.Z"
2. Create annotated tag:
   - git tag -a vX.Y.Z -m "vX.Y.Z"
3. Push branch and tag:
   - git push origin develop
   - git push origin vX.Y.Z
4. Create GitHub release:
   - gh release create vX.Y.Z --title "vX.Y.Z" --generate-notes

## Suggested Versioning Heuristics

- Patch (X.Y.Z+1): fixes, docs, CI/workflow changes, compatibility improvements
- Minor (X.Y+1.0): notable user-facing features, new APIs, expanded capability
- Major (X+1.0.0): intentional breaking changes

## Post-Release Checks

1. Confirm tag exists on remote.
2. Confirm GitHub release created with expected notes.
3. Verify changelog compare links render correctly.
4. Announce release in docs/channels if applicable.
