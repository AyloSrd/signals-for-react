import { createSignal } from "../../src";

export const numbers = createSignal<number[]>([])

export function addNumber(number: number) {
    numbers.value = numbers.value.concat(number)
}

export function removeNumber(number: number) {
    numbers.value = numbers.value.filter(n => n !== number)
}