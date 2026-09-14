import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"

interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => React.ReactNode);
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyField?: keyof T; // default 'id'
}

export function DataTable<T extends { id?: string | number }>({
    columns,
    data,
    keyField = 'id' as keyof T
}: DataTableProps<T>) {

    if (!data || data.length === 0) {
        return (
            <Card className="p-8 text-center text-muted-foreground bg-muted/20 border-dashed">
                Keine Daten vorhanden.
            </Card>
        );
    }

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((col, index) => (
                            <TableHead key={index} className={col.className}>
                                {col.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row, rowIndex) => (
                        <TableRow key={String(row[keyField] || rowIndex)}>
                            {columns.map((col, colIndex) => (
                                <TableCell key={colIndex} className={col.className}>
                                    {typeof col.accessor === 'function'
                                        ? col.accessor(row)
                                        : (row[col.accessor] as React.ReactNode)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
