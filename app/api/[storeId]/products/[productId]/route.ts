import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(
    req: Request,
    {params} : {params: Promise<{productId: string}>}
) {
    try{
        const param = await params;

        if (!param.productId) {
            return new NextResponse("Product id is required", {status: 400});
        }

        const product = await prismadb.product.findUnique({
            where:  {
                id: param.productId
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error", {status: 500})
    }
};
export async function PATCH(
    req: Request,
    {params} : {params: Promise<{storeId: string, productId: string}>}
) {
    try{
        const {userId} = await auth();
        const body = await req.json();
        const param = await params;

        const {name, price, categoryId, colorId, sizeId, images, isFeatured, isArchived} = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if (!name) {
            return new NextResponse("Name is required", {status: 400});
        }

        if (!price) {
            return new NextResponse("Price is required", {status: 400});
        }

        if (!categoryId) {
            return new NextResponse("Category Id is required", {status: 400});
        }

        if (!colorId) {
            return new NextResponse("Color Id is required", {status: 400});
        }

        if (!sizeId) {
            return new NextResponse("Size Id is required", {status: 400});
        }

        if (!images || !images.length) {
            return new NextResponse("Images are required", {status: 400});
        }
        
        if (!param.productId) {
            return new NextResponse("Product ID is required", {status: 400});
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
        await prismadb.product.update({
            where: {
                id: param.productId
            },
            data: {
                name,
                price,
                isFeatured,
                isArchived,
                categoryId,
                colorId,
                sizeId,
                images: {
                    deleteMany: {},
                }
            }
        });

        const product = await prismadb.product.update({
            where: {
                id: param.productId
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: {url: string}) => image)
                        ]
                    }
                }
            }
        })
        return NextResponse.json(product);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error", {status: 500})
    }
};

export async function DELETE(
    req: Request,
    {params} : {params: Promise<{storeId: string, productId: string}>}
) {
    try{
        const {userId} = await auth();
        const param = await params;

        if (!userId) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if (!param.productId) {
            return new NextResponse("Product id is required", {status: 400});
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

        const product = await prismadb.product.deleteMany({
            where:  {
                id: param.productId
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error", {status: 500})
    }
};