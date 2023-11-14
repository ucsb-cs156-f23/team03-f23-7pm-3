import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestCreatePage from "main/pages/HelpRequest/HelpRequestCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("HelpRequestCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const helpRequest = {
            id: 17,
            requestEmail: "cgaucho@ucsb.edu",
            teamId: "f23-5pm-1",
            tableOrBreakoutRoom: "11",
            requestTime: "2022-02-02T00:00",
            explanation: "Need help with dokku",
            solved: false
        };

        axiosMock.onPost("/api/helprequest/post").reply( 202, helpRequest );

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("HelpRequestForm-requestEmail")).toBeInTheDocument();
        });

        const requestEmailField = screen.getByTestId("HelpRequestForm-requestEmail");
        const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
        const tableOrBreakoutRoomField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
        const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
        const explanationField = screen.getByTestId("HelpRequestForm-explanation");
        const solvedField = screen.getByTestId("HelpRequestForm-solved");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.change(requestEmailField, { target: { value: 'cgaucho@ucsb.edu' } });
        fireEvent.change(teamIdField, { target: { value: 'f23-5pm-1' } });
        fireEvent.change(tableOrBreakoutRoomField, { target: { value: '11' } });
        fireEvent.change(requestTimeField, { target: { value: '2022-02-02T00:00' } });
        fireEvent.change(explanationField, { target: { value: 'Need help with dokku' } });
        fireEvent.change(solvedField, { target: { value: false } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
            "solved": "false",
            "explanation": "Need help with dokku",
            "requestTime": "2022-02-02T00:00",
            "tableOrBreakoutRoom": "11",
            "teamId": "f23-5pm-1",
            "requestEmail": "cgaucho@ucsb.edu"           
        });

        expect(mockToast).toBeCalledWith("New helpRequest Created - id: 17 requester's email: cgaucho@ucsb.edu");
        expect(mockNavigate).toBeCalledWith({ "to": "/helprequest" });
    });


});