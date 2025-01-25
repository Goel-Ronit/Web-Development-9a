import prismadb from "@/lib/prismadb";
import ColorClient from "./_components/client";
import { ColorColumn } from "./_components/columns";
import {format} from 'date-fns';

const ColorsPage = async ({
    params
}: {
    params: Promise<{ storeId: string}>
}) => {
    const param = await params;
    const colors = await prismadb.color.findMany({
        where: {
            storeId: param.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedColors: ColorColumn[] = colors.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt:format(item.createdAt, "MMMM do, yyyy")
    }));
    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ColorClient data={formattedColors}/>
            </div>
        </div>
     );
}
 
export default ColorsPage;