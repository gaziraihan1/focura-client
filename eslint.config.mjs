import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  // Source code: explicit `any` is a hard error - typed boundaries keep
  // refactors safe. Fix with real types, `unknown`, or a documented cast.
  {
    files: [
      "app/**/*.ts",
      "app/**/*.tsx",
      "components/**/*.ts",
      "components/**/*.tsx",
      "hooks/**/*.ts",
      "hooks/**/*.tsx",
      "lib/**/*.ts",
      "context/**/*.ts",
      "context/**/*.tsx",
      "utils/**/*.ts",
      "types/**/*.ts",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  // Tests intentionally use loose mocks - stay permissive there.
  {
    files: ["tests/**/*.ts", "tests/**/*.tsx", "**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  // ── Data-access boundary ─────────────────────────────────────────────────────
  // All HTTP traffic must go through the shared client ("@/lib/axios" → api.*)
  // so auth headers, CSRF, token refresh, retry and error handling apply
  // everywhere. Raw axios is only allowed inside lib/axios itself.
  {
    files: [
      "app/**/*.ts",
      "app/**/*.tsx",
      "components/**/*.ts",
      "components/**/*.tsx",
      "hooks/**/*.ts",
      "context/**/*.ts",
      "context/**/*.tsx",
      "utils/**/*.ts",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              // Anchored so "@/lib/axios" is NOT restricted - only the raw package.
              regex: "^(axios|axios/.+)$",
              message:
                "Import the shared API client from '@/lib/axios' instead of raw axios, so auth/CSRF/refresh/error handling applies.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["lib/**/*.ts"],
    ignores: ["lib/axios/**", "lib/axios.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: "^(axios|axios/.+)$",
              message:
                "Only lib/axios may import raw axios. Import the wrapper from '@/lib/axios' instead.",
            },
          ],
        },
      ],
    },
  },
  // Components must never call fetch() directly - data access lives in
  // hooks/ (react-query) or lib/ (serverApi / sanctioned public fetches).
  {
    files: ["components/**/*.ts", "components/**/*.tsx"],
    rules: {
      "no-restricted-globals": [
        "error",
        {
          name: "fetch",
          message:
            "Move data fetching into a hook using the shared api client from '@/lib/axios', or serverApi for RSC.",
        },
      ],
    },
  },
  {
    // Sanctioned raw-fetch hooks: Next.js data-cache ISR fetches
    // (usePublicResource) and calls to this app's own /api/auth/* routes,
    // which need no bearer token or CSRF handling.
    files: ["hooks/**/*.ts"],
    ignores: [
      "hooks/usePublicResource.ts",
      "hooks/useAuthForm.ts",
      "hooks/useForgetPasswordPage.ts",
      "hooks/useResetPasswordPage.ts",
      "hooks/useVerifyEmail.ts",
    ],
    rules: {
      "no-restricted-globals": [
        "error",
        {
          name: "fetch",
          message:
            "Use the shared api client from '@/lib/axios'. Raw fetch bypasses auth, CSRF, refresh and error handling.",
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
  ]),
  {
    files: ["**/*.test.tsx", "**/*.test.ts"],
    rules: {
      "react/display-name": "off",
      "@next/next/no-img-element": "off",
    },
  },
]);

export default eslintConfig;
