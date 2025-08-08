#!/bin/bash
set -e

APPS=("gateway" "rbac" "user-auth", "upload")

for APP in "${APPS[@]}"; do
  echo "🚀 Building Docker image for $APP..."
  docker build -t "$APP-service" --build-arg APP_NAME="$APP" .
done
