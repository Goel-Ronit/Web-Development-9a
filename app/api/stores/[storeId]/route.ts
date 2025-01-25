import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    {params} : {params: Promise<{storeId: string}>}
) {
    try{
        const {userId} = await auth();
        const body = await req.json();
        const param = await params;

        const {name} = body;

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if  (!name) {
            return new NextResponse("Name is required", {status: 400});
        }

        if (!param.storeId) {
            return new NextResponse("Store id is required", {status: 400});
        }

        const store = await prismadb.store.updateMany({
            where:  {
                id: param.storeId,
                userId
            },
            data: {
                name
            }
        });

        return NextResponse.json(store);
    } catch (error) {
        return new NextResponse("Internal Error", {status: 500})
    }
};

export async function DELETE(
    req: Request,
    {params} : {params: Promise<{storeId: string}>}
) {
    try{
        const {userId} = await auth();
        const param = await params;

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if (!param.storeId) {
            return new NextResponse("Store id is required", {status: 400});
        }

        const store = await prismadb.store.deleteMany({
            where:  {
                id: param.storeId,
                userId
            }
        });

        return NextResponse.json(store);
    } catch (error) {
        return new NextResponse("Internal Error", {status: 500})
    }
};