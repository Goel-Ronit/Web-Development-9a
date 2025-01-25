import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(
    req: Request,
    {params} : {params: Promise<{colorId: string}>}
) {
    try{
        const param = await params;

        if (!param.colorId) {
            return new NextResponse("Color id is required", {status: 400});
        }

        const color = await prismadb.color.findUnique({
            where:  {
                id: param.colorId
            }
        });

        return NextResponse.json(color);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error", {status: 500})
    }
};
export async function PATCH(
    req: Request,
    {params} : {params: Promise<{storeId: string, colorId: string}>}
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

        if (!param.colorId) {
            return new NextResponse("Color id is required", {status: 400});
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

        const color = await prismadb.color.updateMany({
            where:  {
                id: param.colorId,
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(color);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error", {status: 500})
    }
};

export async function DELETE(
    req: Request,
    {params} : {params: Promise<{storeId: string, colorId: string}>}
) {
    try{
        const {userId} = await auth();
        const param = await params;

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if (!param.colorId) {
            return new NextResponse("Color id is required", {status: 400});
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

        const color = await prismadb.color.deleteMany({
            where:  {
                id: param.colorId
            }
        });

        return NextResponse.json(color);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error", {status: 500})
    }
};