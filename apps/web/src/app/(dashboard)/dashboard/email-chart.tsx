import React from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { EmailStatusIcon } from "../emails/email-status-badge";
import { EmailStatus } from "@prisma/client";
import { api } from "~/trpc/react";
import Spinner from "@bytesend/ui/src/spinner";
import { useTheme } from "@bytesend/ui";
import { useColors } from "./hooks/useColors";
import { Button } from "@bytesend/ui/src/button";
import { useUpgradeModalStore } from "~/store/upgradeModalStore";
import { LimitReason } from "~/lib/constants/plans";

interface EmailChartProps {
  days: number;
  domain: string | null;
  isPaidTeam: boolean;
}

const STACK_ORDER = [
  "delivered",
  "bounced",
  "complained",
  "opened",
  "clicked",
] as const;

type StackKey = (typeof STACK_ORDER)[number];
function createRoundedTopShape(
  currentKey: StackKey,
  visibleStackOrder: StackKey[],
) {
  const currentIndex = visibleStackOrder.indexOf(currentKey);
  return (props: any) => {
    const payload = props.payload as
      | Partial<Record<StackKey, number>>
      | undefined;
    let hasAbove = false;
    for (let i = currentIndex + 1; i < visibleStackOrder.length; i++) {
      const key = visibleStackOrder[i];
      const val = key ? (payload?.[key] ?? 0) : 0;
      if (val > 0) {
        hasAbove = true;
        break;
      }
    }

    const radius = hasAbove ? [0, 0, 0, 0] : [2.5, 2.5, 0, 0];
    return <Rectangle {...props} radius={radius as any} />;
  };
}

