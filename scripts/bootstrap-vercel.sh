#!/usr/bin/env bash
# One-time bootstrap: create/link Vercel project and print GitHub secret values.
# Usage: VERCEL_TOKEN=xxx ./scripts/bootstrap-vercel.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -z "${VERCEL_TOKEN:-}" ]]; then
  echo "Set VERCEL_TOKEN first (https://vercel.com/account/tokens)"
  exit 1
fi

echo "→ Linking Vercel project procoders-market-prototype …"
npx vercel@latest link --yes --project procoders-market-prototype --token="$VERCEL_TOKEN"

echo "→ Initial production deploy …"
npx vercel@latest deploy --prod --yes --token="$VERCEL_TOKEN"

if [[ ! -f .vercel/project.json ]]; then
  echo "Missing .vercel/project.json after link"
  exit 1
fi

ORG_ID="$(python3 -c "import json; print(json.load(open('.vercel/project.json'))['orgId'])")"
PROJECT_ID="$(python3 -c "import json; print(json.load(open('.vercel/project.json'))['projectId'])")"

cat <<EOF

Bootstrap complete. Add these GitHub repository secrets:

  gh secret set VERCEL_TOKEN       --repo khymerao/procoders-market-prototype
  gh secret set VERCEL_ORG_ID      --repo khymerao/procoders-market-prototype
  gh secret set VERCEL_PROJECT_ID  --repo khymerao/procoders-market-prototype

Values:
  VERCEL_ORG_ID=$ORG_ID
  VERCEL_PROJECT_ID=$PROJECT_ID

Then push to main — .github/workflows/vercel-deploy.yml will redeploy on every push.
EOF
