import useUser from "@/hooks/useUser";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createWrapper } from "../utils/renderWithProviders";

describe('useUser', () => {
    it('returns user data', async () => {
        const {result} =renderHook(
            () => useUser(),
            {wrapper: createWrapper()}
        );
        await waitFor(() => expect (result.current.isSuccess).toBe(true))
    })
})