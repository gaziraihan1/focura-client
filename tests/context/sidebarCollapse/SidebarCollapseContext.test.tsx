import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  SidebarCollapseProvider,
  useSidebarCollapse,
} from '@/context/sidebarCollapse/SidebarCollapseContext';

const MAIN_KEY = 'focura.main-sidebar-collapsed';
const PROJECT_KEY = 'focura.project-sidebar-collapsed';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SidebarCollapseProvider>{children}</SidebarCollapseProvider>
);

describe('SidebarCollapseContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('defaults to expanded (not collapsed) for both sidebars', () => {
    const { result } = renderHook(() => useSidebarCollapse(), { wrapper });
    expect(result.current.isMainSidebarCollapsed).toBe(false);
    expect(result.current.isProjectSidebarCollapsed).toBe(false);
  });

  it('toggleMainSidebar collapses the main sidebar and persists it', () => {
    const { result } = renderHook(() => useSidebarCollapse(), { wrapper });
    act(() => result.current.toggleMainSidebar());
    expect(result.current.isMainSidebarCollapsed).toBe(true);
    expect(localStorage.getItem(MAIN_KEY)).toBe('1');
  });

  it('toggleMainSidebar expands a collapsed main sidebar', () => {
    const { result } = renderHook(() => useSidebarCollapse(), { wrapper });
    act(() => result.current.toggleMainSidebar());
    act(() => result.current.toggleMainSidebar());
    expect(result.current.isMainSidebarCollapsed).toBe(false);
    expect(localStorage.getItem(MAIN_KEY)).toBe('0');
  });

  it('toggleProjectSidebar only affects the project sidebar', () => {
    const { result } = renderHook(() => useSidebarCollapse(), { wrapper });
    act(() => result.current.toggleProjectSidebar());
    expect(result.current.isProjectSidebarCollapsed).toBe(true);
    expect(result.current.isMainSidebarCollapsed).toBe(false);
    expect(localStorage.getItem(PROJECT_KEY)).toBe('1');
    expect(localStorage.getItem(MAIN_KEY)).toBeNull();
  });

  it('toggling the main sidebar does not affect the project sidebar', () => {
    const { result } = renderHook(() => useSidebarCollapse(), { wrapper });
    act(() => result.current.toggleProjectSidebar());
    act(() => result.current.toggleMainSidebar());
    expect(result.current.isProjectSidebarCollapsed).toBe(true);
  });

  it('setMainSidebarCollapsed forces a specific value', () => {
    const { result } = renderHook(() => useSidebarCollapse(), { wrapper });
    act(() => result.current.setMainSidebarCollapsed(true));
    expect(result.current.isMainSidebarCollapsed).toBe(true);
    act(() => result.current.setMainSidebarCollapsed(false));
    expect(result.current.isMainSidebarCollapsed).toBe(false);
  });

  it('setProjectSidebarCollapsed forces a specific value', () => {
    const { result } = renderHook(() => useSidebarCollapse(), { wrapper });
    act(() => result.current.setProjectSidebarCollapsed(true));
    expect(result.current.isProjectSidebarCollapsed).toBe(true);
    expect(result.current.isMainSidebarCollapsed).toBe(false);
  });

  it('hydrates the main sidebar state from a persisted localStorage value', () => {
    localStorage.setItem(MAIN_KEY, '1');
    const { result } = renderHook(() => useSidebarCollapse(), { wrapper });
    expect(result.current.isMainSidebarCollapsed).toBe(true);
  });

  it('hydrates the project sidebar state from a persisted localStorage value', () => {
    localStorage.setItem(PROJECT_KEY, '1');
    const { result } = renderHook(() => useSidebarCollapse(), { wrapper });
    expect(result.current.isProjectSidebarCollapsed).toBe(true);
  });
});
