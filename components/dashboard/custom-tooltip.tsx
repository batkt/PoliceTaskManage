"use client";

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-xl p-4">
                <p className="text-sm font-semibold text-foreground mb-3 pb-2 border-b">{label}</p>
                <div className="space-y-2">
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-sm shadow-sm"
                                    style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-xs text-muted-foreground">{entry.name}</span>
                            </div>
                            <span className="text-sm font-bold text-foreground tabular-nums">
                                {typeof entry.value === 'number' ? entry.value.toFixed(0) : entry.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

export default CustomTooltip;