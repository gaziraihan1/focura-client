import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/tests/utils/renderWithProviders';
import TemplateImportModal from '@/components/Templates/TemplateImportModal';
import { mockTemplateCatalogItem } from '@/tests/mock/handlers/template.handlers';
import { catalogItemToTemplate } from '@/lib/templatesData';

const mockTemplate = catalogItemToTemplate(mockTemplateCatalogItem);

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

vi.mock('lucide-react', () => {
  const icon = (name: string) => {
    const Component = (props: React.SVGProps<SVGSVGElement>) => <svg data-testid={`${name}-icon`} {...props} />
    Component.displayName = name
    return Component
  }
  return {
    X: icon('X'),
    Loader2: icon('Loader2'),
    FolderPlus: icon('FolderPlus'),
    ArrowRight: icon('ArrowRight'),
    Lock: icon('Lock'),
    Crown: icon('Crown'),
    Sparkles: icon('Sparkles'),
  }
});

vi.mock('@/lib/utils', () => ({
  cn: (...args: (string | boolean | undefined | null)[]) => args.filter(Boolean).join(' '),
}));

describe('TemplateImportModal', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the template title and import CTA', () => {
    renderWithProviders(
      <TemplateImportModal template={mockTemplate} accessTier="PRO" onClose={onClose} />
    );
    expect(screen.getByText(/Use “Agile Sprint Board”/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Import template/i })).toBeInTheDocument();
  });

  it('renders the workspace picker', async () => {
    renderWithProviders(
      <TemplateImportModal template={mockTemplate} accessTier="PRO" onClose={onClose} />
    );
    expect(await screen.findByRole('combobox', { name: /Destination workspace/i })).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    renderWithProviders(
      <TemplateImportModal template={mockTemplate} accessTier="PRO" onClose={onClose} />
    );
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalled();
  });

  it('shows an upgrade state when the template is locked', () => {
    renderWithProviders(
      <TemplateImportModal template={mockTemplate} accessTier="FREE" onClose={onClose} />
    );
    expect(screen.getByText(/Pro plan required/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upgrade plan/i })).toBeInTheDocument();
  });

  it('imports the template and calls onClose on success', async () => {
    const { qc } = renderWithProviders(
      <TemplateImportModal template={mockTemplate} accessTier="PRO" onClose={onClose} />
    );
    const workspaceSelect = await screen.findByRole('combobox', { name: /Destination workspace/i });
    fireEvent.change(workspaceSelect, { target: { value: 'ws-1' } });
    fireEvent.click(screen.getByRole('button', { name: /Import template/i }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(qc).toBeDefined();
  });
});
