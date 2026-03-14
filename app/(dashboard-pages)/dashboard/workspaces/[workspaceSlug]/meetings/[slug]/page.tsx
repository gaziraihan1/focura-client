"use client"
import { useMeeting } from '@/hooks/useMeeting';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useParams } from 'next/navigation'
import React from 'react'

export default function MeetingDetailsPage() {
  const params = useParams();
  const {data: workspace} = useWorkspace(params.workspaceSlug as string)
  const meetingId = params.slug as string;
  const {data: meeting}= useMeeting(workspace!.id, meetingId);
  console.log(meeting)
  return (
    <div>MeetingDetailsPage</div>
  )
}
