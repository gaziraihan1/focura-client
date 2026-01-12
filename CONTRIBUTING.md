# 🤝 Contributing to Focura

Thank you for your interest in contributing to **Focura**.  
Focura is a focused, workspace-based productivity SaaS, and contributions are welcome as long as they align with the project's goals, architecture, and quality standards.

---

## 📌 Before You Contribute

Please make sure you:

- Have read the `README.md`
- Understand the overall architecture (`ARCHITECTURE.md`)
- Follow the coding and design principles used in the project
- Respect the Code of Conduct

---

## 🧭 What You Can Contribute

You may contribute in the following areas:

### ✅ Code Contributions
- Bug fixes
- Performance improvements
- UI/UX refinements
- Accessibility improvements
- Refactoring (without breaking behavior)
- New features aligned with Focura's vision

### 📝 Documentation
- Improve existing documentation
- Fix typos or unclear explanations
- Add usage examples

### 🧪 Testing
- Add test cases
- Improve edge-case coverage

---

## 🚫 What Not to Contribute

Please avoid:

- Large architectural changes without discussion
- Breaking existing APIs
- Adding heavy dependencies without justification
- Features unrelated to productivity, focus, or workspace collaboration

---

## 🛠 Development Setup

1. Fork the repository
2. Clone your fork
```bash
   git clone https://github.com/your-username/focura.git
```
3. Install dependencies
```bash
   npm install
```
4. Set up environment variables
```bash
   cp .env.example .env
```
5. Run the project
```bash
   npm run dev
```

---

## 🌱 Branching Strategy

- `main` → stable, production-ready
- `dev` → active development
- Feature branches:
```
  feature/your-feature-name
  fix/bug-description
  refactor/area-name
```

Always branch from `dev`.

---

## ✅ Commit Guidelines

Use clear, meaningful commit messages:
```
feat: add focus mode filter to tasks
fix: resolve task stats scope issue
refactor: clean up task service logic
docs: update architecture overview
```

---

## 🔍 Code Standards

### Frontend
- TypeScript is mandatory
- No `any` unless absolutely necessary
- Use existing Tailwind tokens
- Follow existing component patterns
- Keep components focused and reusable

### Backend
- Keep controllers thin
- Business logic belongs in services
- Prisma queries must be workspace-safe
- Validate inputs strictly
- Never trust client-side data

---

## 🔐 Security Rules

- Never expose secrets
- Do not log tokens or sensitive data
- Respect workspace and user isolation
- Follow existing authentication and authorization patterns

---

## 🧪 Testing Your Changes

Before submitting a PR:

- Ensure the app runs without errors
- Verify affected features manually
- Confirm no existing functionality breaks

---

## 🔁 Pull Request Process

1. Push your branch to your fork
2. Open a Pull Request against `dev`
3. Clearly describe:
   - What you changed
   - Why you changed it
   - Screenshots (if UI-related)
4. Be open to feedback and revisions

---

## 📋 Pull Request Checklist

- [ ] Code follows project standards
- [ ] No unnecessary dependencies added
- [ ] No breaking changes
- [ ] Documentation updated if needed
- [ ] Tested locally

---

## 🧠 Project Philosophy

Focura values:

- Focus over feature bloat
- Simplicity over complexity
- Quality over quantity
- Intentional productivity

All contributions should align with this mindset.

---

## 👤 Maintainer

All contributions are reviewed by:

**Mohammad Raihan Gazi**  
Creator & Maintainer of Focura

---

Thank you for contributing 🚀
