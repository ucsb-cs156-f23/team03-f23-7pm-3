import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { recommendationRequestFixtures} from "fixtures/recommendationRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("RecommendationRequestForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );
        await screen.findByText(/Requester Email/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a recommendationRequest", async () => {

        render(
            <Router  >
                <RecommendationRequestForm initialContents={recommendationRequestFixtures.oneRecommendation} />
            </Router>
        );
        await screen.findByTestId(/RecommendationRequestForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/RecommendationRequestForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestForm-dateRequested");

        // const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
        // const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
        // const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
        const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
        const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
        const doneField = screen.getByTestId("RecommendationRequestForm-done");
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");


        // fireEvent.change(requesterEmailField, { target: { value: 'bad-input' } });
        // fireEvent.change(professorEmailField, { target: { value: 'bad-input' } });
        // fireEvent.change(explanationField, { target: { value: 'bad-input' } });
        // fireEvent.change(dateRequestedField, { target: { value: 'bad-input' } });
        // fireEvent.change(dateNeededField, { target: { value: 'bad-input' } });
        fireEvent.change(doneField, { target: { value: 'true and more' } });
        fireEvent.click(submitButton);

        await screen.findByText(/Date Requested must be ISO format./);

        // await screen.findByText(/Requester Email is required./);
        // expect(screen.getByText(/Professor Email is required./)).toBeInTheDocument();
        // expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
        expect(screen.getByText(/Date Requested must be ISO format./)).toBeInTheDocument();
        expect(screen.getByText(/Date Needed must be ISO format./)).toBeInTheDocument();
        expect(screen.getByText(/Done must be true or false./)).toBeInTheDocument();
        
        fireEvent.change(dateRequestedField, { target: { value: 'bad-input' } });
        fireEvent.change(dateNeededField, { target: { value: 'bad-input' } });
        // fireEvent.change(doneField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await screen.findByText(/Date Requested must be ISO format./);

        // await screen.findByText(/Requester Email is required./);
        // expect(screen.getByText(/Professor Email is required./)).toBeInTheDocument();
        // expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
        expect(screen.getByText(/Date Requested must be ISO format./)).toBeInTheDocument();
        expect(screen.getByText(/Date Needed must be ISO format./)).toBeInTheDocument();
        expect(screen.getByText(/Done must be true or false./)).toBeInTheDocument();

        fireEvent.change(dateRequestedField, { target: { value: 'bad-input' } });
        fireEvent.change(dateNeededField, { target: { value: 'bad-input' } });
        fireEvent.change(doneField, { target: { value: 'falseyfalse' } });
        fireEvent.click(submitButton);
        
        await screen.findByText(/Date Requested must be ISO format./);

        // await screen.findByText(/Requester Email is required./);
        // expect(screen.getByText(/Professor Email is required./)).toBeInTheDocument();
        // expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
        expect(screen.getByText(/Date Requested must be ISO format./)).toBeInTheDocument();
        expect(screen.getByText(/Date Needed must be ISO format./)).toBeInTheDocument();
        expect(screen.getByText(/Done must be true or false./)).toBeInTheDocument();

        fireEvent.change(dateRequestedField, { target: { value: 'bad-input' } });
        fireEvent.change(dateNeededField, { target: { value: 'bad-input' } });
        // fireEvent.change(doneField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        
        fireEvent.change(dateRequestedField, { target: { value: 'bad-input' } });
        fireEvent.change(dateNeededField, { target: { value: 'bad-input' } });
        fireEvent.change(doneField, { target: { value: '' } });
        fireEvent.click(submitButton);
        
        await screen.findByText(/Date Requested must be ISO format./);

        // await screen.findByText(/Requester Email is required./);
        // expect(screen.getByText(/Professor Email is required./)).toBeInTheDocument();
        // expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
        expect(screen.getByText(/Date Requested must be ISO format./)).toBeInTheDocument();
        expect(screen.getByText(/Date Needed must be ISO format./)).toBeInTheDocument();
        expect(screen.getByText(/Done must be true or false./)).toBeInTheDocument();

    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestForm-submit");
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

        fireEvent.click(submitButton);


        await screen.findByText(/Requester Email is required./);
        expect(screen.getByText(/Requester Email is required./)).toBeInTheDocument();
        expect(screen.getByText(/Professor Email is required./)).toBeInTheDocument();
        expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
        // expect(screen.getByText(/Date Requested must be ISO format./)).toBeInTheDocument();
        // expect(screen.getByText(/Date Needed must be ISO format./)).toBeInTheDocument();
        // expect(screen.getByText(/Done must be true or false./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <RecommendationRequestForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestForm-requesterEmail");

        const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
        const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
        const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
        const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
        const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
        const doneField = screen.getByTestId("RecommendationRequestForm-done");
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

        fireEvent.change(requesterEmailField, { target: { value: 'cgaucho@ucsb.edu' } });
        fireEvent.change(professorEmailField, { target: { value: 'pconrad@ucsb.edu' } });
        fireEvent.change(explanationField, { target: { value: 'bs/ms program' } });
        fireEvent.change(dateRequestedField, { target: { value: '2022-01-02T12:00' } });
        fireEvent.change(dateNeededField, { target: { value: '2022-01-09T12:00' } });
        fireEvent.change(doneField, { target: { value: true } });
        fireEvent.click(submitButton);


        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
        expect(screen.queryByText(/Requester Email is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Professor Email is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Explanation is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Date Requested must be ISO format./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Date Needed must be ISO format./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Done must be true or false./)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestForm-cancel");
        const cancelButton = screen.getByTestId("RecommendationRequestForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


