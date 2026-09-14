import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

// Simple Accordion Context to avoid Radix dependency for now
const AccordionContext = React.createContext<{
    activeItem: string | undefined;
    setActiveItem: (value: string | undefined) => void;
}>({ activeItem: undefined, setActiveItem: () => { } });

const AccordionItemContext = React.createContext<string>("");

const Accordion = React.forwardRef<HTMLDivElement, React.ComponentProps<"div"> & { type?: "single"; collapsible?: boolean, defaultValue?: string }>(
    ({ className, collapsible = true, defaultValue, children, ...props }, ref) => {
        const [activeItem, setActiveItem] = React.useState<string | undefined>(defaultValue);

        const handleSetActive = (value: string | undefined) => {
            if (collapsible && value === activeItem) {
                setActiveItem(undefined);
            } else {
                setActiveItem(value);
            }
        };

        return (
            <AccordionContext.Provider value={{ activeItem, setActiveItem: handleSetActive }}>
                <div ref={ref} className={className} {...props}>{children}</div>
            </AccordionContext.Provider>
        );
    }
)
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<HTMLDivElement, React.ComponentProps<"div"> & { value: string }>(
    ({ className, value, children, ...props }, ref) => {
        return (
            <AccordionItemContext.Provider value={value}>
                <div ref={ref} className={cn("border-b", className)} data-value={value} {...props}>
                    {children}
                </div>
            </AccordionItemContext.Provider>
        );
    }
)
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<HTMLButtonElement, React.ComponentProps<"button">>(
    ({ className, children, ...props }, ref) => {
        const { activeItem, setActiveItem } = React.useContext(AccordionContext);
        const value = React.useContext(AccordionItemContext);
        const isOpen = activeItem === value;

        return (
            <h3 className="flex">
                <button
                    ref={ref}
                    onClick={() => setActiveItem(value)}
                    className={cn(
                        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
                        className
                    )}
                    data-state={isOpen ? "open" : "closed"}
                    type="button"
                    {...props}
                >
                    {children}
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                </button>
            </h3>
        )
    }
)
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
    ({ className, children, ...props }, ref) => {
        const { activeItem } = React.useContext(AccordionContext);
        const value = React.useContext(AccordionItemContext);
        const isOpen = activeItem === value;

        if (!isOpen) return null;

        return (
            <div
                ref={ref}
                className="overflow-hidden text-sm"
                {...props}
            >
                <div className={cn("pb-4 pt-0", className)}>{children}</div>
            </div>
        )
    }
)
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
