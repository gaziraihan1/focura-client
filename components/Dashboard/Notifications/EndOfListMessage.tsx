interface EndOfListMessageProps {
  show: boolean;
}

export function EndOfListMessage({ show }: EndOfListMessageProps) {
  if (!show) return null;

  return (
    <p className="text-center text-sm text-muted-foreground py-4">
      You&apos;ve reached the end of your notifications
    </p>
  );
}