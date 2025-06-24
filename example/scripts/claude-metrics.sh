#!/bin/bash
# Claude Code Metrics Tracking
# Based on README.claude.md production metrics requirements

set -e

METRICS_DIR=".claude/metrics"
TODAY=$(date +%Y-%m-%d)
MONTH=$(date +%Y-%m)

# Create metrics directory if it doesn't exist
mkdir -p "$METRICS_DIR"

echo "📊 Claude Code Metrics Report - $TODAY"
echo "=================================================="

# Function to log metrics
log_metric() {
    local metric_name="$1"
    local value="$2"
    local date="$3"
    echo "$date,$metric_name,$value" >> "$METRICS_DIR/metrics.csv"
}

# Initialize CSV if it doesn't exist
if [ ! -f "$METRICS_DIR/metrics.csv" ]; then
    echo "date,metric,value" > "$METRICS_DIR/metrics.csv"
fi

# 1. DEVELOPMENT VELOCITY METRICS
echo "📈 Development Velocity:"

# Commits this month
COMMITS_THIS_MONTH=$(git log --since="$MONTH-01" --oneline | wc -l | tr -d ' ')
echo "  Commits this month: $COMMITS_THIS_MONTH"
log_metric "commits_monthly" "$COMMITS_THIS_MONTH" "$TODAY"

# Lines of code added/modified this month  
LOC_STATS=$(git log --since="$MONTH-01" --numstat --pretty=format:"" | awk '{added+=$1; deleted+=$2} END {print added " " deleted}')
LOC_ADDED=$(echo $LOC_STATS | cut -d' ' -f1)
LOC_DELETED=$(echo $LOC_STATS | cut -d' ' -f2)
echo "  Lines added this month: ${LOC_ADDED:-0}"
echo "  Lines deleted this month: ${LOC_DELETED:-0}"
log_metric "loc_added_monthly" "${LOC_ADDED:-0}" "$TODAY"
log_metric "loc_deleted_monthly" "${LOC_DELETED:-0}" "$TODAY"

# 2. CODE QUALITY METRICS
echo ""
echo "🎯 Code Quality:"

# Test coverage
if npm run test:coverage --silent > /tmp/coverage_output 2>&1; then
    COVERAGE=$(grep "All files" /tmp/coverage_output | awk '{print $10}' | tr -d '%' || echo "0")
    echo "  Test coverage: ${COVERAGE}%"
    log_metric "test_coverage" "$COVERAGE" "$TODAY"
else
    echo "  Test coverage: Unable to determine"
    log_metric "test_coverage" "0" "$TODAY"
fi

# Linting errors
LINT_ERRORS=$(npm run lint 2>&1 | grep -c "error" || echo "0")
echo "  Linting errors: $LINT_ERRORS"
log_metric "lint_errors" "$LINT_ERRORS" "$TODAY"

# 3. AI-SPECIFIC METRICS  
echo ""
echo "🤖 AI Usage Metrics:"

# Claude session frequency (approximation from bash history)
CLAUDE_SESSIONS=$(grep -c "claude" ~/.bash_history 2>/dev/null || echo "0")
echo "  Estimated Claude sessions: $CLAUDE_SESSIONS"
log_metric "claude_sessions" "$CLAUDE_SESSIONS" "$TODAY"

# AI validation failures (if script exists)
if [ -f "scripts/validate-ai-code.sh" ]; then
    AI_VALIDATION_LOG="/tmp/ai_validation_log"
    if scripts/validate-ai-code.sh > "$AI_VALIDATION_LOG" 2>&1; then
        AI_ISSUES=$(grep -c "⚠️\|❌" "$AI_VALIDATION_LOG" || echo "0")
    else
        AI_ISSUES="1"  # Script failed = at least 1 issue
    fi
    echo "  AI code validation issues: $AI_ISSUES"
    log_metric "ai_validation_issues" "$AI_ISSUES" "$TODAY"
fi

# Memory refresh frequency
MEMORY_REFRESHES=$(find .claude/memory -name "*.md" -newer .claude/memory-templates/clean_project_context.md 2>/dev/null | wc -l | tr -d ' ' || echo "0")
echo "  Memory files refreshed recently: $MEMORY_REFRESHES"
log_metric "memory_refreshes" "$MEMORY_REFRESHES" "$TODAY"

# 4. SECURITY METRICS
echo ""
echo "🔒 Security Metrics:"

# Security scan results
if npm run security:scan > /tmp/security_output 2>&1; then
    SECURITY_ISSUES=$(grep -c "vulnerabilities" /tmp/security_output || echo "0")
    echo "  Security vulnerabilities: $SECURITY_ISSUES"
    log_metric "security_vulnerabilities" "$SECURITY_ISSUES" "$TODAY"
else
    echo "  Security scan: Failed to run"
    log_metric "security_scan_status" "failed" "$TODAY"
fi

