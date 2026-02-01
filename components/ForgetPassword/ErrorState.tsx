"use client"
import React from 'react'
import { motion } from "framer-motion"
import { AlertCircle } from 'lucide-react'

interface ErrorStateProps {
    error: string;
}
export default function ErrorState({error}: ErrorStateProps) {
  return (
    <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
          >
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <p className="text-red-500 text-sm">{error}</p>
          </motion.div>
  )
}
