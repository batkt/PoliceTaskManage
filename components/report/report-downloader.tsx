"use client";

import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, AlignmentType, WidthType, TextRun } from 'docx';


import React from 'react'
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { TaskReport } from '@/lib/types/task.types';
import { format } from 'date-fns';

const ReportDownloader = ({
    data = [],
    type = "weekly",
}: {
    data: TaskReport[];
    type?: string;
}) => {

    const handleDownloadDoc = async () => {
        const reportTitle = type === 'weekly' ? '7 ХОНОГИЙН' : 'САРЫН';
        const today = format(new Date(), 'yyyy оны MM дугаар сарын dd-ны өдөр');

        const tableRows = [
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: 'д/д', bold: true })] })]
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({ children: [new TextRun({ text: 'Хэрэгжүүлэх ажил, арга хэмжээ', bold: true })] })]
                    }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Биелэлт', bold: true })] })] }),
                ],
            }),
            ...data.map((row, idx) =>
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph(String(idx + 1))] }),
                        new TableCell({ children: [new Paragraph(row.title || '')] }),
                        new TableCell({ children: [new Paragraph(row.summary || '')] }),
                    ],
                })
            ),
        ];

        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        // ----- Баруун дээд булан -----
                        new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            children: [
                                new TextRun({ text: 'БАТЛАВ', bold: true }),
                            ],
                        }),
                        new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            children: [
                                new TextRun('ЗАХИРГААНЫ УДИРДЛАГЫН ХЭЛТСИЙН'),
                            ],
                        }),
                        new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            children: [
                                new TextRun('ДАРГА, ЦАГДААГИЙН ХУРАНДАА'),
                            ],
                        }),
                        new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            children: [new TextRun('Ц.НАРАНБААТАР')],
                        }),
                        new Paragraph({ text: '' }),
                        new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            children: [new TextRun(today)],
                        }),
                        new Paragraph({ text: '' }),

                        // ----- Төв гарчиг -----
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: { after: 200 },
                            children: [
                                new TextRun({
                                    text: `ТЭЭВРИЙН ЦАГДААГИЙН АЛБАНЫ ЗАХИРГААНЫ УДИРДЛАГЫН ХЭЛТСЭЭС ${reportTitle} ХУГАЦААНД ХИЙЖ ХЭРЭГЖҮҮЛСЭН АЖЛЫН ТӨЛӨВЛӨГӨӨНИЙ БИЕЛЭЛТ`,
                                    bold: true,
                                })]
                        }),
                        new Paragraph({
                            text: `(2025.10.01-2025.10.30)`,
                            alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({ text: '' }),

                        // ----- Огноо, байршил -----
                        new Paragraph({
                            text: `${today}                     Улаанбаатар хот`,
                            alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({ text: '' }),

                        // ----- Хүснэгт -----
                        new Table({
                            width: { size: 100, type: WidthType.PERCENTAGE },
                            rows: tableRows,
                        }),
                    ],
                },
            ],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `${reportTitle}.docx`);
    };

    return (
        <Button onClick={handleDownloadDoc}>
            <Plus className="mr-2 h-4 w-4" />
            Тайлан татах
        </Button>
    )
}

export default ReportDownloader