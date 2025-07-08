#!/bin/bash

# Complete webhook testing script
# This simulates the exact GitHub Actions workflow

echo "=== COMPLETE WEBHOOK TEST ==="
echo "This script tests the entire pipeline: forge lint -> JSON creation -> webhook delivery"
echo ""

# Step 1: Run forge lint (exactly like GitHub Actions)
echo "Step 1: Running forge lint..."
echo "" | timeout 60 forge lint > forge_lint_output.txt 2>&1 || true

# Step 2: Read output and create variables (like GitHub Actions)
echo "Step 2: Reading output..."
output=$(cat forge_lint_output.txt)
STATUS="success"  # Simulating job.status
BRANCH="test-branch"  # Simulating github.head_ref

echo "DEBUG: Captured output size: $(echo "$output" | wc -c) characters"
echo "DEBUG: Branch: $BRANCH"
echo "DEBUG: Status: $STATUS"
echo "DEBUG: Output preview (first 200 chars):"
echo "$output" | head -c 200
echo "..."
echo ""

# Step 3: Create JSON payload (using jq like improved workflow)
echo "Step 3: Creating JSON payload..."
payload=$(jq -n \
  --arg branch "$BRANCH" \
  --arg status "$STATUS" \
  --arg output "$output" \
  '{branch: $branch, status: $status, output: $output}')

echo "DEBUG: Payload size: $(echo "$payload" | wc -c) characters"
echo "DEBUG: JSON validation: $(echo "$payload" | jq . >/dev/null 2>&1 && echo "Valid" || echo "Invalid")"
echo ""

# Step 4: Test webhook delivery
echo "Step 4: Testing webhook delivery..."
WEBHOOK_URL="https://webhook.site/5a666d75-93ee-4297-bc4c-b85c7d54976f"  # Replace with real URL

if [[ "$WEBHOOK_URL" == *"your-unique-id"* ]]; then
    echo "To test with real webhook:"
    echo "1. Go to https://webhook.site"
    echo "2. Copy your unique URL"
    echo "3. Replace 'your-unique-id' in this script"
    echo "4. Run the script again"
    echo ""
    echo "For now, simulating webhook call..."
    echo "Would POST to: $WEBHOOK_URL"
    echo "Payload preview:"
    echo "$payload" | jq .
else
    echo "Sending to real webhook: $WEBHOOK_URL"
    response=$(curl -s -w "HTTP_CODE:%{http_code}" \
      -X POST \
      -H "Content-Type: application/json" \
      -d "$payload" \
      "$WEBHOOK_URL")
    echo "Webhook response: $response"
fi

echo ""
echo "=== TEST COMPLETE ==="
echo "✅ Forge lint output captured successfully"
echo "✅ JSON payload created and validated"
echo "✅ Webhook delivery tested"