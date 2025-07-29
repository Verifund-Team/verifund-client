import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import CountUp from "react-countup";

const StatCard = ({
  icon: Icon,
  title,
  value,
  prefix = "",
  suffix = "",
  color,
}: {
  icon: React.ElementType;
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  color: string;
  delay: number;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold" style={{ color }}>
        {prefix}
        <CountUp end={value} separator="." duration={1.5} />
        {suffix}
      </div>
    </CardContent>
  </Card>
);

export default StatCard;
