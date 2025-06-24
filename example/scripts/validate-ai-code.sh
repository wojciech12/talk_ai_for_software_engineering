#!/bin/bash
# AI Code Validation Script
# Based on README.claude.md production failure modes
# Validates AI-generated code for common issues

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Validation results
VALIDATION_PASSED=0
VALIDATION_FAILED=0
VALIDATION_WARNINGS=0

echo -e "${BLUE}🤖 AI Code Validation Suite${NC}"
echo "====================================="
echo "Checking for common AI code generation issues..."
echo ""

# Helper functions
log_pass() {
    echo -e "${GREEN}✅ $1${NC}"
    ((VALIDATION_PASSED++))
}

log_fail() {
    echo -e "${RED}❌ $1${NC}"
    ((VALIDATION_FAILED++))
}

log_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((VALIDATION_WARNINGS++))
}

# 1. CHECK FOR SECURITY ANTI-PATTERNS
echo "1. Security Anti-Pattern Detection:"

# Check for hardcoded secrets/keys
if grep -r --include="*.js" --include="*.jsx" --include="*.json" -E "(password|secret|key|token)\s*[:=]\s*[\"'][a-zA-Z0-9+/=]{8,}[\"']" src/ backend/ 2>/dev/null; then
    log_fail "Hardcoded secrets detected in code"
else
    log_pass "No hardcoded secrets found"
fi

# Check for console.log with sensitive data patterns
if grep -r --include="*.js" --include="*.jsx" -E "console\.(log|info|debug).*[\"'](password|secret|key|token|auth)[\"']" src/ backend/ 2>/dev/null; then
    log_fail "Console logging of sensitive data detected"
else
    log_pass "No sensitive data logging detected"
fi

# Check for eval() usage (security risk)
if grep -r --include="*.js" --include="*.jsx" "eval(" src/ backend/ 2>/dev/null; then
    log_fail "Dangerous eval() usage detected"
else
    log_pass "No eval() usage found"
fi

echo ""

# 2. CHECK FOR PERFORMANCE ANTI-PATTERNS
echo "2. Performance Anti-Pattern Detection:"

# Check for synchronous file operations in backend
if grep -r --include="*.js" -E "fs\.(readFileSync|writeFileSync|existsSync)" backend/ 2>/dev/null; then
    log_warn "Synchronous file operations detected in backend - consider async alternatives"
else
    log_pass "No problematic synchronous operations found"
fi

# Check for missing React.memo or useMemo in components with props
COMPONENT_FILES=$(find src/components -name "*.jsx" 2>/dev/null || true)
for file in $COMPONENT_FILES; do
    if [ -f "$file" ]; then
        # Check if component has props but no memoization
        if grep -q "props" "$file" && ! grep -qE "(React\.memo|useMemo|useCallback)" "$file"; then
            log_warn "Component $(basename "$file") uses props but lacks memoization - potential re-render issues"
        fi
    fi
done

# Check for large bundle indicators
if find src/ -name "*.js" -o -name "*.jsx" | xargs wc -l 2>/dev/null | tail -1 | awk '{if($1 > 5000) print $1}' | grep -q .; then
    TOTAL_LINES=$(find src/ -name "*.js" -o -name "*.jsx" | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}')
    log_warn "Large codebase detected ($TOTAL_LINES lines) - monitor bundle size"
fi

echo ""

# 3. CHECK FOR CODE QUALITY ISSUES
echo "3. Code Quality Issues:"

# Check for missing PropTypes in React components
for file in $(find src/components -name "*.jsx" 2>/dev/null || true); do
    if [ -f "$file" ]; then
        COMPONENT_NAME=$(basename "$file" .jsx)
        if grep -q "const $COMPONENT_NAME" "$file" && ! grep -q "PropTypes" "$file"; then
            log_warn "Component $COMPONENT_NAME missing PropTypes validation"
        fi
    fi
done

# Check for missing error boundaries
if ! find src/ -name "*.jsx" -exec grep -l "componentDidCatch\|ErrorBoundary" {} \; 2>/dev/null | grep -q .; then
    log_warn "No error boundaries detected - consider adding for better error handling"
else
    log_pass "Error boundary implementation found"
fi

# Check for TODO/FIXME comments (often left by AI)
TODO_COUNT=$(grep -r --include="*.js" --include="*.jsx" -c "TODO\|FIXME" src/ backend/ 2>/dev/null | grep -v ":0" | wc -l || echo "0")
if [ "$TODO_COUNT" -gt 5 ]; then
    log_warn "High number of TODO/FIXME comments ($TODO_COUNT files) - review implementation completeness"
