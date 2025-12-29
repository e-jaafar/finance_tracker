import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    Timestamp
} from "firebase/firestore";
import { db } from "../firebase";
import type { RecurringTransaction } from "../types/recurring";

export const processRecurringTransactions = async (userId: string) => {
    try {
        const recurringRef = collection(db, `users/${userId}/recurring_transactions`);
        const q = query(recurringRef, where("isActive", "==", true));
        const snapshot = await getDocs(q);
        const now = new Date();

        const processedUpdates = [];

        for (const docSnapshot of snapshot.docs) {
            const recurring = docSnapshot.data() as RecurringTransaction;
            const recurringId = docSnapshot.id;
            let nextDue = recurring.nextDueDate.toDate();

            // Check if due
            // We loop in case multiple periods have passed (e.g. user offline for 2 months)
            let updatesMade = false;

            while (nextDue <= now) {
                // Create the transaction
                await addDoc(collection(db, `users/${userId}/transactions`), {
                    amount: recurring.amount,
                    category: recurring.category,
                    description: recurring.description + " (Recurring)",
                    date: Timestamp.fromDate(nextDue),
                    type: recurring.type,
                    userId: userId,
                    createdAt: Timestamp.now()
                });

                // Calculate next due date
                const nextDate = new Date(nextDue);
                if (recurring.frequency === "weekly") {
                    nextDate.setDate(nextDate.getDate() + 7);
                } else if (recurring.frequency === "monthly") {
                    nextDate.setMonth(nextDate.getMonth() + 1);
                } else if (recurring.frequency === "yearly") {
                    nextDate.setFullYear(nextDate.getFullYear() + 1);
                }

                nextDue = nextDate;
                updatesMade = true;
            }

            if (updatesMade) {
                const updateRef = doc(db, `users/${userId}/recurring_transactions`, recurringId);
                processedUpdates.push(updateDoc(updateRef, {
                    nextDueDate: Timestamp.fromDate(nextDue),
                    lastProcessedDate: Timestamp.now()
                }));
            }
        }

        await Promise.all(processedUpdates);
        if (processedUpdates.length > 0) {
            console.log(`Processed ${processedUpdates.length} recurring transactions.`);
        }
    } catch (error) {
        console.error("Error processing recurring transactions:", error);
    }
};

export const addRecurringTransaction = async (userId: string, data: Omit<RecurringTransaction, "id" | "userId" | "nextDueDate" | "isActive">) => {
    const startDate = data.startDate.toDate();
    // Next due date is the same as start date initially, or checks logic
    // Usually subsequent recurrence starts 1 period after? 
    // Or if "Start Date" is today, it triggers today?
    // Let's assume Start Date IS the first occurrence. 
    // If the user adds it today, and wants it to trigger today, nextDue should be today.

    // However, if we add it via the "Add Transaction" modal, we usually create the FIRST one immediately manually.
    // So the recurring rule should start NEXT period.

    const nextDue = new Date(startDate);
    if (data.frequency === "weekly") nextDue.setDate(nextDue.getDate() + 7);
    if (data.frequency === "monthly") nextDue.setMonth(nextDue.getMonth() + 1);
    if (data.frequency === "yearly") nextDue.setFullYear(nextDue.getFullYear() + 1);

    await addDoc(collection(db, `users/${userId}/recurring_transactions`), {
        ...data,
        userId,
        isActive: true,
        nextDueDate: Timestamp.fromDate(nextDue),
        lastProcessedDate: Timestamp.fromDate(startDate) // Mark the first one as "done" implicitly if we created it manually
    });
};
