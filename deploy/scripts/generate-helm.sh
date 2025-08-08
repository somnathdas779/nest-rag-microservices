#!/bin/bash
set -e

# List of services
SERVICES=("gateway" "user-auth" "upload" "rbac")

# Docker image registry
IMAGE_REGISTRY="snath1985"

# Helm chart base folder
HELM_DIR="./deploy/helm"

# Create Helm chart for each service
for SERVICE in "${SERVICES[@]}"; do
    echo "🚀 Generating Helm chart for $SERVICE..."

    CHART_PATH="$HELM_DIR/$SERVICE"

    # If chart does not exist, create it
    if [ ! -d "$CHART_PATH" ]; then
        helm create "$CHART_PATH"
    fi

    # Update values.yaml
    sed -i "s|repository: .*|repository: $IMAGE_REGISTRY/$SERVICE-service|g" "$CHART_PATH/values.yaml"
    sed -i "s|tag: .*|tag: latest|g" "$CHART_PATH/values.yaml"

    # Update Chart.yaml
    sed -i "s|name: .*|name: $SERVICE|g" "$CHART_PATH/Chart.yaml"
    sed -i "s|version: .*|version: 0.1.0|g" "$CHART_PATH/Chart.yaml"
    sed -i "s|appVersion: .*|appVersion: \"1.0.0\"|g" "$CHART_PATH/Chart.yaml"

    # Optional: Set correct container port in values.yaml
    PORT=4000
    if [ "$SERVICE" == "gateway" ]; then
        PORT=4001
    elif [ "$SERVICE" == "user-auth" ]; then
        PORT=4002
    elif [ "$SERVICE" == "upload" ]; then
        PORT=4003
    fi
    sed -i "s|containerPort: .*|containerPort: $PORT|g" "$CHART_PATH/values.yaml"

    echo "✅ Helm chart for $SERVICE ready at $CHART_PATH"
done
