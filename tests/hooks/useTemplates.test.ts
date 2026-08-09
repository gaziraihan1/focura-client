import { describe, it, expect } from 'vitest';
import { waitFor, act } from '@testing-library/react';
import { renderHookWithProviders } from '@/tests/utils/renderWithProviders';
import {
  useTemplateCatalog,
  useTemplateImport,
  useSaveAsTemplate,
} from '@/hooks/useTemplates';
import { templateKeys } from '@/hooks/templateKeys';

// The axios mock in tests/setup.ts routes through fetch → MSW.
describe('useTemplateCatalog', () => {
  it('fetches the catalog with an access tier', async () => {
    const { result } = renderHookWithProviders(() => useTemplateCatalog());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.templates.length).toBeGreaterThanOrEqual(2);
    expect(result.current.data?.access.tier).toBeDefined();
    const tiers = result.current.data?.templates.map((t) => t.tier) ?? [];
    expect(tiers).toContain('FREE');
    expect(tiers).toContain('PRO');
  });

  it('returns FREE access tier by default', async () => {
    const { result } = renderHookWithProviders(() => useTemplateCatalog());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.access.tier).toBe('FREE');
  });
});

describe('useTemplateImport', () => {
  it('imports a template into a workspace and returns the new project', async () => {
    const { result } = renderHookWithProviders(() => useTemplateImport());

    let imported: unknown;
    await act(async () => {
      imported = await result.current.mutateAsync({
        slug: 'engineering-sprint',
        workspaceId: 'ws-1',
        projectName: 'My Sprint',
      });
    });

    expect(imported).toEqual({
      projectSlug: 'imported-project',
      workspaceSlug: 'test-ws',
    });
  });

  it('throws when workspaceId is missing', async () => {
    const { result } = renderHookWithProviders(() => useTemplateImport());

    await act(async () => {
      await expect(
        result.current.mutateAsync({ slug: 'engineering-sprint', workspaceId: '' }),
      ).rejects.toThrow();
    });
  });
});

describe('useSaveAsTemplate', () => {
  it('saves a project as a template', async () => {
    const { result } = renderHookWithProviders(() => useSaveAsTemplate());

    let saved: unknown;
    await act(async () => {
      saved = await result.current.mutateAsync({ projectId: 'proj-1' });
    });

    expect(saved).toEqual({
      slug: 'my-project-template',
      title: 'My Project',
    });
  });
});

describe('templateKeys', () => {
  it('builds stable query keys', () => {
    expect(templateKeys.catalog()).toEqual(['templates', 'catalog']);
    expect(templateKeys.detail('sprint')).toEqual(['templates', 'detail', 'sprint']);
    expect(templateKeys.private('ws-1')).toEqual(['templates', 'private', 'ws-1']);
  });
});
