import { createSignal } from "../../src";

export const numbers = createSignal<number[]>([])
export const letters = createSignal<string[]>([])

export const appState = { numbers, letters }
export function addNumber(number: number) {
    numbers.value = numbers.value.concat(number)
}

export function removeNumber(number: number) {
    numbers.value = numbers.value.filter(n => n !== number)
}

export function addLetter(letter: string) {
    letters.value = letters.value.concat(letter)
}