fi

echo ""

# 4. CHECK FOR TESTING ISSUES
echo "4. Testing Completeness:"

# Check for test files without proper assertions
for testfile in $(find src/ tests/ -name "*.test.js" 2>/dev/null || true); do
    if [ -f "$testfile" ]; then
        if ! grep -qE "(expect|assert)" "$testfile"; then
            log_fail "Test file $(basename "$testfile") missing assertions"
        fi
    fi
done

# Check for skipped tests
SKIPPED_TESTS=$(grep -r --include="*.test.js" -c "it\.skip\|describe\.skip\|test\.skip" src/ tests/ 2>/dev/null | grep -v ":0" | wc -l || echo "0")
if [ "$SKIPPED_TESTS" -gt 0 ]; then
    log_warn "Skipped tests detected ($SKIPPED_TESTS files) - ensure tests are complete"
fi

echo ""

# 5. CHECK FOR AI-SPECIFIC ISSUES
echo "5. AI-Specific Code Issues:"

# Check for overly complex functions (AI tends to create monolithic functions)
COMPLEX_FUNCTIONS=$(grep -r --include="*.js" --include="*.jsx" -A 50 "function\|const.*=>" src/ backend/ | grep -c "if\|for\|while" | awk '{if($1 > 100) print "many"}' || echo "normal")
if [ "$COMPLEX_FUNCTIONS" = "many" ]; then
    log_warn "High complexity detected - consider breaking down large functions"
fi

# Check for missing input validation on API endpoints
API_FILES=$(find backend/routes -name "*.js" 2>/dev/null || true)
for file in $API_FILES; do
    if [ -f "$file" ]; then
        if grep -q "req\.body" "$file" && ! grep -qE "(validate|check|sanitiz)" "$file"; then
            log_warn "API endpoint in $(basename "$file") may lack input validation"
        fi
    fi
done

# Check for inconsistent error handling patterns
ERROR_PATTERNS=$(grep -r --include="*.js" --include="*.jsx" -E "(try|catch|throw)" src/ backend/ 2>/dev/null | wc -l || echo "0")
CONSISTENT_PATTERNS=$(grep -r --include="*.js" --include="*.jsx" -E "catch\s*\(.*\)\s*{\s*res\.status\([0-9]+\)\.json" backend/ 2>/dev/null | wc -l || echo "0")
if [ "$ERROR_PATTERNS" -gt 10 ] && [ "$CONSISTENT_PATTERNS" -lt 3 ]; then
    log_warn "Inconsistent error handling patterns detected"
fi

echo ""

# 6. FINAL ASSESSMENT AND RECOMMENDATIONS
echo "6. Final Assessment:"

# Calculate total issues
TOTAL_ISSUES=$((VALIDATION_FAILED + VALIDATION_WARNINGS))

if [ "$VALIDATION_FAILED" -eq 0 ] && [ "$VALIDATION_WARNINGS" -eq 0 ]; then
    echo -e "${GREEN}✅ All AI code validation checks passed!${NC}"
elif [ "$VALIDATION_FAILED" -eq 0 ] && [ "$VALIDATION_WARNINGS" -lt 5 ]; then
    echo -e "${YELLOW}⚠️  Validation passed with minor warnings${NC}"
else
    echo -e "${RED}❌ Validation found significant issues requiring attention${NC}"
fi

echo ""
echo "Summary:"
echo -e "  ${GREEN}Passed: $VALIDATION_PASSED${NC}"
echo -e "  ${RED}Failed: $VALIDATION_FAILED${NC}"  
echo -e "  ${YELLOW}Warnings: $VALIDATION_WARNINGS${NC}"

echo ""
echo "Recommendations:"
if [ "$VALIDATION_FAILED" -gt 0 ]; then
    echo "  • Address all failed checks before committing"
fi
if [ "$VALIDATION_WARNINGS" -gt 3 ]; then
    echo "  • Review warnings and fix high-impact issues"
fi
echo "  • Run 'npm run test:full' to ensure functionality"
echo "  • Consider code review by a senior developer"
echo "  • Update .claude/memory/ with any new patterns learned"

echo ""
echo -e "${BLUE}Validation complete. See README.claude.md for failure mode details.${NC}"

# Exit with appropriate code
if [ "$VALIDATION_FAILED" -gt 0 ]; then
    exit 1
else
    exit 0
fi