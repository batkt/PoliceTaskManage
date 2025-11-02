"use client";

import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, AlignmentType, WidthType, TextRun, BorderStyle, TabStopType } from 'docx';


import React, { useState } from 'react'
import { Button } from '../ui/button';
import { FileDown, Plus } from 'lucide-react';
import { TaskReport } from '@/lib/types/task.types';
import { format, formatDate } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader } from '../ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { UserSelect } from '../ui/user-select';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/lib/types/user.types';
import { useAuth } from '@/context/auth-context';
import { DateRangeType, getDateRange } from '@/lib/date.utils';

const ReportDownloader = ({
    data = [],
    type = "weekly",
}: {
    data: TaskReport[];
    type?: string;
}) => {

    const { authUser } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedUser, setSelectedUser] = useState<User>();
    const { toast } = useToast();

    const getPeriodName = (_type: string) => {
        switch (_type) {
            case "weekly":
                return "7 ХОНОГИЙН"
            case "monthly":
                return "САРЫН"
            case "quarterly":
                return "УЛИРАЛЫН"
            case "halfYearly":
                return "ХАГАС ЖИЛИЙН"
            case "yearly":
                return "ЖИЛИЙН"
        }
    }

    const getName = (user: User) => {
        return `${user?.surname?.[0]}.${user?.givenname}`
    }

    const getFullReportName = () => {
        let branchName = "ТЭЭВРИЙН ЦАГДААГИЙН АЛБА"
        if (!authUser?.branch?.isParent) {
            branchName = `ТЭЭВРИЙН ЦАГДААГИЙН АЛБА, ${authUser?.branch?.name}`
        }
        // ТЭЭВРИЙН ЦАГДААГИЙН АЛБА, МЭРГЭЖИЛТЭН, АХЛАХ Б.АНХБАЯР-Н 7 ХОНОГИЙН ХУГАЦААНД ХИЙЖ ХЭРЭГЖҮҮЛСЭН АЖЛЫН ТӨЛӨВЛӨГӨӨНИЙ БИЕЛЭЛТ
        return `${branchName}, ${authUser?.position}, ${authUser?.rank} ${getName(authUser as User)} ${getPeriodName(type)}-н ХУГАЦААНД ХИЙЖ ХЭРЭГЖҮҮЛСЭН АЖЛЫН ТӨЛӨВЛӨГӨӨНИЙ БИЕЛЭЛТ`.toUpperCase()
    }

    const getApproveTitle = () => {
        if (!selectedUser) {
            return ""
        }
        // ТЭЭВРИЙН ЦАГДААГИЙН АЛБА, МЭРГЭЖИЛТЭН, ХУРАНДАА А.БААТАР
        return `${selectedUser?.branch?.name}, ${selectedUser?.position}, ${selectedUser?.rank} ${getName(selectedUser)}`.toUpperCase()
    }

    const getReportDateRange = () => {
        const { startDate, endDate } = getDateRange(new Date(), type as DateRangeType);
        return `(${formatDate(startDate, 'yyyy.MM.dd')} - ${formatDate(endDate, 'yyyy.MM.dd')})`
    }

    const handleDownloadDoc = async () => {
        setIsSubmitting(true);
        try {
            if (!selectedUser) {
                toast({
                    title: 'Алдаа гарлаа',
                    description: 'Тайлан батлах алба хаагч сонгоно уу.',
                    variant: 'destructive',
                });
                return
            }
            const reportTitle = getPeriodName(type);
            const today = format(new Date(), 'yyyy оны MM дугаар сарын dd-ны өдөр');

            const tableRows = [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ children: [new TextRun({ text: 'д/д', bold: true })] })]
                        }),
                        new TableCell({
                            width: { size: 40, type: WidthType.PERCENTAGE },
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

            const approvedBox = new Table({
                alignment: AlignmentType.RIGHT,
                width: { size: 40, type: WidthType.PERCENTAGE },
                borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                },
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                borders: {
                                    top: { style: BorderStyle.NONE },
                                    bottom: { style: BorderStyle.NONE },
                                    left: { style: BorderStyle.NONE },
                                    right: { style: BorderStyle.NONE },
                                },
                                children: [
                                    new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        text: "БАТЛАВ"
                                    }),
                                    new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        text: getApproveTitle()
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            });

            const title = new Table({
                alignment: AlignmentType.CENTER, // Төвд байрлуулна
                width: { size: 90, type: WidthType.PERCENTAGE }, // 80% өргөн
                borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                },
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                borders: {
                                    top: { style: BorderStyle.NONE },
                                    bottom: { style: BorderStyle.NONE },
                                    left: { style: BorderStyle.NONE },
                                    right: { style: BorderStyle.NONE },
                                },
                                children: [
                                    new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        spacing: { after: 200 },
                                        children: [
                                            new TextRun({
                                                text: getFullReportName(),
                                                bold: true,
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                        ],
                    }),
                ],
            });

            const doc = new Document({
                sections: [
                    {
                        properties: {},
                        children: [
                            // ----- Баруун дээд булан -----
                            approvedBox,
                            new Paragraph({ text: '' }),
                            new Paragraph({
                                alignment: AlignmentType.RIGHT,
                                children: [new TextRun(today)],
                            }),
                            new Paragraph({ text: '' }),

                            // ----- Төв гарчиг -----
                            title,
                            new Paragraph({
                                text: getReportDateRange(),
                                alignment: AlignmentType.CENTER,
                            }),
                            new Paragraph({ text: '' }),

                            // ----- Огноо, байршил -----
                            new Paragraph({
                                tabStops: [
                                    { position: 9000, type: TabStopType.RIGHT }, // баруун талд tab байрлуулах
                                ],
                                children: [
                                    new TextRun(`${today}`),
                                    new TextRun({ text: "\tУлаанбаатар хот" }), // ← \t нь tab байрлал руу үсрэх
                                ],
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
        } catch (error) {
            let message = '';
            if (error instanceof Error) {
                message = error?.message;
            }
            toast({
                title: 'Алдаа гарлаа',
                description: message || 'Тайлан татах үед алдаа гарлаа. Дахин оролдоно уу.',
                variant: 'destructive',
            });
        }
    };

    const handleClose = () => {
        setIsOpen(false)
    }

    if (data && data?.length > 0) {
        return (
            <>
                <Button onClick={() => {
                    setIsOpen(true)
                }}>
                    <FileDown className="mr-2 h-4 w-4" />
                    Тайлан татах
                </Button>
                <Dialog open={isOpen} onOpenChange={handleClose}>
                    <DialogContent className="max-w-md p-6 max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <div className="flex items-center gap-2">
                                <div>
                                    <DialogTitle>Тайлан татах</DialogTitle>
                                    <DialogDescription>
                                        Тайланг батлах алба хаагчийн мэдэээллийг сонгоно уу
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <UserSelect
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e)}
                            onChangeUser={(user) => {
                                setSelectedUser(user)
                            }}
                            placeholder={'Алба хаагч сонгоно уу'}

                        />

                        <DialogFooter className="w-full !flex !items-center !justify-between">
                            <Button type="button" variant="outline" onClick={handleClose}>
                                Болих
                            </Button>
                            <Button type="button" disabled={isSubmitting} onClick={handleDownloadDoc}>
                                Тайлан татах
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </>
        )
    }
    return null
}

export default ReportDownloader