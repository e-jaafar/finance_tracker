import { Timestamp } from "firebase/firestore";

export type Frequency = "weekly" | "monthly" | "yearly";

export interface RecurringTransaction {
    id?: string;
    amount: number;
    category: string;
    description: string;
    type: "income" | "expense";
    frequency: Frequency;
    startDate: Timestamp;
    nextDueDate: Timestamp;
    lastProcessedDate?: Timestamp;
    userId: string;
    isActive: boolean;
}
