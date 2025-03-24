import { type Tag } from "../types";

export const fetchTags = async (value: string): Promise<Tag[] | undefined> => {
    const response = await fetch(
        `https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete?value=${value}`
    );

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
};
