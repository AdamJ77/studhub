import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";

export default function Navbar() {
  const links = [
    {
      href: "/calendar",
      title: "Calendar",
    },
    {
      href: "/courses",
      title: "Courses",
    },
    {
      href: "/chat",
      title: "Chat",
    },
  ];
  return (
    <>
      <NavigationMenu
        className="p-4 flex justify-between w-full fixed bg-slate-100 max-w-full h-16"
        style={{ zIndex: 99999 }}
      >
        <NavigationMenuList>
          <NavigationMenuItem>
            <div className="flex items-center gap-2">
              <img
                src={`${process.env.PUBLIC_URL}/logo.svg`}
                alt="logo"
                className="w-7 aspect-square"
              />
              <h2 className="font-bold text-xl">Student Scheduler</h2>
            </div>
          </NavigationMenuItem>
          <NavigationMenuItem>
            {links.map((item, id) => (
              <a href={item.href} key={id} className="ml-6">
                <NavigationMenuLink>{item.title}</NavigationMenuLink>
              </a>
            ))}
          </NavigationMenuItem>
        </NavigationMenuList>
        <div>Welcome, Jakub "Stachu" Stacherski!</div>
      </NavigationMenu>
      <div className="h-16" />
    </>
  );
}
