import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function DashBoardLayout({
    children,
    params
}: {
    children: React.ReactNode,
    params: Promise<{storeId: string}>
}) {
    const {userId} = await auth();
    if (!userId) {
        redirect('/sign-in');
    }

    const param = await params;

    const store = await prismadb.store.findFirst({
        where: {
            id: param.storeId,
            userId
        }
    });

    if (!store) {
        redirect('/');
    }

    return (
        <>
            <Navbar />
            {children}
        </>
    )
}