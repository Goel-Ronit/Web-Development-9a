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
        const {name, billboardId} = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if (!name) {
            return new NextResponse("Name is required", {status: 400});
        }

        if (!billboardId) {
            return new NextResponse("BillboardId is required", {status: 400});
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
        const category = await prismadb.category.create({
            data: {
                name,
                billboardId,
                storeId: param.storeId
            }
        });
        return NextResponse.json(category);
    } catch (error) {
        console.log(error);
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

        const categories = await prismadb.category.findMany({
            where: {
                storeId: param.storeId
            }
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error", {status: 500});
    }
};