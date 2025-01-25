import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(
    req: Request,
    {params} : {params: Promise<{categoryId: string}>}
) {
    try{
        const param = await params;

        if (!param.categoryId) {
            return new NextResponse("Category id is required", {status: 400});
        }

        const category = await prismadb.category.findUnique({
            where:  {
                id: param.categoryId
            },
            include: {
                billboard: true
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        return new NextResponse("Internal Error", {status: 500})
    }
};
export async function PATCH(
    req: Request,
    {params} : {params: Promise<{storeId: string, categoryId: string}>}
) {
    try{
        const {userId} = await auth();
        const body = await req.json();
        const param = await params;

        const {name, billboardId} = body;

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if  (!name) {
            return new NextResponse("Name is required", {status: 400});
        }

        if  (!billboardId) {
            return new NextResponse("BillboardId is required", {status: 400});
        }

        if (!param.categoryId) {
            return new NextResponse("Category id is required", {status: 400});
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

        const category = await prismadb.category.updateMany({
            where:  {
                id: param.categoryId,
            },
            data: {
                name,
                billboardId
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        return new NextResponse("Internal Error", {status: 500})
    }
};

export async function DELETE(
    req: Request,
    {params} : {params: Promise<{storeId: string, categoryId: string}>}
) {
    try{
        const {userId} = await auth();
        const param = await params;

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if (!param.categoryId) {
            return new NextResponse("Category id is required", {status: 400});
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

        const category = await prismadb.category.deleteMany({
            where:  {
                id: param.categoryId
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        return new NextResponse("Internal Error", {status: 500})
    }
};