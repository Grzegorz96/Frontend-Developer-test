import { evaluate } from "mathjs"; // Importowanie funkcji do obliczania formuł

// Funkcja do obliczania formuły
export const calculateFormula = (formula: string, setResult: any) => {
    try {
        const res = evaluate(formula); // Obliczanie formuły
        setResult(res.toString()); // Zapisz wynik
    } catch (error) {
        setResult("Błąd w formule"); // Obsługa błędów
    }
};

// const fetchSuggestions = async (input: string): Promise<string[]> => {
//     const response = await fetch(
//         `https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete?query=${input}`
//     );
//     const data = await response.json();
//     return data.suggestions;
// };
