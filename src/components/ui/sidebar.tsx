import * as React from "react"
import { createContext, useContext, useState } from "react"

import { cn } from "@/lib/utils"

const SidebarContext = createContext({
  isCollapsed: false,
  toggle: () => {},
})

export const useSidebarContext = () => useContext(SidebarContext)

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggle = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggle }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isCollapsed } = useSidebarContext()

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-4 h-screen",
        isCollapsed ? "w-16" : "w-64",
        "border-r bg-background transition-all duration-300 ease-in-out",
        className
      )}
      {...props}
    />
  )
})
Sidebar.displayName = "Sidebar"

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-1 flex-col gap-2 px-2",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between py-4 px-3",
        className
      )}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "py-4 px-3",
        className
      )}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { isCollapsed, toggle } = useSidebarContext()

  return (
    <button
      ref={ref}
      className={cn(
        "p-1.5 rounded-lg bg-secondary hover:bg-secondary/80",
        className
      )}
      onClick={toggle}
      aria-expanded={!isCollapsed}
      aria-label="Collapse sidebar"
      {...props}
    />
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

export const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      className={cn(
        "flex flex-1 flex-col gap-0.5",
        className
      )}
      {...props}
    />
  )
})
SidebarMenu.displayName = "SidebarMenu"

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => {
  return (
    <li
      ref={ref}
      className={cn(
        "",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuItem.displayName = "SidebarMenuItem"

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, isActive, ...props }, ref) => {
  const { isCollapsed } = useSidebarContext()

  return (
    <button
      ref={ref}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-secondary",
        isActive ? "bg-secondary" : "transparent",
        className
      )}
      {...props}
    >
      {props.children}
      {!isCollapsed && (
        <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* You can add an icon here if you want */}
        </span>
      )}
    </button>
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

export const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isCollapsed } = useSidebarContext()

  return (
    <div
      ref={ref}
      className={cn(
        "border-l bg-background transition-all duration-300 ease-in-out",
        isCollapsed ? "ml-16" : "ml-64",
        "flex-1",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"
