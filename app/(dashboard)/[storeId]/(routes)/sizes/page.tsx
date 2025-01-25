import prismadb from "@/lib/prismadb";
import SizeClient from "./_components/client";
import { SizeColumn } from "./_components/columns";
import {format} from 'date-fns';

const SizesPage = async ({
    params
}: {
    params: Promise<{ storeId: string}>
}) => {
    const param = await params;
    const sizes = await prismadb.size.findMany({
        where: {
            storeId: param.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedSizes: SizeColumn[] = sizes.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt:format(item.createdAt, "MMMM do, yyyy")
    }));
    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizeClient data={formattedSizes}/>
            </div>
        </div>
     );
}
 
export default SizesPage;