import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(
    req: Request,
    {params} : {params: Promise<{billboardId: string}>}
) {
    try{
        const param = await params;

        if (!param.billboardId) {
            return new NextResponse("Billboard id is required", {status: 400});
        }

        const billboard = await prismadb.billboard.findUnique({
            where:  {
                id: param.billboardId
            }
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error", {status: 500})
    }
};
export async function PATCH(
    req: Request,
    {params} : {params: Promise<{storeId: string, billboardId: string}>}
) {
    try{
        const {userId} = await auth();
        const body = await req.json();
        const param = await params;

        const {label, imageUrl} = body;

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if  (!label) {
            return new NextResponse("Label is required", {status: 400});
        }

        if  (!imageUrl) {
            return new NextResponse("Image Url is required", {status: 400});
        }

        if (!param.billboardId) {
            return new NextResponse("Billboard id is required", {status: 400});
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

        const billboard = await prismadb.billboard.updateMany({
            where:  {
                id: param.billboardId,
            },
            data: {
                label,
                imageUrl
            }
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error", {status: 500})
    }
};

export async function DELETE(
    req: Request,
    {params} : {params: Promise<{storeId: string, billboardId: string}>}
) {
    try{
        const {userId} = await auth();
        const param = await params;

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if (!param.billboardId) {
            return new NextResponse("Billboard id is required", {status: 400});
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

        const billboard = await prismadb.billboard.deleteMany({
            where:  {
                id: param.billboardId
            }
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error", {status: 500})
    }
};