# Git secrets violations (if configured)
if command -v git-secrets >/dev/null 2>&1; then
    if git secrets --scan > /tmp/secrets_output 2>&1; then
        echo "  Secret detection: Clean"
        log_metric "secrets_detected" "0" "$TODAY"
    else
        SECRETS_FOUND=$(wc -l < /tmp/secrets_output)
        echo "  Secrets detected: $SECRETS_FOUND"
        log_metric "secrets_detected" "$SECRETS_FOUND" "$TODAY"
    fi
fi

# 5. PERFORMANCE METRICS
echo ""
echo "⚡ Performance Metrics:"

# Bundle size (if build exists)
if [ -d "build" ]; then
    BUNDLE_SIZE=$(find build -name "*.js" -exec wc -c {} + | tail -1 | awk '{print $1}')
    BUNDLE_SIZE_MB=$((BUNDLE_SIZE / 1024 / 1024))
    echo "  Bundle size: ${BUNDLE_SIZE_MB}MB"
    log_metric "bundle_size_mb" "$BUNDLE_SIZE_MB" "$TODAY"
fi

# Test execution time
TEST_START_TIME=$(date +%s)
npm run test --silent > /dev/null 2>&1
TEST_END_TIME=$(date +%s)
TEST_DURATION=$((TEST_END_TIME - TEST_START_TIME))
echo "  Test suite execution: ${TEST_DURATION}s"
log_metric "test_duration_seconds" "$TEST_DURATION" "$TODAY"

# 6. FAILURE MODE TRACKING
echo ""
echo "🚨 Failure Mode Analysis:"

# Check for failure recovery indicators
RECENT_REVERTS=$(git log --since="7 days ago" --oneline | grep -c "revert\|rollback" || echo "0")
echo "  Recent reverts/rollbacks: $RECENT_REVERTS"
log_metric "reverts_weekly" "$RECENT_REVERTS" "$TODAY"

# Context refresh frequency (indicator of context poisoning)
CONTEXT_REFRESHES=$(find .claude/memory -name "project_context.md" -mtime -7 | wc -l | tr -d ' ')
echo "  Context refreshes (7 days): $CONTEXT_REFRESHES"
log_metric "context_refreshes_weekly" "$CONTEXT_REFRESHES" "$TODAY"

# 7. COST TRACKING
echo ""
echo "💰 Cost Analysis:"

# Estimated Claude Code cost (based on usage)
MONTHLY_COST=20  # $20/month per developer
ESTIMATED_SESSIONS_THIS_MONTH=$((CLAUDE_SESSIONS / 30 * $(date +%d)))
echo "  Monthly Claude Code cost: \$${MONTHLY_COST}"
echo "  Estimated sessions this month: $ESTIMATED_SESSIONS_THIS_MONTH"
log_metric "monthly_cost_usd" "$MONTHLY_COST" "$TODAY"
log_metric "estimated_monthly_sessions" "$ESTIMATED_SESSIONS_THIS_MONTH" "$TODAY"

# ROI calculation (simplified)
if [ "$COMMITS_THIS_MONTH" -gt 0 ]; then
    PRODUCTIVITY_RATIO=$((COMMITS_THIS_MONTH * 100 / 20))  # Baseline of 20 commits/month
    echo "  Productivity vs baseline: ${PRODUCTIVITY_RATIO}%"
    log_metric "productivity_ratio" "$PRODUCTIVITY_RATIO" "$TODAY"
fi

# 8. GENERATE TREND REPORT
echo ""
echo "📈 Trend Analysis (Last 7 days):"

if [ -f "$METRICS_DIR/metrics.csv" ]; then
    # Show trends for key metrics
    echo "  Recent test coverage trend:"
    grep "test_coverage" "$METRICS_DIR/metrics.csv" | tail -7 | while IFS=, read date metric value; do
        echo "    $date: ${value}%"
    done

    echo "  Recent security issues trend:"
    grep "security_vulnerabilities" "$METRICS_DIR/metrics.csv" | tail -7 | while IFS=, read date metric value; do
        echo "    $date: $value issues"
    done
fi

# 9. ALERTS AND THRESHOLDS
echo ""
echo "🚨 Alert Status:"

# Test coverage alert
if [ "$COVERAGE" -lt 80 ] 2>/dev/null; then
    echo "  ❌ ALERT: Test coverage below 80% threshold"
fi

# Security alert
if [ "$SECURITY_ISSUES" -gt 0 ] 2>/dev/null; then
    echo "  ❌ ALERT: Security vulnerabilities detected"
fi

# Performance alert
if [ "$TEST_DURATION" -gt 30 ] 2>/dev/null; then
    echo "  ❌ ALERT: Test suite taking longer than 30 seconds"
fi

# Bundle size alert
if [ "$BUNDLE_SIZE_MB" -gt 1 ] 2>/dev/null; then
    echo "  ❌ ALERT: Bundle size exceeds 1MB limit"
fi

echo ""
echo "📊 Full metrics logged to: $METRICS_DIR/metrics.csv"
echo "🔄 Run this script daily to track trends and ROI"

# Cleanup temporary files
rm -f /tmp/coverage_output /tmp/security_output /tmp/secrets_output /tmp/ai_validation_log