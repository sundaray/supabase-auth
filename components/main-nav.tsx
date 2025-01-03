import React from "react"
import Link from "next/link"
 
import { NavItem } from "@/components/nav-item"
import { UserAccountNav } from "@/components/user-account-nav"
 
type NavItemType = {
  title: string
  href: string
}
 
type MainNavProps = {
  items: NavItemType[]
}
 
export function MainNav({ items }: MainNavProps) {
  return (
    <div className="flex h-14 items-center justify-between px-4 shadow-md">
      <div className="flex items-center space-x-2">
        <Link href="/" className="text-primary text-lg font-black">
          Auth.js
        </Link>
      </div>
      {items?.length ? (
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            {items.map((item) => (
              <li key={item.title}>
                <NavItem title={item.title} href={item.href} />
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
      <UserAccountNav />
    </div>
  )
}