import { Users } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Invitation } from "../InvitationCard";

interface InvitationHeaderProps {
  invitation: Invitation;
}

export default function InvitationHeader({
  invitation,
}: InvitationHeaderProps) {
  return (
    <div
      className="px-8 py-12 text-center relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${
          invitation.workspace.color || "#667eea"
        } 0%, ${invitation.workspace.color || "#667eea"}dd 100%)`,
      }}
    >
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        ></div>
      </div>
      <div className="relative">
        {invitation.workspace.logo ? (
          <Image
            width={80}
            height={80}
            src={invitation.workspace.logo}
            alt={invitation.workspace.name}
            className="w-20 h-20 rounded-xl mx-auto mb-4 bg-white/10 backdrop-blur-sm border-2 border-white/20"
          />
        ) : (
          <div className="w-20 h-20 rounded-xl mx-auto mb-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center">
            <Users className="w-10 h-10 text-white" />
          </div>
        )}
        <h1 className="text-3xl font-bold text-white mb-2">
          You&apos;re Invited!
        </h1>
        <p className="text-white/90 text-lg">
          Join <strong>{invitation.workspace.name}</strong> workspace
        </p>
      </div>
    </div>
  );
}
