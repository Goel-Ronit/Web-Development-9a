import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    {params} : {params: Promise<{storeId: string}>}
) {
    try {
        const {userId} = await auth();
        const body = await req.json();
        const param = await params;
        const {label, imageUrl} = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if (!label) {
            return new NextResponse("Label is required", {status: 400});
        }

        if (!imageUrl) {
            return new NextResponse("Image Url is required", {status: 400});
        }

        if (!param.storeId) {
            return new NextResponse("Store ID is required", {status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: param.storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", {status: 403});
        }
        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: param.storeId
            }
        });
        return NextResponse.json(billboard);
    } catch (error) {
        return new NextResponse("Internal Error", {status: 500});
    }
};

export async function GET(
    req: Request,
    {params} : {params: Promise<{storeId: string}>}
) {
    try {
        const param = await params;
        if (!param.storeId) {
            return new NextResponse("Store ID is required", {status: 400});
        }

        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: param.storeId
            }
        });
        return NextResponse.json(billboards);
    } catch (error) {
        return new NextResponse("Internal Error", {status: 500});
    }
};