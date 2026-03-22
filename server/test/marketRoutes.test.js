const request = require("supertest");
const { createApp } = require("../app");

jest.mock("axios", () => {
  const get = jest.fn();
  return {
    create: jest.fn(() => ({ get })),
    __getMock: () => get,
  };
});

const axios = require("axios");

describe("GET /api/markets", () => {
  const env = {
    clientUrl: "http://localhost:5173",
    mongodbUri: "mongodb://localhost/test",
    jwtAccessSecret: "access",
    jwtRefreshSecret: "refresh",
    accessTokenTtl: "15m",
    refreshTokenTtl: "7d",
  };

  beforeEach(() => {
    axios.create.mockClear();
    axios.__getMock().mockReset();
  });

  it("returns normalized market rows", async () => {
    const mockGet = axios.__getMock();
    mockGet
      .mockResolvedValueOnce({
        data: [
          {
            id: "bitcoin",
            name: "Bitcoin",
            symbol: "btc",
            image: "img",
            market_cap_rank: 1,
            current_price: 65000,
            market_cap: 1_000_000,
            total_volume: 800_000,
            circulating_supply: 19_000_000,
            price_change_percentage_24h: 2.3,
            price_change_percentage_1h_in_currency: 0.2,
            price_change_percentage_7d_in_currency: 3.9,
          },
        ],
      })
      .mockResolvedValueOnce({
        data: {
          symbols: [{ symbol: "BTCUSDT" }],
        },
      });

    const app = createApp(env);
    const response = await request(app).get("/api/markets?limit=1");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.items[0]).toMatchObject({
      id: "bitcoin",
      symbol: "BTC",
      binanceSymbol: "BTCUSDT",
      rank: 1,
    });
  });

  it("validates limit", async () => {
    const app = createApp(env);
    const response = await request(app).get("/api/markets?limit=0");

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
