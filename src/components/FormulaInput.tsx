import { useState } from "react";
import { useFormulaStore } from "../hooks/useFormulaStore";
import { TextField, Button, Box, Typography } from "@mui/material";
import { evaluate } from "mathjs";
import { useQuery } from "@tanstack/react-query";
import { type Tag } from "../types";

const fetchTags = async (value: string): Promise<Tag[] | undefined> => {
    const response = await fetch(
        `https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete?value=${value}`
    );

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
};

export const FormulaInput: React.FC = () => {
    const { setFormula, addTag, removeTag } = useFormulaStore();
    const [input, setInput] = useState<string>("");
    const [result, setResult] = useState<string | null>(null);
    const {
        data: suggestedTags,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["tags", input],
        queryFn: () => fetchTags(input),
        enabled: input.trim().length > 0,
        staleTime: 10000,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInput(newValue);
        setFormula(newValue);
        calculateResult(newValue);
    };

    const calculateResult = (expression: string) => {
        try {
            const sanitizedExpression = expression.replace(/\^/g, "**"); // Zamiana `^` na `**` dla potęgowania
            const evaluatedResult = evaluate(sanitizedExpression);

            if (
                typeof evaluatedResult === "number" &&
                isFinite(evaluatedResult)
            ) {
                setResult(evaluatedResult.toString());
            } else {
                setResult("Invalid");
            }
        } catch {
            setResult("Invalid");
        }
    };

    const handleTagClick = (tag: Tag) => {
        addTag(tag); // Dodajemy pełny obiekt tagu
        setInput(""); // Reset input po kliknięciu tagu
        calculateResult(tag.value.toString());
    };

    const handleTagRemove = (tagId: string) => {
        removeTag(tagId); // Usuwamy tag po jego ID
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && input === "") {
            const lastTag = useFormulaStore.getState().tags.slice(-1)[0];
            if (lastTag) removeTag(lastTag.id); // Usuwamy ostatni tag po ID
        }
    };

    return (
        <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 2 }}>
            <Typography variant="h5" gutterBottom>
                Formula Input
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <TextField
                    fullWidth
                    label="Enter formula"
                    variant="outlined"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
                <Typography
                    variant="h6"
                    sx={{
                        minWidth: 100,
                        textAlign: "center",
                        fontWeight: "bold",
                        color: result === "Invalid" ? "red" : "black",
                        backgroundColor: "#f0f0f0",
                        padding: "8px 12px",
                        borderRadius: "4px",
                    }}
                >
                    {result || "—"}
                </Typography>
            </Box>
            <Box mt={2}>
                {useFormulaStore.getState().tags.map((tag) => (
                    <Box
                        key={tag.id} // Używamy ID tagu jako klucza
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 1,
                            backgroundColor: "#f0f0f0",
                            padding: 1,
                            borderRadius: 2,
                        }}
                    >
                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                            {tag.name}
                        </Typography>
                        <Button
                            onClick={() => handleTagRemove(tag.id)} // Usuwamy po ID
                            variant="outlined"
                            color="error"
                            size="small"
                            sx={{ marginLeft: 1 }}
                        >
                            Remove
                        </Button>
                    </Box>
                ))}
            </Box>
            <Box mt={2}>
                {/* Wyświetlanie sugerowanych tagów */}
                {isLoading && <Typography>Loading...</Typography>}
                {isError && (
                    <Typography color="error">Error loading tags</Typography>
                )}
                {suggestedTags && suggestedTags.length > 0 && (
                    <Box>
                        <Typography variant="h6">Suggested Tags</Typography>
                        <Box>
                            {suggestedTags.map((tag: Tag, index: number) => (
                                <Button
                                    key={index} // Używamy ID jako klucza
                                    onClick={() => handleTagClick(tag)}
                                    variant="outlined"
                                    sx={{ marginRight: 1, marginBottom: 1 }}
                                >
                                    {tag.name}
                                </Button>
                            ))}
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
};