export default function EmailChart({ days, domain, isPaidTeam }: EmailChartProps) {
  const [selectedMetrics, setSelectedMetrics] = React.useState<StackKey[]>([]);
  const openUpgradeModal = useUpgradeModalStore((s) => s.action.openModal);
  const domainId = domain ? Number(domain) : undefined;
  const statusQuery = api.dashboard.emailTimeSeries.useQuery({
    days: days,
    domain: domainId,
  });

  const currentColors = useColors();

  const metricMeta: Record<StackKey, { label: string; color: string }> = {
    delivered: { label: "Delivered", color: currentColors.delivered },
    bounced: { label: "Bounced", color: currentColors.bounced },
    complained: { label: "Complained", color: currentColors.complained },
    opened: { label: "Opened", color: currentColors.opened },
    clicked: { label: "Clicked", color: currentColors.clicked },
  };

  const visibleMetrics: StackKey[] =
    selectedMetrics.length === 0
      ? [...STACK_ORDER]
      : STACK_ORDER.filter((key) => selectedMetrics.includes(key));

  const totals = statusQuery.data?.totalCounts;
  const sent = totals?.sent ?? 0;
  const delivered = totals?.delivered ?? 0;
  const opened = totals?.opened ?? 0;
  const clicked = totals?.clicked ?? 0;
  const bounced = totals?.bounced ?? 0;
  const complained = totals?.complained ?? 0;

  const deliveryRate = ratio(delivered, sent);
  const bounceRate = ratio(bounced, sent);
  const complaintRate = ratio(complained, sent);
  const openRate = ratio(opened, delivered);
  const clickRate = ratio(clicked, delivered);
  const clickToOpenRate = ratio(clicked, opened);
  const avgDailyVolume = days > 0 ? sent / days : 0;

  const toggleMetric = (metric: StackKey) => {
    setSelectedMetrics((prev) => {
      const exists = prev.includes(metric);

      if (exists) {
        return prev.filter((key) => key !== metric);
      }

      const nextSet = new Set([...prev, metric]);
      return STACK_ORDER.filter((key) => nextSet.has(key));
    });
  };

  return (
    <div className="flex flex-col gap-8">
      {!statusQuery.isLoading && statusQuery.data ? (
        <div className="w-full rounded-xl border border-border/60 bg-card p-4 shadow-sm">
          <div className="p-2 overflow-x-auto">

            <div className="flex gap-10">
              <EmailChartItem
                status={"total"}
                count={statusQuery.data.totalCounts.sent}
                percentage={100}
                isActive={selectedMetrics.length === 0}
                isClickable={false}
              />
              <EmailChartItem
                status={EmailStatus.DELIVERED}
                count={statusQuery.data.totalCounts.delivered}
                percentage={
                  statusQuery.data.totalCounts.delivered /
                  statusQuery.data.totalCounts.sent
                }
                isActive={
                  selectedMetrics.length === 0 ||
                  selectedMetrics.includes("delivered")
                }
                onClick={() => toggleMetric("delivered")}
              />
              <EmailChartItem
                status={EmailStatus.BOUNCED}
                count={statusQuery.data.totalCounts.bounced}
                percentage={
                  statusQuery.data.totalCounts.bounced /
                  statusQuery.data.totalCounts.sent
                }
                isActive={
                  selectedMetrics.length === 0 ||
                  selectedMetrics.includes("bounced")
                }
                onClick={() => toggleMetric("bounced")}
              />
              <EmailChartItem
                status={EmailStatus.COMPLAINED}
                count={statusQuery.data.totalCounts.complained}
                percentage={
                  statusQuery.data.totalCounts.complained /
                  statusQuery.data.totalCounts.sent
                }
                isActive={
                  selectedMetrics.length === 0 ||
                  selectedMetrics.includes("complained")
                }
                onClick={() => toggleMetric("complained")}
              />
              <EmailChartItem
                status={EmailStatus.CLICKED}
                count={statusQuery.data.totalCounts.clicked}
                percentage={
                  statusQuery.data.totalCounts.clicked /
                  statusQuery.data.totalCounts.sent
                }
                isActive={
                  selectedMetrics.length === 0 ||
                  selectedMetrics.includes("clicked")
                }
                onClick={() => toggleMetric("clicked")}
              />
              <EmailChartItem
                status={EmailStatus.OPENED}
                count={statusQuery.data.totalCounts.opened}
                percentage={
                  statusQuery.data.totalCounts.opened /
                  statusQuery.data.totalCounts.sent
                }
                isActive={
                  selectedMetrics.length === 0 ||
                  selectedMetrics.includes("opened")
                }
                onClick={() => toggleMetric("opened")}
              />
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={900}
                height={200}
                data={statusQuery.data.result}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis
                  dataKey="date"
                  fontSize={12}
                  className="font-mono"
                  stroke={currentColors.xaxis}
                  tick={{ fill: currentColors.xaxis, fillOpacity: 0.65 }}
                  axisLine={false}
                  tickLine={false}
                />
                {/* <YAxis fontSize={12} className="font-mono" /> */}
                <Tooltip
                  content={({ payload }) => {
                    if (!payload || payload.length === 0) return null;

                    const data = payload[0]?.payload as Record<
                      | "sent"
                      | "delivered"
                      | "opened"
                      | "clicked"
                      | "bounced"
                      | "complained",
                      number
                    > & { date: string };

                    if (!data) return null;

                    const hasAnyData =
                      visibleMetrics.reduce(
                        (sum, key) => sum + (data[key] || 0),
                        0,
                      ) > 0;

                    if (!hasAnyData) return null;

                    return (
                      <div className="min-w-35 rounded-lg border border-border/60 bg-popover p-3 shadow-lg flex flex-col gap-1.5">
                        <p className="text-sm text-muted-foreground">
                          {data.date}
                        </p>
                        {visibleMetrics.map((metricKey) => {
                          const metricValue = data[metricKey] || 0;
                          if (!metricValue) return null;

                          return (
                            <div
                              key={metricKey}
                              className="flex gap-2 items-center"
                            >
                              <div
                                className="w-2.5 h-2.5 rounded-[2px]"
                                style={{
                                  backgroundColor: metricMeta[metricKey].color,
                                }}
                              ></div>
                              <p className="w-17.5 text-xs text-muted-foreground">
                                {metricMeta[metricKey].label}
                              </p>
                              <p className="text-xs font-mono">{metricValue}</p>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }}
                  cursor={false}
                />
                {visibleMetrics.map((metricKey) => (
                  <Bar
                    key={metricKey}
                    barSize={20}
                    dataKey={metricKey}
                    stackId="a"
                    fill={metricMeta[metricKey].color}
                    shape={createRoundedTopShape(metricKey, visibleMetrics)}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <AnalyticsStatCard label="Total sent" value={sent.toLocaleString()} />
            <AnalyticsStatCard label="Delivery rate" value={formatPercent(deliveryRate)} />
            <AnalyticsStatCard label="Bounce rate" value={formatPercent(bounceRate)} />
            <AnalyticsStatCard label="Complaint rate" value={formatPercent(complaintRate)} />
          </div>

          {isPaidTeam ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <AnalyticsStatCard label="Open rate (delivered)" value={formatPercent(openRate)} isAdvanced />
              <AnalyticsStatCard label="Click rate (delivered)" value={formatPercent(clickRate)} isAdvanced />
              <AnalyticsStatCard label="Click-to-open rate" value={formatPercent(clickToOpenRate)} isAdvanced />
              <AnalyticsStatCard
                label="Avg daily volume"
                value={Math.round(avgDailyVolume).toLocaleString()}
                isAdvanced
              />
            </div>
          ) : (
            <div className="mt-3 rounded-xl border border-border/60 bg-muted/15 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium">Advanced analytics</p>
                  <p className="text-xs text-muted-foreground">
                    Open rate, click rate, click-to-open rate, and deeper engagement insights are available on paid plans.
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => openUpgradeModal(LimitReason.MARKETING_NOT_AVAILABLE)}>
                  Upgrade for advanced analytics
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="h-80 w-full rounded-xl border border-border/60 bg-card p-4"> </div>
      )}
    </div>
  );
}

type DashboardItemCardProps = {
  status: EmailStatus | "total";
  count: number;
  percentage: number;
  onClick?: () => void;
  isActive?: boolean;
  isClickable?: boolean;
};

const DashboardItemCard: React.FC<DashboardItemCardProps> = ({
  status,
  count,
  percentage,
}) => {
  return (
    <div className="h-25 min-w-42.5 w-[16%] rounded-xl border bg-secondary/10 p-4 shadow flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {status !== "total" ? <EmailStatusIcon status={status} /> : null}
        <div className=" capitalize">{status.toLowerCase()}</div>
      </div>
      <div className="flex justify-between items-end">
        <div className="text-foreground font-light text-2xl  font-mono">
          {count}
        </div>
        {status !== "total" && isFinite(percentage) ? (
          <div className="text-sm pb-1">
            {count > 0 ? (percentage * 100).toFixed(0) : 0}%
          </div>
        ) : null}
      </div>
    </div>
  );
};

const EmailChartItem: React.FC<DashboardItemCardProps> = ({
  status,
  count,
  percentage,
  onClick,
  isActive = false,
  isClickable = true,
}) => {
  const currentColors = useColors();

  const getColorForStatus = (status: EmailStatus | "total"): string => {
    switch (status) {
      case "DELIVERED":
        return currentColors.delivered;
      case "BOUNCED":
        return currentColors.bounced;
      case "COMPLAINED":
        return currentColors.complained;
      case "OPENED":
        return currentColors.opened;
      case "CLICKED":
        return currentColors.clicked;
      case "total":
      default:
        return "#6b7280"; // gray-500 for total and other statuses
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isClickable}
      aria-pressed={isClickable ? isActive : undefined}
      className={`flex gap-3 items-stretch font-mono transition-opacity ${isClickable ? "cursor-pointer" : "cursor-default"
        } ${isActive ? "opacity-100" : "opacity-45 hover:opacity-100"} ${isClickable ? "" : "pointer-events-none"
        }`}
    >
      <div>
        <div className=" flex  items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-[3px]"
            style={{ backgroundColor: getColorForStatus(status) }}
          ></div>

          <div className="text-xs uppercase text-muted-foreground ">
            {status.toLowerCase()}
          </div>
        </div>
        <div className="mt-1 -ml-0.5 ">
          <span className="text-xl font-mono">{count}</span>
          <span className="text-xs ml-2 font-mono">
            {status !== "total" && isFinite(percentage)
              ? `(${count > 0 ? (percentage * 100).toFixed(0) : 0}%)`
              : null}
          </span>
        </div>
      </div>
    </button>
  );
};

function ratio(numerator: number, denominator: number): number {
  if (!denominator || denominator <= 0) return 0;
  return (numerator / denominator) * 100;
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

function AnalyticsStatCard({
  label,
  value,
  isAdvanced,
}: {
  label: string;
  value: string;
  isAdvanced?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/50 px-3 py-2.5">
      <div className="flex items-center gap-2">
        <p className="text-xs text-muted-foreground">{label}</p>
        {isAdvanced ? (
          <span className="inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
            Paid
          </span>
        ) : null}
      </div>
      <p className="mt-1 font-mono text-base">{value}</p>
    </div>
  );
}
