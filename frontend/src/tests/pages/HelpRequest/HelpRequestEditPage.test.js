import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import HelpRequestEditPage from "main/pages/HelpRequest/HelpRequestEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("HelpRequestEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/helprequest", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit HelpRequest");
            expect(screen.queryByTestId("HelpRequestForm-requestEmail")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/helprequest", { params: { id: 17 } }).reply(200, {
                id: 17,
                requestEmail: "cgaucho@ucsb.edu",
                teamId: "f23-5pm-1",
                tableOrBreakoutRoom: "11",
                requestTime: "2022-02-02T00:00",
                explanation: "Need help with dokku",
                solved: "false"
            });
            axiosMock.onPut('/api/helprequest').reply(200, {
                id: 17,
                requestEmail: "cgaucho1@ucsb.edu",
                teamId: "f23-5pm-2",
                tableOrBreakoutRoom: "12",
                requestTime: "2022-02-03T00:00",
                explanation: "Need help with swagger",
                solved: "true"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("HelpRequestForm-requestEmail");

            const idField = screen.getByTestId("HelpRequestForm-id");
            const requestEmailField = screen.getByTestId("HelpRequestForm-requestEmail");
            const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
            const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
            const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
            const explanationField = screen.getByTestId("HelpRequestForm-explanation");
            const solvedField = screen.getByTestId("HelpRequestForm-solved");
            const submitButton = screen.getByTestId("HelpRequestForm-submit");

            expect(idField).toHaveValue("17");
            expect(requestEmailField).toHaveValue("cgaucho@ucsb.edu");
            expect(teamIdField).toHaveValue("f23-5pm-1");
            expect(tableOrBreakoutRoomField).toHaveValue("11");
            expect(requestTimeField).toHaveValue("2022-02-02T00:00");
            expect(explanationField).toHaveValue("Need help with dokku");
            expect(solvedField).toHaveValue("false");
            expect(submitButton).toBeInTheDocument();
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("HelpRequestForm-requestEmail");

            const idField = screen.getByTestId("HelpRequestForm-id");
            const requestEmailField = screen.getByTestId("HelpRequestForm-requestEmail");
            const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
            const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
            const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
            const explanationField = screen.getByTestId("HelpRequestForm-explanation");
            const solvedField = screen.getByTestId("HelpRequestForm-solved");
            const submitButton = screen.getByTestId("HelpRequestForm-submit");

            expect(idField).toHaveValue("17");
            expect(requestEmailField).toHaveValue("cgaucho@ucsb.edu");
            expect(teamIdField).toHaveValue("f23-5pm-1");
            expect(tableOrBreakoutRoomField).toHaveValue("11");
            expect(requestTimeField).toHaveValue("2022-02-02T00:00");
            expect(explanationField).toHaveValue("Need help with dokku");
            expect(solvedField).toHaveValue("false");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(requestEmailField, { target: { value: 'cgaucho1@ucsb.edu' } });
            fireEvent.change(teamIdField, { target: { value: 'f23-5pm-2' } });
            fireEvent.change(tableOrBreakoutRoomField, { target: { value: '12' } });
            fireEvent.change(requestTimeField, { target: { value: '2022-02-03T00:00' } });
            fireEvent.change(explanationField, { target: { value: 'Need help with swagger' } });
            fireEvent.change(solvedField, { target: { value: "true" } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("HelpRequest Updated - id: 17 requester's email: cgaucho1@ucsb.edu");
            expect(mockNavigate).toBeCalledWith({ "to": "/helprequest" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                requestEmail: "cgaucho1@ucsb.edu",
                teamId: "f23-5pm-2",
                tableOrBreakoutRoom: "12",
                requestTime: "2022-02-03T00:00",
                explanation: "Need help with swagger",
                solved: "true"
            })); // posted object

        });
       
    });
});

