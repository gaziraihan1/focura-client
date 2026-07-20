import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import MentionTextarea from "@/components/Dashboard/TaskDetails/TaskTab/MentionTextarea";

vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/lib/utils", () => ({
  cn: (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(" "),
}));

vi.mock("@/components/Dashboard/TaskDetails/TaskTab/MentionDropdown", () => ({
  MentionDropdown: () => <div data-testid="mention-dropdown" />,
}));

vi.mock("@/hooks/useCommentPage", () => ({
  useCommentPage: () => ({
    mentionQuery: null,
    filteredUsers: [],
    activeIndex: 0,
    dropdownPos: null,
    handleChange: vi.fn(),
    insertMention: vi.fn(),
    handleKeyDown: vi.fn(),
  }),
}));

vi.mock("@/utils/comments.utils", () => ({
  stripMentionSyntax: (text: string) => text,
}));

vi.mock("@/types/comment.types", () => ({}));

const defaultProps = {
  value: "",
  onChange: vi.fn(),
  onSubmit: vi.fn(),
  placeholder: "Write a comment...",
  mentionableUsers: [],
  disabled: false,
};

describe("MentionTextarea", () => {
  it("renders the textarea with placeholder", () => {
    render(<MentionTextarea {...defaultProps} />);
    expect(screen.getByPlaceholderText("Write a comment...")).toBeInTheDocument();
  });

  it("renders the hint text", () => {
    render(<MentionTextarea {...defaultProps} />);
    expect(screen.getByText(/mention/)).toBeInTheDocument();
    expect(screen.getByText("⌘ Enter")).toBeInTheDocument();
  });

  it("disables textarea when disabled prop is true", () => {
    render(<MentionTextarea {...defaultProps} disabled={true} />);
    expect(screen.getByPlaceholderText("Write a comment...")).toBeDisabled();
  });

  it("does not render mention dropdown when no mention query", () => {
    render(<MentionTextarea {...defaultProps} />);
    expect(screen.queryByTestId("mention-dropdown")).not.toBeInTheDocument();
  });
});
