"use client";

import {
  BookUser,
  Code,
  Cog,
  MessageSquare,
  Globe,
  LayoutTemplate,
  Mail,
  Server,
  Volume2,
  BookOpenText,
  BookOpenIcon,
  BarChart3,
  LogOutIcon,
  MoreVerticalIcon,
  UsersIcon,
  GaugeIcon,
  UserRoundX,
  Webhook,
  HouseIcon,
  ChevronsUpDown,
  Check,
  PlusIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={className}
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
}
import { signOut } from "next-auth/react";
import { useTeam } from "~/providers/team-context";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@bytesend/ui/src/sidebar";
import Link from "next/link";
import { MiniThemeSwitcher, ThemeSwitcher } from "./theme/ThemeSwitcher";
import { useSession } from "next-auth/react";
import { isCloud, isSelfHosted } from "~/utils/common";
import { usePathname } from "next/navigation";
import { Badge } from "@bytesend/ui/src/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@bytesend/ui/src/avatar";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@bytesend/ui/src/dropdown-menu";
import { FeedbackDialog } from "./FeedbackDialog";
import { env } from "~/env";

// General items
const generalItems = [
  {
    title: "Analytics",
    url: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Emails",
    url: "/emails",
    icon: Mail,
  },
  {
    title: "Templates",
    url: "/templates",
    icon: LayoutTemplate,
  },
  {
    title: "Suppressions",
    url: "/suppressions",
    icon: UserRoundX,
  },
];

// Marketing items
const marketingItems = [
  {
    title: "Contacts",
    url: "/contacts",
    icon: BookUser,
  },
  {
    title: "Campaigns",
    url: "/campaigns",
    icon: Volume2,
  },
];

// Settings items
const settingsItems = [
  {
    title: "Domains",
    url: "/domains",
    icon: Globe,
  },
  {
    title: "Webhooks",
    url: "/webhooks",
    icon: Webhook,
  },
  {
    title: "Developer settings",
    url: "/dev-settings",
    icon: Code,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Cog,
  },
];

export function AppSidebar() {
  const { data: session } = useSession();
  const showFeedback = isCloud();
  const { currentTeam, teams, setCurrentTeam } = useTeam();

  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="border-b border-sidebar-border/40">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  tooltip="Switch team"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20 shrink-0 overflow-hidden">
                    {currentTeam?.image ? (
                      <Image
                        src={currentTeam.image}
                        alt={currentTeam.name}
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Image
                        src="/logo-squircle.png"
                        alt="ByteSend"
                        width={22}
                        height={22}
                        className="rounded-sm"
                      />
                    )}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold tracking-tight">
                      {currentTeam?.name ?? "No team"}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                align="start"
                className="w-56"
              >
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Your teams
                </DropdownMenuLabel>
                {teams.map((team) => (
                  <DropdownMenuItem
                    key={team.id}
                    onSelect={() => setCurrentTeam(team.id)}
                    className="flex items-center gap-2"
                  >
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/20 overflow-hidden">
                      {team.image ? (
                        <Image
                          src={team.image}
                          alt={team.name}
                          width={20}
                          height={20}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Image
                          src="/logo-squircle.png"
                          alt={team.name}
                          width={14}
                          height={14}
                          className="rounded-sm"
                        />
                      )}
                    </div>
                    <span className="flex-1 truncate">{team.name}</span>
                    {team.id === currentTeam?.id && (
                      <Check className="size-3.5 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/join-team" className="flex items-center gap-2 cursor-pointer">
                    <PlusIcon className="size-3.5" />
                    <span>Create team</span>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <span>General</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {generalItems.map((item) => {
                const isActive = pathname?.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>
            <span>Marketing</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {marketingItems.map((item) => {
                const isActive = pathname?.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                      className="text-sidebar-foreground"
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>
            <span>Settings</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => {
                  const isActive = pathname?.startsWith(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={isActive}
                      >
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {(session?.user.isAdmin || isSelfHosted()) && (
          <SidebarGroup>
            <SidebarGroupLabel>
              <span>Admin</span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip="Admin"
                    isActive={pathname?.startsWith("/admin")}
                  >
                    <Link href="/admin">
                      <Server />
                      <span>Admin Panel</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Pinned-to-bottom links inside the scrollable content zone */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {showFeedback ? (
                <SidebarMenuItem>
                  <FeedbackDialog
                    trigger={
                      <SidebarMenuButton tooltip="Feedback">
                        <MessageSquare />
                        <span>Feedback</span>
                      </SidebarMenuButton>
                    }
                  />
                </SidebarMenuItem>
              ) : null}
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Discord">
                  <Link href="https://discord.gg/xqkqzVRC4S" target="_blank">
                    <DiscordIcon className="size-4 shrink-0" />
                    <span>Discord</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="shrink-0">
        {<VersionInfo />}
        <NavUser
          user={{
            name:
              session?.user.name ||
              session?.user.email?.split("@")[0] ||
              "User",
            email: session?.user.email || "",
            avatar: session?.user.image || "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}

export function NavUser({
  user,
}: {
  user: {
    name?: string | null;
    email?: string | null;
    avatar?: string | null;
  };
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {user.avatar ? (
                  <AvatarImage
                    src={user.avatar}
                    alt={user.name ?? user.email ?? ""}
                  />
                ) : null}
                <AvatarFallback className="rounded-lg capitalize">
                  {user.name?.charAt(0) ?? user.email?.charAt(0) ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user.name ?? user.email ?? "User"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.name ? user.email : ""}
                </span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl"
            side={isMobile ? "bottom" : "top"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {user.avatar ? (
                    <AvatarImage
                      src={user.avatar}
                      alt={user.name ?? user.email ?? ""}
                    />
                  ) : null}
                  <AvatarFallback className="rounded-lg capitalize">
                    {user.name?.charAt(0) ?? user.email?.charAt(0) ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user.name ?? user.email ?? "User"}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.name ? user.email : ""}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/">
                  <HouseIcon />
                  Home
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings/team">
                  <UsersIcon />
                  Team
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <GaugeIcon />
                  Usage
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="https://docs.bytesend.cloud">
                  <BookOpenIcon />
                  Docs
                </Link>
              </DropdownMenuItem>
              <div className="px-2 py-0.5">
                <ThemeSwitcher />
              </div>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function VersionInfo() {
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/version")
      .then((r) => r.json())
      .then((data: { version: string }) => setVersion(data.version))
      .catch(() => setVersion("v0.2.1"));
  }, []);

  return (
    <div className="px-2 py-2 text-xs text-muted-foreground">
      <div className="flex items-center justify-between">
        <span>Version</span>
        <span className="font-mono">{version ?? "..."}</span>
      </div>
    </div>
  );
}
