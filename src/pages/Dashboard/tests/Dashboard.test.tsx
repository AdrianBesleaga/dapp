import React from "react";
import { contractAddress as configContractAddress } from "config";
import { routeNames } from "routes";
import { renderWithRouter, testAddress } from "testUtils";
import { accountBalance } from "../../../testUtils/rawData";

jest.mock("@elrondnetwork/dapp", () => {
  const dapp = jest.requireActual("@elrondnetwork/dapp");
  const { ChainID } = jest.requireActual("@elrondnetwork/erdjs/out");

  return {
    ...dapp,
    useContext: () => ({
      address: testAddress,
      account: accountBalance.data.account,
      chainId: new ChainID("T"),
    }),
    Authenticate: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});

describe("Dashboard page", () => {
  it("shows a spinner while loading transactions", async () => {
    const screen = renderWithRouter({
      route: `${routeNames.dashboard}?address=${testAddress}`,
    });
    expect(screen.history.location.pathname).toBe(routeNames.dashboard);
    const loader = await screen.findByTestId("loader");
    expect(loader).toBeDefined();
  });
  it("shows top info screen", async () => {
    const screen = renderWithRouter({
      route: `${routeNames.dashboard}?address=${testAddress}`,
    });
    const topInfo = await screen.findByTestId("topInfo");
    expect(topInfo).toBeDefined();

    const accountAddress = screen.getByTestId("accountAddress");
    expect(accountAddress.innerHTML).toBe(testAddress);

    const contractAddress = screen.getByTestId("contractAddress");
    expect(contractAddress.innerHTML).toBe(configContractAddress);

    const balance: any = screen.getByTestId("balance");
    expect(balance.querySelector(".int-amount").textContent).toBe("3,859");
    expect(balance.querySelector(".decimals").textContent).toBe(".83");
  });
  it("shows transactions list", async () => {
    const screen = renderWithRouter({
      route: `${routeNames.dashboard}?address=${testAddress}`,
    });
    const transactionsList = await screen.findByTestId("transactionsList");
    expect(transactionsList.childElementCount).toBe(6);
  });
});
