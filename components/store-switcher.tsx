"use client";

import { Store } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown, PlusCircle, Search, Store as StoreIcon} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";


type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps {
    items: Store[];
};
const StoreSwitcher = ({
    className,
    items = [],
}: StoreSwitcherProps) => {
    const [search, setSearch] = useState("");

    const storeModal = useStoreModal();
    const params = useParams();
    const router = useRouter();

    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id
    }));

    const filteredItems = formattedItems?.filter((item) => {
        return item.label.toLowerCase().includes(search.toLowerCase());
    })

    const currentStore = formattedItems.find((item) => item.value === params.storeId);

    const [open, setOpen] = useState(false);

    const onStoreSelect = (store: {value: string, label: string}) => {
        setOpen(false);
        router.push(`/${store.value}`);
    }
    return ( 
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" role="combobox" aria-expanded={open} aria-label="Select a store" className={cn("w-[200px] justify-between", className)}>
                    <StoreIcon className="mr-2 h-4 w-4" />
                    {currentStore?.label}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <div className="my-[0.5px] flex items-center gap-x-1 p-2">
                    <Search className="h-4 w-4"/>
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search store..."
                        className="h-6 px-1 focus-visible:ring-transparent bg-secondary"
                    />
                </div>
                <div>
                <Separator />
                <p className="hidden last:block text-sm text-center text-muted-foreground my-1">
                    No Store Found
                </p>
                {filteredItems?.map((store) => (
                    <div
                        key={store.value}
                        onClick={() => onStoreSelect(store)}
                        style={{paddingLeft: "8px"}}
                        className="py-1 pl-2 pr-2 w-full hover:bg-primary/5 gap-x-1 flex items-center cursor-pointer"
                    >
                        <StoreIcon className="h-4 w-4 mr-2"/>
                        {store.label}
                        <Check 
                            className={cn("ml-auto h-4 w-4",currentStore?.value === store.value ? "opacity-100" : "opacity-0")}
                        />
                    </div>
                ))}
                </div>
                <Separator />
                <div 
                    className="flex items-center gap-x-1 hover:bg-primary/5 py-1 pl-2 cursor-pointer" 
                    onClick={() => {
                        setOpen(false);
                        storeModal.onOpen();
                    }}
                >
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Create Store
                </div>
            </PopoverContent>
        </Popover>
     );
}
 
export default StoreSwitcher;