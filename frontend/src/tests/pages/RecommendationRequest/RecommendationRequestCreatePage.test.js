import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
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

describe("RecommendationRequestCreatePage tests", () => {

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
                    <RecommendationRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const recommendationRequest = {
            id: 1,
            requesterEmail: "cgaucho@ucsb.edu",
            professorEmail: "phtcon@ucsb.edu",
            explanation: "BS/MS program",
            dateRequested: "2022-02-02T00:00",
            dateNeeded: "2022-05-02T00:00",
            done: false
        };

        axiosMock.onPost("/api/recommendationrequest/post").reply( 202, recommendationRequest );

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("RecommendationRequestForm-requesterEmail")).toBeInTheDocument();
        });

        const requesterEmail = screen.getByTestId("RecommendationRequestForm-requesterEmail");
        const professorEmail = screen.getByTestId("RecommendationRequestForm-professorEmail");
        const explanation = screen.getByTestId("RecommendationRequestForm-explanation");
        const dateRequested = screen.getByTestId("RecommendationRequestForm-dateRequested");
        const dateNeeded = screen.getByTestId("RecommendationRequestForm-dateNeeded");
        const done = screen.getByTestId("RecommendationRequestForm-done");

        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

        fireEvent.change(requesterEmail, { target: { value: 'cgaucho@ucsb.edu' } });
        fireEvent.change(professorEmail, { target: { value: 'phtcon@ucsb.edu' } });
        fireEvent.change(explanation, { target: { value: 'BS/MS program' } });
        fireEvent.change(dateRequested, { target: { value: '2022-02-02T00:00' } });
        fireEvent.change(dateNeeded, { target: { value: '2022-05-02T00:00' } });
        fireEvent.change(done, { target: { value: 'false' } });


        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                "requesterEmail": "cgaucho@ucsb.edu",
                "professorEmail": "phtcon@ucsb.edu",
                "explanation": "BS/MS program",
                "dateRequested": "2022-02-02T00:00",
                "dateNeeded": "2022-05-02T00:00",
                "done": "false"
        });

        expect(mockToast).toBeCalledWith("New recommendationRequest Created - id: 1 requester email: cgaucho@ucsb.edu");
        expect(mockNavigate).toBeCalledWith({ "to": "/recommendationrequest" });
    });


});


