"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BarChart,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Calendar,
  DollarSign,
  FileText,
  MessageSquare,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { useYear } from "../context/YearContext"

interface DataPoint {
  field: string
  value: string
  month?: string
}

export default function AnnualDataAnalysis() {
  const { currentYear } = useYear()
 return (
  <div className=" flex-1/2">

  </div>
  )
}

