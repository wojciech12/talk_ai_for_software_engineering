# Failure Mode Recovery Procedures
*Based on 12+ months production experience - copy when Claude starts giving bad advice*

## 🚨 **Context Poisoning Recovery (30% of sessions)**

### **Symptoms Checklist**
- [ ] Claude suggests increasingly complex solutions for simple problems
- [ ] Recommendations contradict established project patterns
- [ ] Code suggestions break existing functionality
- [ ] Security or performance advice seems questionable
- [ ] Session has exceeded 2 hours of continuous work

### **Immediate Recovery Actions**
```bash
# 1. STOP - Don't implement current suggestion
git stash                    # Save current work state

# 2. Assess damage
git diff HEAD~5              # Check last 5 commits for quality
npm run test:full           # Verify system still works

# 3. Clean restart
rm -rf .claude/memory/*
cp .claude/memory-templates/clean_project_context.md .claude/memory/project_context.md

# 4. Restart Claude with narrow focus
# Update project_context.md with SPECIFIC, LIMITED objective
```

### **Context Poisoning Prevention**
- **Session time limit**: 2 hours maximum
- **Objective clarity**: Single, specific goal per session
- **Regular validation**: Test after each major change
- **Scope creep detection**: Reject suggestions outside current focus

---

## 🔒 **Security Hallucination Recovery (10% of security queries)**

### **Symptoms Checklist**
- [ ] Claude suggests disabling security features "for simplicity"
- [ ] Recommendations include hardcoded credentials or keys
- [ ] Suggests overly permissive CORS or CSP policies
- [ ] Proposes storing sensitive data in localStorage/cookies
- [ ] Authentication/authorization advice seems too simple

### **Immediate Response Protocol**
```bash
# 1. NEVER implement security suggestions without validation
npm run security:scan       # Run security audit
scripts/validate-ai-code.sh # AI-specific security checks

# 2. Get human expert review (MANDATORY)
# Tag security team member for review
# Document the suggestion in security incident log

# 3. Research best practices independently
# Check OWASP guidelines, security documentation
# Validate against known security standards
```

### **Security Validation Checklist**
- [ ] No hardcoded secrets or credentials
- [ ] Input validation on all user inputs  
- [ ] Proper authentication/authorization patterns
- [ ] Secure HTTP headers configured correctly
- [ ] Error messages don't leak sensitive information

---

## ⚡ **Performance Regression Recovery (15% of optimization requests)**

### **Symptoms Checklist**
- [ ] "Optimized" code runs slower than before
- [ ] Bundle size increased after "optimization"
- [ ] Memory usage increased significantly
- [ ] API response times degraded
- [ ] Tests take longer to run

### **Performance Recovery Protocol**
```bash
# 1. Benchmark immediately
npm run benchmark           # Run performance tests
npm run build              # Check bundle size

# 2. Compare with baseline
git log --oneline -5       # Check recent performance changes
# Compare current metrics with last known good state

# 3. Revert if degraded
git revert HEAD            # Undo last commit if performance worse
npm run benchmark          # Verify revert restored performance

# 4. Document the issue
# Add to performance regression log
# Update CLAUDE.md with specific performance requirements
```

### **Performance Validation Checklist**
- [ ] Bundle size <1MB compressed
- [ ] API responses <200ms average
- [ ] Memory usage <512MB for backend
- [ ] Test suite completes <30 seconds

---

## 🧪 **Test Suite Corruption Recovery (3% of test refactoring)**

### **Symptoms Checklist**
- [ ] Test coverage dropped unexpectedly
- [ ] Tests pass but don't actually validate functionality
- [ ] Important edge cases removed from tests
- [ ] Tests became flaky or non-deterministic
- [ ] Mocks removed critical validation

### **Test Recovery Protocol**
```bash
# 1. Check coverage immediately
npm run test:coverage      # Verify coverage >80%

# 2. Review test changes
git diff HEAD~3 -- "*.test.js" "*.spec.js"
# Look for removed assertions or test cases

# 3. Validate test quality
npm run test:watch         # Run in watch mode
# Manually verify tests actually catch bugs

# 4. Restore missing tests
git checkout HEAD~X -- path/to/test/file.test.js
# Restore previous version if critical tests were removed
```

---

## 📊 **Failure Mode Tracking**

### **Session Failure Log Template**
```markdown
## Failure Incident: [DATE] [TIME]
**Failure Type**: [Context Poisoning / Security / Performance / Tests]
**Session Duration**: [X hours]  
**Trigger**: [What caused the failure]
**Symptoms**: [How you detected it]
**Recovery Time**: [How long to fix]
**Prevention**: [What to do differently]
**Claude Suggestions Rejected**: [List problematic suggestions]
```

### **Weekly Failure Review**
- **Context poisoning incidents**: [Count this week]
- **Security issues caught**: [Count this week]  
- **Performance regressions**: [Count this week]
- **Test quality issues**: [Count this week]
- **Recovery time average**: [Minutes to detect and fix]

### **Escalation Triggers**
- **>3 context poisoning incidents per week**: Review session management
- **Any security issue reaches production**: Mandatory security training
- **>2 performance regressions per week**: Add more benchmarking
- **Test coverage drops below 75%**: Stop feature work, fix tests

---

## 🔄 **Recovery Success Criteria**

### **Context Poisoning Recovery Success**
- [ ] Fresh Claude session gives reasonable suggestions
- [ ] Recommendations align with project patterns
- [ ] Test suite passes completely
- [ ] No obvious code quality regressions

### **Security Recovery Success**  
- [ ] Security scan passes (no high/critical issues)
- [ ] Code follows established security patterns
- [ ] No sensitive data exposure
- [ ] Authentication/authorization working correctly

### **Performance Recovery Success**
- [ ] All performance benchmarks meet requirements
- [ ] Bundle size within limits
- [ ] API response times acceptable
- [ ] Memory usage stable

---

**Remember**: Failure modes are **normal and expected** with AI tools. The key is rapid detection and systematic recovery procedures.