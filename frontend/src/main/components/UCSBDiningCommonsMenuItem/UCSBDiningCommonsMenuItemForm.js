import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

function UCSBDiningCommonsMenuItemForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all

    const navigate = useNavigate();

    const testIdPrefix = "UCSBDiningCommonsMenuItemForm";

    return (

        <Form onSubmit={handleSubmit(submitAction)}>

            <Row>

                {initialContents && (
                    <Col>
                        <Form.Group className="mb-3" >
                            <Form.Label htmlFor="id">Id</Form.Label>
                            <Form.Control
                                data-testid={testIdPrefix + "-id"}
                                id="id"
                                type="text"
                                {...register("id")}
                                value={initialContents.id}
                                disabled
                            />
                        </Form.Group>
                    </Col>
                )}

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="diningCommonsCode">diningCommonsCode</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-diningCommonsCode"}
                            id="diningCommonsCode"
                            type="text"
                            isInvalid={Boolean(errors.diningCommonsCode)}
                            {...register("diningCommonsCode", {
                                required: "Dining commons code is required.",
                                maxLength : {
                                    value: 30,
                                    message: "Max length 30 characters"
                                }
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.diningCommonsCode?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="name">Name</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-name"}
                            id="name"
                            type="text"
                            isInvalid={Boolean(errors.name)}
                            {...register("name", {
                                required: "Name is required.",
                                maxLength : {
                                    value: 40,
                                    message: "Max length 40 characters"
                                }
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>

                <Col>
                    <Form.Group className="mb-3" >
                        <Form.Label htmlFor="station">Station</Form.Label>
                        <Form.Control
                            data-testid={testIdPrefix + "-station"}
                            id="station"
                            type="text"
                            isInvalid={Boolean(errors.station)}
                            {...register("station", {
                                required: "Station is required.",
                                maxLength : {
                                    value: 50,
                                    message: "Max length 50 characters"
                                }
                            })}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.station?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Button
                        type="submit"
                        data-testid={testIdPrefix + "-submit"}
                    >
                        {buttonLabel}
                    </Button>
                    <Button
                        variant="Secondary"
                        onClick={() => navigate(-1)}
                        data-testid={testIdPrefix + "-cancel"}
                    >
                        Cancel
                    </Button>
                </Col>
            </Row>
        </Form>

    )
}

export default UCSBDiningCommonsMenuItemForm;
