"use client";
import React from "react";
import { SideBar } from "./sideBar";
import { ModeToggle } from '@/components/themeToggle';
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-3">
                    <SideBar />
                </div>
                <div className="col-span-9">
                    <div className="h-[8%]">
                        <div className="float-right mr-2 mt-2">
                            <ModeToggle />
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </>
    )
}