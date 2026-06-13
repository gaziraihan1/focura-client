"use client";

import {
  Calendar,
  Clock,
  MapPin,
  Link2,
  Users,
  ArrowLeft,
  Video,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMeeting } from "@/hooks/useMeeting";
import { useWorkspace } from "@/hooks/useWorkspace";
import { cn } from "@/lib/utils";
import { MeetingDetailsSkeleton, DetailCard, VisibilityBadge, HostChip, InfoRow, AttendeeAvatar } from "@/components/Dashboard/MeetingDetails";
import { formatDate, formatTime, getDuration } from "@/utils/meetingDetails.utils";
import { StatusBadge } from "@/components/Dashboard/MeetingDetails/StatusBadge";

// ─── Main page ────────────────────────────────────────────────────────────────

export default function MeetingDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const { data: workspace } = useWorkspace(params.workspaceSlug as string);
  const meetingId = params.slug as string;
  const { data: meeting, isLoading } = useMeeting(workspace?.id ?? "", meetingId);

  if (isLoading) return <MeetingDetailsSkeleton />;

  if (!meeting) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-32 text-center px-6">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
          <Video className="size-7 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Meeting not found</h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          This meeting may have been removed or you don&apos;t have access to it.
        </p>
        <button
          onClick={() => router.back()}
          className="mt-2 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <ArrowLeft className="size-4" />
          Go back
        </button>
      </div>
    );
  }

  const duration = getDuration(meeting.startTime, meeting.endTime);
  const attendeeCount = meeting.attendees.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">

        {/* ── Back button ── */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to meetings
        </button>

        {/* ── Hero card ── */}
        <DetailCard className="mb-4 overflow-hidden">
          {/* Subtle top accent stripe based on status */}
          <div
            className={cn(
              "absolute inset-x-0 top-0 h-1 rounded-t-2xl",
              meeting.status === "ONGOING" && "bg-linear-to-r from-green-400 to-emerald-500",
              meeting.status === "SCHEDULED" && "bg-linear-to-r from-blue-400 to-indigo-500",
              meeting.status === "COMPLETED" && "bg-linear-to-r from-muted to-muted",
              meeting.status === "CANCELLED" && "bg-linear-to-r from-red-400 to-rose-500"
            )}
          />

          <div className="relative pt-2 space-y-4">
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={meeting.status} />
              <VisibilityBadge visibility={meeting.visibility} />
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {meeting.title}
              </h1>
              {meeting.description && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground max-w-2xl">
                  {meeting.description}
                </p>
              )}
            </div>

            {/* Host */}
            <div className="pt-1">
              <HostChip user={meeting.createdBy} />
            </div>
          </div>
        </DetailCard>

        {/* ── Middle row: time + meta ── */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* Time & date card */}
          <DetailCard className="md:col-span-2 space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Schedule
            </h2>

            <InfoRow icon={Calendar} label="Date">
              {formatDate(meeting.startTime)}
            </InfoRow>

            <InfoRow icon={Clock} label="Time">
              <span>
                {formatTime(meeting.startTime)}
                <span className="mx-2 text-muted-foreground">→</span>
                {formatTime(meeting.endTime)}
              </span>
              {/* Duration pill */}
              <span className="ml-2 inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {duration}
              </span>
            </InfoRow>

            {meeting.location && (
              <InfoRow icon={MapPin} label="Location">
                {meeting.location}
              </InfoRow>
            )}

            {meeting.link && (
              <InfoRow icon={Link2} label="Meeting Link">
                <a
                  href={meeting.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                >
                  <Video className="size-3.5" />
                  Join Meeting
                </a>
              </InfoRow>
            )}
          </DetailCard>

          {/* Quick stats card */}
          <DetailCard className="flex flex-col justify-between gap-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Overview
            </h2>

            <div className="space-y-4">
              {/* Attendee count */}
              <div className="rounded-xl bg-muted/60 p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-3xl font-bold text-foreground">
                  <Users className="size-6 text-muted-foreground" />
                  {attendeeCount}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {attendeeCount === 1 ? "Attendee" : "Attendees"}
                </p>
              </div>

              {/* Duration */}
              <div className="rounded-xl bg-muted/60 p-4 text-center">
                <p className="text-3xl font-bold text-foreground">{duration}</p>
                <p className="mt-1 text-xs text-muted-foreground">Duration</p>
              </div>
            </div>
          </DetailCard>
        </div>

        {/* ── Attendees ── */}
        <DetailCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Attendees
            </h2>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {attendeeCount}
            </span>
          </div>

          {attendeeCount === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <Users className="size-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No attendees yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {meeting.attendees.map((attendee) => (
                <AttendeeAvatar
                  key={attendee.id}
                  user={attendee.user}
                  joinedAt={attendee.joinedAt}
                />
              ))}
            </div>
          )}
        </DetailCard>

        {/* ── Footer meta ── */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Created{" "}
          {new Date(meeting.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
          {meeting.updatedAt !== meeting.createdAt && (
            <>
              {" · "}Updated{" "}
              {new Date(meeting.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </>
          )}
        </p>
      </div>
    </div>
  );
}