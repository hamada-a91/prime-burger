import { useState } from 'react';
import { Clock, Plus, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useContactSlots, useCreateSlot, useDeleteSlot } from '@/hooks/api';
import { toast } from 'sonner';

export function ContactSlots() {
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [newTime, setNewTime] = useState('12:00');

    const { data: slots, isLoading, error } = useContactSlots(selectedDate);
    const createSlot = useCreateSlot();
    const deleteSlot = useDeleteSlot();

    const handleAddSlot = () => {
        if (!newTime) return;
        toast.promise(createSlot.mutateAsync({ date: selectedDate, time: newTime }), {
            loading: 'Wird hinzugefügt...',
            success: 'Slot hinzugefügt!',
            error: 'Fehler beim Hinzufügen',
        });
    };

    const handleDeleteSlot = (id: number) => {
        toast.promise(deleteSlot.mutateAsync(id), {
            loading: 'Wird gelöscht...',
            success: 'Slot gelöscht!',
            error: 'Fehler beim Löschen',
        });
    };

    if (error) {
        return (
            <div className="p-8 text-center text-destructive">
                <p>Fehler beim Laden der Termine.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold mb-6">Terminverwaltung</h1>
                <p className="text-muted-foreground mb-4">Wählen Sie ein Datum, um Verfügbarkeiten zu verwalten.</p>

                <div className="border rounded-lg p-4 bg-card">
                    <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full"
                    />
                </div>
            </div>

            <div>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Slots für {new Date(selectedDate).toLocaleDateString('de-DE')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <Skeleton key={i} className="h-14 w-full" />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {slots && slots.length > 0 ? (
                                    slots.map(slot => (
                                        <div key={slot.id} className="flex items-center justify-between p-3 border rounded-md bg-card hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-mono font-medium">{slot.time}</span>
                                                {slot.is_available ? (
                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Frei</span>
                                                ) : (
                                                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Gebucht: {slot.booked_by}</span>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                onClick={() => handleDeleteSlot(slot.id)}
                                                disabled={deleteSlot.isPending}
                                            >
                                                {deleteSlot.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        Keine Termine für diesen Tag definiert.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-6 pt-6 border-t">
                            <h3 className="text-sm font-medium mb-3">Neuen Slot hinzufügen</h3>
                            <div className="flex gap-2">
                                <Input
                                    type="time"
                                    className="w-32"
                                    value={newTime}
                                    onChange={(e) => setNewTime(e.target.value)}
                                />
                                <Button
                                    onClick={handleAddSlot}
                                    disabled={createSlot.isPending}
                                >
                                    {createSlot.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                    Hinzufügen
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
