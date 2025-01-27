import prismadb from "@/lib/prismadb";
import ProductClient from "./_components/client";
import { ProductColumn } from "./_components/columns";
import {format} from 'date-fns';
import { formatter } from "@/lib/utils";

const ProductPage = async ({
    params
}: {
    params: Promise<{ storeId: string}>
}) => {
    const param = await params;
    const products = await prismadb.product.findMany({
        where: {
            storeId: param.storeId
        },
        include: {
            category: true,
            size: true,
            color: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedProducts: ProductColumn[] = products.map((item) => ({
        id: item.id,
        name: item.name,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        price: formatter.format(item.price),
        category: item.category.name,
        size: item.size.value,
        color: item.color.value,
        createdAt:format(item.createdAt, "MMMM do, yyyy")
    }));
    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient data={formattedProducts}/>
            </div>
        </div>
     );
}
 
export default ProductPage;