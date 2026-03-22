import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MarketTable } from "../../src/components/market/MarketTable";

describe("MarketTable", () => {
  it("renders market row link to coin details", () => {
    render(
      <MemoryRouter>
        <MarketTable
          rows={[
            {
              id: "bitcoin",
              name: "Bitcoin",
              symbol: "BTC",
              binanceSymbol: "BTCUSDT",
              rank: 1,
              price: 60000,
              percentChange24h: 2,
              marketCap: 1000000,
              volume24h: 100000,
              circulatingSupply: 19000000,
            },
          ]}
        />
      </MemoryRouter>,
    );

    const coinLink = screen.getByRole("link", { name: /bitcoin/i });
    expect(coinLink).toHaveAttribute("href", "/coins/BTCUSDT");
    expect(screen.getByText("BTC")).toBeInTheDocument();
  });
});
