import prismadb from "@/lib/prismadb";
import { CategoryColumn } from "./_components/columns";
import {format} from 'date-fns';
import CategoryClient from "./_components/client";

const CategoriesPage = async ({
    params
}: {
    params: Promise<{ storeId: string}>
}) => {
    const param = await params;
    const categories = await prismadb.category.findMany({
        where: {
            storeId: param.storeId
        },
        include: {
            billboard: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedCategories: CategoryColumn[] = categories.map((item) => ({
        id: item.id,
        name: item.name,
        billboardLabel: item.billboard.label,
        createdAt:format(item.createdAt, "MMMM do, yyyy")
    }));
    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryClient data={formattedCategories}/>
            </div>
        </div>
     );
}
 
export default CategoriesPage;