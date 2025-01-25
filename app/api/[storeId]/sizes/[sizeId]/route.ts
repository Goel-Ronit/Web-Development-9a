import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(
    req: Request,
    {params} : {params: Promise<{sizeId: string}>}
) {
    try{
        const param = await params;

        if (!param.sizeId) {
            return new NextResponse("Size id is required", {status: 400});
        }

        const size = await prismadb.size.findUnique({
            where:  {
                id: param.sizeId
            }
        });

        return NextResponse.json(size);
    } catch (error) {
        return new NextResponse("Internal Error", {status: 500})
    }
};
export async function PATCH(
    req: Request,
    {params} : {params: Promise<{storeId: string, sizeId: string}>}
) {
    try{
        const {userId} = await auth();
        const body = await req.json();
        const param = await params;

        const {name, value} = body;

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if  (!name) {
            return new NextResponse("Name is required", {status: 400});
        }

        if  (!value) {
            return new NextResponse("Value is required", {status: 400});
        }

        if (!param.sizeId) {
            return new NextResponse("Size id is required", {status: 400});
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

        const size = await prismadb.size.updateMany({
            where:  {
                id: param.sizeId,
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(size);
    } catch (error) {
        return new NextResponse("Internal Error", {status: 500})
    }
};

export async function DELETE(
    req: Request,
    {params} : {params: Promise<{storeId: string, sizeId: string}>}
) {
    try{
        const {userId} = await auth();
        const param = await params;

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if (!param.sizeId) {
            return new NextResponse("Size id is required", {status: 400});
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

        const size = await prismadb.size.deleteMany({
            where:  {
                id: param.sizeId
            }
        });

        return NextResponse.json(size);
    } catch (error) {
        return new NextResponse("Internal Error", {status: 500})
    }
};