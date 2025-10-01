import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatAddress = (addr: string, start: number = 6, end: number = 4) => {
  return addr === "0x0000000000000000000000000000000000000000"
    ? "Empty"
    : `${addr.slice(0, start)}...${addr.slice(-end)}`;
};