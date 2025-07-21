"use client";

import { useEffect, useMemo, useState, FC } from "react";
import { Pie, PieChart, ResponsiveContainer, Cell, LabelList } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

import { fetchPieChartData } from "@/services/transaction";
import formatRupiah from "@/utils/formatRupiah";

interface ApiDataItem {
    name: string;
    value: number;
}

interface ChartDataItem extends ApiDataItem {
    fill: string;
    key: string;
}

const ChartPlaceholder: FC = () => (
    <div className="flex h-full w-full items-center justify-center">
        <p className="text-muted-foreground">Memuat data chart...</p>
    </div>
);

const renderCustomLegend = (props: any) => {
    const { payload } = props;
    return (
        <ul className="space-y-2 mt-4 w-full">
            {payload?.map((entry: any, index: number) => (
                <li
                    key={`item-${index}`}
                    className="flex items-center space-x-2 text-sm text-gray-800 dark:text-gray-200"
                >
                    <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span>{`${entry.value} - ${formatRupiah(
                        entry.payload.value
                    )}`}</span>
                </li>
            ))}
        </ul>
    );
};

export const ExpensePieChart: FC = () => {
    const [apiData, setApiData] = useState<ApiDataItem[]>([]);
    console.log(apiData);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const loadPieChartData = async () => {
        try {
            const res = await fetchPieChartData();
            setApiData(res.data);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "No pie chart data found for this user") {
                    setApiData([]);
                } else {
                    console.log({ message: error.message, type: "danger" });
                }
            } else {
                console.error({ message: "Terjadi Kesalahan", type: "danger" });
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadPieChartData();
    }, []);

    const { chartData, chartConfig } = useMemo(() => {
        const modernColors = [
            // Base Color
            "#0ABAB5",

            "#FFFACD", // Lemon Zest
            "#E6E6FA", // Soft Lavender
            "#FFDAB9", // Peach Sor bet
            "#F4A460", // Sandy Beige
            "#E3B778", // Muted Yellow
            "#CC5500", // Burnt Orange
            "#DAA520", // Rich Gold
        ];

        const config: ChartConfig = {
            value: { label: "Total" },
        };

        const data: ChartDataItem[] = apiData.map((item, index) => {
            const key = item.name.toLowerCase().replace(/ /g, "-");
            const color = modernColors[index % modernColors.length];
            config[key] = {
                label: item.name,
                color,
            };
            return {
                ...item,
                key,
                fill: color,
            };
        });

        return { chartData: data, chartConfig: config };
    }, [apiData]);

    return (
        <Card className="max-w-[80%] mx-auto rounded-2xl shadow-lg bg-white/90 dark:bg-[#121212]">
            <CardHeader className="items-center text-center">
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                    Pengeluaran per Kategori
                </CardTitle>
                <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                    Data Pengeluaran Bulan Ini
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <div className="w-full h-[550px]">
                    <ChartContainer
                        config={chartConfig}
                        className="w-full h-full"
                    >
                        {isLoading ? (
                            <ChartPlaceholder />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <ChartTooltip
                                        cursor={false}
                                        content={
                                            <ChartTooltipContent
                                                nameKey="name"
                                                hideLabel
                                            />
                                        }
                                    />
                                    <Pie
                                        data={chartData}
                                        dataKey="value"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={130}
                                        labelLine={true}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.fill}
                                            />
                                        ))}
                                    </Pie>
                                    <ChartLegend
                                        content={renderCustomLegend}
                                        className="mt-6 flex-wrap gap-2 *:basis-1/2 sm:*:basis-1/3 md:*:basis-1/4 *:justify-start text-sm font-medium"
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    );
};
